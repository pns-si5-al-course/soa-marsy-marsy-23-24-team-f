import {} from 'dotenv/config';
import chalk from 'chalk';
import asciichart from 'asciichart';


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


// Fonction pour afficher les données sous forme de graphique textuel
function afficherGraphique(data, titre) {
    console.log(chalk.yellow(titre));
    console.log(asciichart.plot(data));
    console.log(); // Ligne vide pour séparer les sections
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
const post = async(url, data) => {
    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `${authToken}`
            },
            body: (data) ? JSON.stringify(data) : null
        });

        if (!response.ok) {
            throw new Error(`Erreur de requête HTTP - Code d'état HTTP : ${response.status}`);
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
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `${authToken}`
            },
        });
        if (!response.ok) {
            throw new Error(`Erreur de requête HTTP - Code d'état HTTP : ${response.status}`);
        }

        return response.json();
    } catch (error) {
        console.error(error.message);
        throw error;
    }
}




async function main() {
    console.log('Richard : chekings systems before launch');
    try {

        // Weather service
        console.log('----------------------------------')
        console.log('--- FIRST CHECK BEFORE LAUNCH ---');
        console.log('----------------------------------\n')
        console.log('Richard : asking weather status to weather dept');
        await sleep(500);
        console.log('-- GET weather-service:3002/status --');
        console.log('Tory : cheking the status of the weather')
        const weatherStatus = await get(weatherServiceUrl + "/status");
        console.log('Weather status : ', weatherStatus);
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
        console.log('-------------------------')
        console.log('----- LAUNCH SEQUENCE ---');
        console.log('-------------------------\n')
        await sleep(500);
        // Lancez la fusée si tous les systèmes sont prêts
        if (status.rocketReady && status.weatherReady) {
            console.log(chalk.green('Tous les systèmes sont prêts !'));
            console.log('Richard : demande au rocket dept de lancer la fusée');
            console.log('-- POST rocket-service:3001/rocket --');
            console.log(chalk.gray('IGNITION !'))
            await sleep(2000);
            const rocketLaunched = await post(rocketDeptServiceUrl + '/rocket', rocketStatus)
                .then((response) => {
                    console.log(chalk.gray('TAKEOFF : ', response));
                    return response;
                })
                .catch((error) => {
                    console.error('Error During TAKEOFF')
                    console.error(error);
                });


            sleep(1000);
            console.log('\nElon : surveillance du lancement de la fusée : ')

            const telemetrieInterval = setInterval(async() => {


                const telemetrics = await get(telemetrieServiceUrl + "/rocket/telemetrics")
                    .then((response) => {
                        const data = [response.speed];
                        const titre = 'Rocket Telemetrics - Altitude Speed';

                        afficherGraphique(data, titre);
                        return response;
                    });

                 const payloadTelemetrics = await get(payloadServiceUrl + "/rocket/payload/data")
                     .then((response) => {
                         const données = [response.altitude, response.speed];
                         const titre = 'Payload Telemetrics';
                         
                         afficherGraphique(données, titre);
                         return response;
                     });

            }, 2000); // 2 secondes d'intervalle
            setTimeout(async() => {
                clearInterval(telemetrieInterval);
                console.log('Richard : mission terminée');
                console.log('Stop simulation');
                await post("http://localhost:3001" + "/stop-simulation", {});
            }, 10000); // 10 secondes
        }

    } catch (error) {
        console.error(error);
    }


}

main();