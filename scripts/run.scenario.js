import chalk from "chalk";
import { io } from 'socket.io-client';
import {get, post, sleep, createFileIfNotExist } from "./utils.js";
import dotenv from "dotenv";
import { spawn } from 'child_process';
import { log } from "./logger.js";
import { readLastLine, readSync } from "./logReader.js";

dotenv.config();

if (process.argv.length < 3) {
    console.log('Usage: node run.scenario.js 1|2|3 [-d]');
    process.exit(1);
}

// -s : success scenario, -f : failure scenario
const scenario_id = process.argv[2];
const READ_INT = 1000;

const rocketDeptServiceUrl = process.env.ROCKET_DEPT_SERVICE_URL;
const weatherServiceUrl = process.env.WEATHER_SERVICE_URL;

const payloadServiceUrl = process.env.PAYLOAD_SERVICE_URL;
const rocketServiceUrl = process.env.ROCKET_SERVICE_URL;
const telemetrieServiceUrl = process.env.TELEMETRIE_SERVICE_URL;
const missionCommanderUrl = process.env.MISSION_COMMANDER_SERVICE_URL;

const logs_paths = {
    payload: process.env.PAYLOAD_LOGS,
    stage1: process.env.STAGE_1_LOGS,
    stage2: process.env.STAGE_2_LOGS,
    status: process.env.STATUS_LOGS,
    telemetries: process.env.TELEMETRIES_LOGS,
}

const status = {
    rocketReady: false,
    weatherReady: false,
    stageSeparated: false,
}

let interval= null;

// ------------------ SOCKET ------------------
const socket = io.connect(process.env.WS_URL);

socket.on('connect', () => {
    console.log(chalk.black.bgGreen('Connected to socket.io, will receive logs from logs.topic\n'));
    Object.keys(logs_paths).forEach((key) => {
        createFileIfNotExist(logs_paths[key]);
    })

    if (process.argv[3] === '-d') {
        // empty all logs files
        Object.keys(logs_paths).forEach((key) => {
            fs.writeFileSync(logs_paths[key], '');
        })
    }
})

socket.on('disconnect', () => {
    console.log('Disconnected from socket.io');
});

socket.on('logs', (data) => {
    // This socket is directly connected to the mission commander service
    // It receives all the logs from the mission, sent by the rocket
    // RICHARD VIEW
    const logs = JSON.parse(data).body;
    handleStatusChange(logs);
})



async function handleStatusChange(logs) {
    // for payload dept
    log(JSON.stringify(logs.payload), 'logs/payload.log');
    
    // for rocket dept
    log(JSON.stringify(logs.stages[0]), 'logs/stage1.log');

    // for rocket dept
    log(JSON.stringify(logs.stages[1]), 'logs/stage2.log');

    // for mission commander
    log(JSON.stringify(logs.status), 'logs/status.log');

    // full payload data
    log(JSON.stringify(logs), 'logs/telemetries.log');
    if(logs.stages[0].status === 'Separated' && status.stageSeparated === false) {
        status.stageSeparated = true;
        console.log(chalk.green('----------------------------------------'));
        console.log(chalk.green('---First Stage Separated Successfully---'));
        console.log(chalk.green('----------------------------------------'));
    }
    else if(logs.payload.status === 'Deployed' || logs.payload.status === 'Payload deployed') {
        console.log(chalk.green('----------------------------------------'));
        console.log(chalk.green('------Payload Deployed Successfully-----'));
        console.log(chalk.green('----------------------------------------'));
        console.log('Richard : mission terminée');
        console.log('Stop simulation');
        await post(rocketDeptServiceUrl + "/stop-simulation", {});
        clearInterval(interval);
        process.exit(0);
    }
    if (scenario_id === '2' || scenario_id === '3') {
        if(log.status === 'First Stage Seperation Failed') {
            console.log(chalk.red('First Stage Seperation Failed'));
            console.log('Richard : ordre de destruction de la fusée');
            await post(rocketDeptServiceUrl + "/stop-simulation", {});
            await post(missionCommanderUrl + "/rocket/destroy", {});
            console.log(chalk.red('Rocket is going to explode'));
            console.log(chalk.red('Payload is destroyed'));
            console.log(chalk.red('Rocket is destroyed'));
            console.log(chalk.red('Mission is failed'));
            clearInterval(interval);
            process.exit(0);
        }

        const int_fuel = setInterval(async () => {
            const fuel_1 = await get(rocketServiceUrl + "/rocket/fuelConsumption/0", {});
            const fuel_2 = await get(rocketServiceUrl + "/rocket/fuelConsumption/1", {});

            if(parseInt(fuel_1) > 150 || parseInt(fuel_2) > 150) {
                clearInterval(interval);
                clearInterval(int_fuel);
                console.log(chalk.red('FUEL LEAK DETECTED'));
                console.log('Richard : ordre de destruction de la fusée');
                console.log(chalk.red('--- CRITICAL FAILURE ---'));
                await post(rocketDeptServiceUrl + "/stop-simulation", {});
                await post(missionCommanderUrl + "/rocket/destroy", {});
                console.log(chalk.red('Payload is destroyed'));
                console.log(chalk.red('Rocket is destroyed'));
                console.log(chalk.red('Mission is failed'));
                
                process.exit(0);
            }
        }, 1000)
    }
}


// ------------------ ----- ------------------


async function main() {
    if (scenario_id === '1') {
        console.log(chalk.green('\n-------------------------------------'));
        console.log(chalk.green('--- SCENARIO 1: ORBITAL INSERTION ---'));
        console.log(chalk.green('-------------------------------------\n'));
    } else if (scenario_id === '2') {
        console.log(chalk.red('\n---------------------------------------------'));
        console.log(chalk.red('--- SCENARIO 2: FAILURE DURING SEPARATION ---'));
        console.log(chalk.red('---------------------------------------------\n'));
    }
    else if (scenario_id === '3') {
        console.log(chalk.red('\n------------------------------------------'));
        console.log(chalk.red('--- SCENARIO 3: MANUAL AUTODESTRUCTION ---'));
        console.log(chalk.red('------------------------------------------\n'));
    }
    await sleep(1000);

    console.log('Richard : chekings systems before launch');
    await sleep(1000);
    try {

        // Weather service
        console.log('\n----------------------------------')
        console.log('--- FIRST CHECK BEFORE LAUNCH ---');
        console.log('----------------------------------\n')
        console.log('Richard : asking weather status to weather dept');
        await sleep(500);
        console.log('-- GET weather-service:3002/status --');
        console.log('Tory : cheking the status of the weather')
        await sleep(1000);
        const weatherStatus = await get(weatherServiceUrl + "/status");
        console.log('Weather status : ', weatherStatus);
        await sleep(1000);
        if (weatherStatus.status === 'GO') {
            status.weatherReady = true;
            console.log(chalk.green('Tory : weather is good'));
        } else {
            console.log(chalk.red('Tory : weather is not good'));
        }

        console.log('\n-----------------------------------')
        console.log('--- SECOND CHECK BEFORE LAUNCH ---');
        console.log('-----------------------------------\n\n')
        console.log('-- GET payload-service:3001/rocket/status --');
        // Rocket service
        console.log('Richard : demande de statut au département fusée');
        await sleep(500);
        console.log('Elon : surveillance de la fusée')
        const rocketStatus = await get(rocketDeptServiceUrl + "/rocket/status");
        console.log('Statut de la fusée : ', rocketStatus);
        await sleep(1000);
        if (rocketStatus.status === 'GO') {
            // Chargez la fusée avec le payload
            console.log('Richard : demande au département fusée de charger le payload');
            console.log('-- POST rocket-service:3001/rocket/load --');

            const rocketLoaded = await post(rocketDeptServiceUrl + "/rocket/load")
                .then((r) => {
                    console.log(chalk.gray('Payload poste au r dept : '));
                })
                .catch(err => {
                    console.log(err)
                });
            console.log(chalk.gray('Payload chargé dans la fusée : '));
            // Après avoir chargé le payload, considérez la fusée comme prête
            status.rocketReady = true;
            console.log(chalk.green('Elon : la fusée est prête au lancement'));
        } else {
            console.log(chalk.red('Elon : la fusée n\'est pas prête au lancement'));
        }
        console.log(chalk.white.bgBlack('\n-------------------------'));
        console.log(chalk.white.bgBlack('----- LAUNCH SEQUENCE ---'));
        console.log(chalk.white.bgBlack('-------------------------\n'))
        await sleep(2000);
        // Lancez la fusée si tous les systèmes sont prêts
        if (status.rocketReady && status.weatherReady) {
            console.log(chalk.green('Tous les systèmes sont prêts !'));
            console.log('Richard : demande au rocket dept de lancer la fusée');
            console.log('-- POST rocket-service:3001/rocket --');
            rocketStatus.status = (scenario_id==='1') ? 'GO' :'Fail';
            const rocketLaunched = post(rocketDeptServiceUrl + '/rocket', rocketStatus)
                .then((r) => {
                    console.log(chalk.gray('Fusée lancée : '));
                })
                .catch((error) => {
                    console.error('Error During TAKEOFF')
                    console.error(error);
                });
            interval = setInterval(()=>{
                readLastLine('logs/payload.log');
            
            }, READ_INT);
            await sleep(2000);
        }

        if (scenario_id === '3') {
            setTimeout(async ()=>{
                await post(rocketServiceUrl + "/rocket/fuelLeak", {})
            }, 80000)
        }

        //spawn('gnome-terminal', ['--', 'bash', '-c', 'node logReader.js; read']);
    } catch (error) {
        console.error(error);
    }
}

main();
