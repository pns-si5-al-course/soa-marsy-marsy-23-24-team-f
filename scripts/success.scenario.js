import chalk from "chalk";
import { io } from 'socket.io-client';
import {get, post, sleep, printFormatedTelemetrics } from "./utils.js";
import dotenv from "dotenv";
dotenv.config();


const rocketDeptServiceUrl = process.env.ROCKET_DEPT_SERVICE_URL;
const weatherServiceUrl = process.env.WEATHER_SERVICE_URL;

const payloadServiceUrl = process.env.PAYLOAD_SERVICE_URL;
const rocketServiceUrl = process.env.ROCKET_SERVICE_URL;
const telemetrieServiceUrl = process.env.TELEMETRIE_SERVICE_URL;
const missionCommanderUrl = process.env.MISSION_COMMANDER_SERVICE_URL;

const status = {
    rocketReady: false,
    weatherReady: false,
    stageSeparated: false,
}


// ------------------ SOCKET ------------------
const socket = io.connect(process.env.WS_URL);

socket.on('connect', () => {
    console.log('Connected to socket.io');
})

socket.on('disconnect', () => {
    console.log('Disconnected from socket.io');
});

socket.on('logs', (data) => {
    // This socket is directly connected to the mission commander service
    // It receives all the logs from the mission, sent by the rocket
    // RICHARD VIEW

    console.log("receiving logs")
    const logs = JSON.parse(data).body;
    // console.log(logs);
    handleStatusChange(logs);
})


function handleStatusChange(logs) {
    console.log(logs.stages)
    if(logs.stages[0].status === 'separated') {
        status.stageSeparated = true;
        console.log(chalk.green('----------------------------------------'));
        console.log(chalk.green('---First Stage Separated Successfully---'));
        console.log(chalk.green('----------------------------------------'));
    }
}


// ------------------ ----- ------------------


async function main() {
    console.log(chalk.green('\n-------------------------------------'));
    console.log(chalk.green('--- SCENARIO 1: ORBITAL INSERTION ---'));
    console.log(chalk.green('-------------------------------------\n'));

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

        console.log('\n-------------------------------------')
        console.log('--- SECOND CHECK BEFORE LAUNCH ---');
        console.log('-------------------------------------\n\n')
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
                    console.log(r);
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
        console.log('\n-------------------------')
        console.log('----- LAUNCH SEQUENCE ---');
        console.log('-------------------------\n')
        await sleep(2000);
        // Lancez la fusée si tous les systèmes sont prêts
        if (status.rocketReady && status.weatherReady) {
            console.log(chalk.green('Tous les systèmes sont prêts !'));
            console.log('Richard : demande au rocket dept de lancer la fusée');
            console.log('-- POST rocket-service:3001/rocket --');
            const rocketLaunched = await post(rocketDeptServiceUrl + '/rocket', rocketStatus)
                .catch((error) => {
                    console.error('Error During TAKEOFF')
                    console.error(error);
                });
            await sleep(2000);

        }

    } catch (error) {
        console.error(error);
    }
}

main();


function startTelemetricsListening() {
    console.log('\nElon : surveillance du lancement de la fusée : ')
    const telemetrieInterval = setInterval(async() => {
        const telemetrics = await get(telemetrieServiceUrl + "/rocket/telemetrics")
            .then((response) => {
                console.log(chalk.yellow("Rocket telemetrics : \r"));
                console.log(response);

                if (response.status === 'First Stage Separated') {
                    console.log(chalk.green('---First Stage Separated Successfully---'));
                }


                return response;
            })
        sleep(500);
        const payloadTelemetrics = await get(payloadServiceUrl + "/rocket/payload/data")
            .then((response) => {
                console.log(chalk.yellow("Payload telemetrics : \r"));
                console.log(response);
                return response;
            })

    }, 2000); // 2 secondes d'intervalle
    setTimeout(async() => {
        clearInterval(telemetrieInterval);
        // Asking payload department if payload is deployed
        await sleep(2000);
        console.log('Gwynne : demande au payload dept si le payload est déployé correctement');
        console.log('-- GET payload-service:3004/rocket/payload/data --');
        const deployed = await get(payloadServiceUrl + "/rocket/payload/data");
        await sleep(1000);
        console.log(chalk.gray('Payload status : ', chalk.green(deployed.status)));
        await sleep(2000);

        console.log('Richard : mission terminée');
        console.log('Stop simulation');
        await post(rocketDeptServiceUrl + "/stop-simulation", {});
    }, 120000); // 120 secondes -- durée de la simulation de la mise en orbite
}