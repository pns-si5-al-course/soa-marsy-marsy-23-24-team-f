import {} from "dotenv/config";
import chalk from "chalk";

const rocketDeptServiceUrl = process.env.ROCKET_DEPT_SERVICE_URL;
const weatherServiceUrl = process.env.WEATHER_SERVICE_URL;
const authToken = process.env.AUTH_TOKEN;
const payloadServiceUrl = process.env.PAYLOAD_SERVICE_URL;
const rocketServiceUrl = process.env.ROCKET_SERVICE_URL;
const telemetrieServiceUrl = process.env.TELEMETRIE_SERVICE_URL;

const status = {
    rocketReady: false,
    weatherReady: false,
}

function sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}
const post = async(url, data) => {
    try {
        const response = await fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `${authToken}`,
            },
            body: data ? JSON.stringify(data) : null,
        });

        if (!response.ok) {
            throw new Error(
                `Erreur de requête HTTP - Code d'état HTTP : ${response.status}`
            );
        }

        return response;
    } catch (error) {
        console.error(error.message);
        throw error;
    }
};

const get = async(url) => {
    try {
        const response = await fetch(url, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                Authorization: `${authToken}`,
            },
        });
        if (!response.ok) {
            throw new Error(
                `Erreur de requête HTTP - Code d'état HTTP : ${response.status}`
            );
        }

        return response.json();
    } catch (error) {
        console.error(error.message);
        throw error;
    }
};

async function main() {
    console.log(chalk.green('\n----------------------------------'));
    console.log(chalk.green('SCENARIO 1: ORBITAL INSERTION'));
    console.log(chalk.green('----------------------------------\n'));

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

        console.log('-------------------------------------')
        console.log('--- SECOND CHECK BEFORE LAUNCH ---');
        console.log('-------------------------------------\n')
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
            console.log(chalk.red('Ignition sequence start...'))
            console.log(chalk.red('5...'));
            await sleep(1000);
            console.log(chalk.red('4...'));
            await sleep(1000);
            console.log(chalk.red('3...'));
            await sleep(1000);
            console.log(chalk.red('2...'));
            await sleep(1000);
            console.log(chalk.red('1...'));
            await sleep(1000);
            console.log(chalk.red('Liftoff !'));
            await sleep(2000);
            console.log(JSON.stringify(rocketStatus));
            const rocketLaunched = await post(rocketDeptServiceUrl + '/rocket', rocketStatus)
                .then((response) => {
                    console.log(chalk.red('LIFTOFF : ', response));
                    return response;
                })
                .catch((error) => {
                    console.error('Error During TAKEOFF')
                    console.error(error);
                });


            await sleep(2000);
            console.log('\nElon : surveillance du lancement de la fusée : ')

            const telemetrieInterval = setInterval(async() => {
                const telemetrics = await get(telemetrieServiceUrl + "/rocket/telemetrics")
                    .then((response) => {
                        console.log(chalk.yellow("Rocket telemetrics : \r"));
                        console.log(response);

                        if (response.status === 'First Stage Separated') {
                            console.log(chalk.green('---First Stage Separated Successfully---'));
                            clearInterval(telemetrieInterval);
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
                await post("http://localhost:3001" + "/stop-simulation", {});
            }, 120000); // 120 secondes -- durée de la simulation de la mise en orbite
        }

    } catch (error) {
        console.error(error);
    }
}

main();