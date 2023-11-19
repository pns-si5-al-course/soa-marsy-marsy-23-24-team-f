import chalk from "chalk";
import { io } from 'socket.io-client';
import {get, post, sleep, createFileIfNotExist } from "./utils.js";
import dotenv from "dotenv";
import { spawn } from 'child_process';
import { log } from "./logger.js";
import { readLastLine, readSync } from "./logReader.js";
import { stat } from "fs";

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

const FlightStatus = {
    rocketReady: false,
    weatherReady: false,
    stageSeparated: false,
    mainEngineStarted: false,
    maxQ: false,
    isFairingSeparated: false,
    secondEngineCutOff: false,
    
}

const StageFLightStatus = {
    firstStageLanding: false,
    entryBurn: false,
}

const status_update = {
    rocket: null,
    status: ''
}

const stage_status_update = {
    stage: null,
    status: ''
}


let interval= null;
let interval_stage = null;
let rocket_1 = null;

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
    if(logs.payload){
        handleAltitudeChange(logs);
        handleStatusChange(logs);
    } else {
        stage_status_update.stage = logs;
        handleStageStatusChange(logs);
        handleStageAltitudeChange(logs);
    }
})


async function handleStageStatusChange(logs) {
    log(JSON.stringify(logs), 'logs/booster.log');
    // for first stage
    if(StageFLightStatus.firstStageLanding === false){
        StageFLightStatus.firstStageLanding = true;
        stage_status_update.stage.status = 'Separated';
        stage_status_update.status = 'Flip maneuver';
        startStageUpdatinStatus();
    }

}

async function handleStageAltitudeChange(logs) {
    // for first stage
    if (logs.altitude >= 20_000 && StageFLightStatus.entryBurn === false) {
        stage_status_update.stage = logs;
        stage_status_update.status = 'Entry burn';
        StageFLightStatus.entryBurn = true;
    } else if (logs.altitude >= 500 && logs.altitude < 3000){
        stage_status_update.stage = logs;
        stage_status_update.status = 'Guidance';
    } else if (logs.altitude >= 50 && logs.altitude < 3000){
        stage_status_update.stage = logs;
        stage_status_update.status = 'Landing burn';
    }

}


async function handleAltitudeChange(logs) {
    
    if(logs.payload.altitude >= 60_000 && logs.payload.altitude <  70_000 && FlightStatus.maxQ === false) {
        status_update.status = "MaxQ";
        FlightStatus.maxQ = true;
    }
    else if(logs.payload.altitude >= 90_000 && logs.payload.altitude < 95_00 && FlightStatus.isFairingSeparated === false) {
        status_update.status = 'Fairing separation';
        FlightStatus.isFairingSeparated = true;

    } else if (logs.payload.altitude >= 130_000 && FlightStatus.secondEngineCutOff === false) {
        status_update.status = 'Second engine cut-off';
        FlightStatus.secondEngineCutOff = true;
    }
}



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

    // console.log(chalk.yellow('----------------------------------------'));
    // //console.log(logs.stages[0]);
    // console.log(chalk.yellow('----------------------------------------'));

    if(logs.status === 'Main engine cut-off' && FlightStatus.mainEngineStarted === false) {
        console.log(chalk.green('----------------------------------------'));
        console.log(chalk.green('---Main Engine Cut-Off Successfully-----'));
        console.log(chalk.green('----------------------------------------'));
        clearInterval(interval);
        console.log('First stage separation');
        FlightStatus.mainEngineStarted = true;
        await sleep(2000);
        status_update.rocket = logs;
        startUpdatinStatus();

        await sleep(1000);
        status_update.status = 'In flight';
    }

    if(logs.status === 'Stage separation') {
        console.log(chalk.green('----------------------------------------'));
        console.log(chalk.green('---First Stage Separation Successfully--'));
        console.log(chalk.green('----------------------------------------'));
        stage_status_update.status = 'Guidance';
    }

    if (logs.status === "Fairing separation") {
        console.log(chalk.green('----------------------------------------'));
        console.log(chalk.green('---Fairing Separation Successfully-----'));
        console.log(chalk.green('----------------------------------------'));
    }

    // if(logs.stages[0].status === 'Separated' && status.stageSeparated === false) {
    //     status.stageSeparated = true;
    //     console.log(chalk.green('----------------------------------------'));
    //     console.log(chalk.green('---First Stage Separated Successfully---'));
    //     console.log(chalk.green('----------------------------------------'));
    // }
    // else if(logs.payload.status === 'Deployed' || logs.payload.status === 'Payload deployed') {
    //     console.log(chalk.green('----------------------------------------'));
    //     console.log(chalk.green('------Payload Deployed Successfully-----'));
    //     console.log(chalk.green('----------------------------------------'));
    //     console.log('Richard : mission terminée');
    //     console.log('Stop simulation');
    //     await post(rocketDeptServiceUrl + "/stop-simulation", {});
    //     clearInterval(interval);
    //     process.exit(0);
    // }
    // if (scenario_id === '2' || scenario_id === '3') {
    //     if(log.status === 'First Stage Seperation Failed') {
    //         console.log(chalk.red('First Stage Seperation Failed'));
    //         if (scenario_id === '3') {console.log('Richard : ordre de destruction de la fusée');}
    //         await post(rocketDeptServiceUrl + "/stop-simulation", {});
    //         await post(missionCommanderUrl + "/rocket/destroy", {});
    //         console.log(chalk.red('Rocket is going to explode'));
    //         console.log(chalk.red('Payload is destroyed'));
    //         console.log(chalk.red('Rocket is destroyed'));
    //         console.log(chalk.red('Mission is failed'));
    //         clearInterval(interval);
    //         process.exit(0);
    //     }

    //     const int_fuel = setInterval(async () => {
    //         const fuel_1 = await get(rocketServiceUrl + "/rocket/fuelConsumption/0", {});
    //         const fuel_2 = await get(rocketServiceUrl + "/rocket/fuelConsumption/1", {});

    //         if(parseInt(fuel_1) > 150 || parseInt(fuel_2) > 150) {
    //             clearInterval(interval);
    //             clearInterval(int_fuel);
    //             await post(rocketDeptServiceUrl + "/stop-simulation", {});
    //             await post(missionCommanderUrl + "/rocket/destroy", {});
    //             console.log(chalk.red('FUEL LEAK DETECTED'));
    //             console.log(chalk.red('--- CRITICAL FAILURE ---'));
    //             console.log(chalk.red('--- SELF DESTRUCT ---'));
    //             console.log(chalk.red('Payload is destroyed'));
    //             console.log(chalk.red('Rocket is destroyed'));
    //             console.log(chalk.red('Mission is failed'));
                
    //             process.exit(0);
    //         }
    //     }, 1000)
    // }
}


// ------------------ ----- ------------------


async function main() {
    rocket_1 = await get(rocketServiceUrl + "/rocket/example")
    if (scenario_id === '1') {
        console.log(chalk.green.bgWhite('\n-------------------------------------'));
        console.log(chalk.green.bgWhite('--- SCENARIO 1: ORBITAL INSERTION ---'));
        console.log(chalk.green.bgWhite('-------------------------------------\n'));
    } else if (scenario_id === '2') {
        console.log(chalk.red.bgWhite('\n---------------------------------------------'));
        console.log(chalk.red.bgWhite('--- SCENARIO 2: FAILURE DURING SEPARATION ---'));
        console.log(chalk.red.bgWhite('---------------------------------------------\n'));
    }
    else if (scenario_id === '3') {
        console.log(chalk.red.bgWhite('\n--------------------------------------'));
        console.log(chalk.red.bgWhite('--- SCENARIO 3: MANUAL DESTRUCTION ---'));
        console.log(chalk.red.bgWhite('--------------------------------------\n'));
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
        const weatherStatus = await get(missionCommanderUrl + "/rocket/weatherDepartment/status");
        console.log('Weather status : ', weatherStatus);
        await sleep(1000);
        if (weatherStatus.status === 'GO') {
            FlightStatus.weatherReady = true;
            console.log(chalk.green('Tory : weather is good'));
        } else {
            console.log(chalk.red('Tory : weather is not good'));
        }

        console.log('\n-----------------------------------')
        console.log('--- SECOND CHECK BEFORE LAUNCH ---');
        console.log('-----------------------------------\n\n')
        console.log('-- GET rocket-service:3001/ --');
        // Rocket service
        console.log('Richard : demande de statut au département fusée');
        await sleep(500);
        console.log('Elon : surveillance de la fusée')
        const rocketStatus = await get(missionCommanderUrl + "/rocket/rocketDepartment/status");
        console.log('Statut de la fusée : ', rocketStatus);
        await sleep(1000);
        if (rocketStatus.status === 'ok') {
            // Chargez la fusée avec le payload
            console.log('Richard : demande au département fusée de charger le payload');
            console.log('-- POST '+ missionCommanderUrl+'/rocket/initiate-startup --');

            const request = 
            {
                rocket: rocket_1,
                weatherDepartmentStatus: weatherStatus.status,
                rocketDepartmentStatus: 'GO'
            }

            const rocketLoaded = await post(missionCommanderUrl + "/rocket/initiate-startup", request)
            
            console.log(chalk.gray('Payload chargé dans la fusée'));
            await sleep(1000);
            // Après avoir chargé le payload, considérez la fusée comme prête
            FlightStatus.rocketReady = true;
            console.log(chalk.green('Elon : la fusée est prête au lancement'));
            console.log(rocketLoaded);
            rocket_1 = rocketLoaded;
        } else {
            console.log(chalk.red('Elon : la fusée n\'est pas prête au lancement'));
        }
        console.log(chalk.white.bgBlack('\n-------------------------'));
        console.log(chalk.white.bgBlack('----- LAUNCH SEQUENCE ---'));
        console.log(chalk.white.bgBlack('-------------------------\n'))
        await sleep(2000);
        // Lancez la fusée si tous les systèmes sont prêts
        if (FlightStatus.rocketReady && FlightStatus.weatherReady) {
            console.log(chalk.green('Tous les systèmes sont prêts !'));
            console.log('Richard : demande au rocket dept de lancer la fusée');
            console.log('-- POST mission-commander:3006/rocket/initiate-main-engine-start --');
            rocketStatus.status = (scenario_id==='1') ? 'GO' :'Fail';


            const rocket_engine_started = await post(missionCommanderUrl + '/rocket/initiate-main-engine-start', rocket_1);
            rocket_1 = rocket_engine_started;
            let timestamp = new Date();
            timestamp.setSeconds(timestamp.getSeconds() + 60);
            rocket_1.timestamp = timestamp;

            const rocket_liftoff = await post(missionCommanderUrl + '/rocket/initiate-liftoff', rocket_1);
            rocket_1 = rocket_liftoff;

            status_update.rocket = rocket_1;
            status_update.status = 'In flight';
            
            startUpdatinStatus();
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



async function startUpdatinStatus() {
    interval = setInterval(async ()=>{
        status_update.rocket.time += READ_INT/1000;   
        const rocket_in_flight = await post(rocketServiceUrl + '/rocket/status', status_update);
        status_update.rocket = rocket_in_flight;
        // console.log(chalk.yellow('----------------------- Rocket Logs --------------------'));
        // console.log(status_update.rocket.stages);
        // console.log(status_update.status);
        // console.log(chalk.yellow('--------------------------------------------------------'));
        //readLastLine('logs/payload.log');
        
    }, READ_INT);
}

async function startStageUpdatinStatus() {
    interval_stage = setInterval(async ()=>{
        stage_status_update.stage.time += READ_INT/1000;   
        const stage_in_flight = await post(rocketServiceUrl + '/rocket/stage/status', stage_status_update);
        stage_status_update.stage = stage_in_flight;
        console.log(chalk.green('------------ Stage 1 logs ---------------------'));
        console.log(stage_status_update.stage);
        console.log(chalk.green('-----------------------------------------------'));
        //readLastLine('logs/payload.log');
        
    }, READ_INT);
}
