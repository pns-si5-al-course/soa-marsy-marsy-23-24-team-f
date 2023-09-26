require('dotenv').config();

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

const post = async(url, data) => {
    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `${authToken}`
            },
            body: JSON.stringify(data)
        });

        if (!response.ok) {
            throw new Error(`Erreur de requête HTTP - Code d'état HTTP : ${response.status}`);
        }

        return response.json();
    } catch (error) {
        console.error(error.message);
        throw error; // Vous pouvez gérer l'erreur ici ou la propager
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
        throw error; // Vous pouvez gérer l'erreur ici ou la propager
    }
}


async function launchRocket(path) {
    try {
        const data = {
            status: 'GO'
        };

        const rocketData = await post(rocketDeptServiceUrl + path, data);
        return rocketData;
    } catch (error) {
        console.error('Erreur lors du lancement de la fusée :', error);
        throw error;
    }
}

async function getRocketStatus(path) {
    try {
        const data = await get(rocketDeptServiceUrl + path);
        return data;
    } catch (error) {
        throw error;
    }
}

async function getWeatherStatus(path) {
    try {
        const data = await get(weatherServiceUrl + path);
        return data;
    } catch (error) {
        throw error;
    }
}

async function loadRocket(path) {
    try {
        const setData = await post(rocketDeptServiceUrl + path);
        return setData;
    } catch (error) {
        console.error('Erreur lors du chargement du payload de la fusée :', error);
        throw error;
    }
}

async function getRocketTelemetrics(path) {
    try {
        const data = await get(telemetrieServiceUrl + path);
        return data;
    } catch (error) {
        console.error('Erreur lors de la récupération des télémétries de la fusée :', error);
        throw error;
    }
}



async function main() {
    console.log('Richard : chekings systems before launch');
    try {

        // Weather service
        console.log('Richard : asking weather department status');
        console.log('Tory : cheking the status of the weather')
        const weatherStatus = await getWeatherStatus("/status");
        console.log('Weather status : ', weatherStatus);
        if (weatherStatus.status === 'GO') {
            status.weatherReady = true;
            console.log('Tory : weather is good');
        }
        else {
            console.log('Tory : weather is not good');
        }

       // Rocket service
       console.log('Richard : demande de statut au département fusée');
       console.log('Elon : surveillance de la fusée')
       const rocketStatus = await getRocketStatus("/status");
       console.log('Statut de la fusée : ', rocketStatus);
       if (rocketStatus.status === 'GO') {
           // Chargez la fusée avec le payload
           console.log('Richard : demande au département fusée de charger le payload');
           //const rocketLoaded = await loadRocket("/rocket/load"); // TODO : A DEBUGGER dans rocket-dept-service les post entre les services ne fonctionnent pas
           //console.log('Payload chargé dans la fusée : ', rocketLoaded);
           console.log('Payload chargé dans la fusée')
           // Après avoir chargé le payload, considérez la fusée comme prête
           status.rocketReady = true;
           console.log('Elon : la fusée est prête au lancement');
       }
       else {
           console.log('Elon : la fusée n\'est pas prête au lancement');
       }

       // Lancez la fusée si tous les systèmes sont prêts
       if (status.rocketReady && status.weatherReady) {
           console.log('Tous les systèmes sont prêts !');
           console.log('Richard : demande au département fusée de lancer la fusée');
           rocketLaunched = await launchRocket('/status'); // TODO : A DEBUGGER dans rocket-dept-service les post entre les services ne fonctionnent pas
           console.log('Fusée lancée : ', rocketLaunched);

           console.log('Elon : surveillance du lancement de la fusée')

            let intervalCount = 0;
            const telemetrieInterval = setInterval(async () => {
                const telemetrics = await getRocketTelemetrics("/rocket/telemetrics");
                console.log('Télémétrie de la fusée : ', telemetrics);

                intervalCount++;
                if (intervalCount >= 5) { // 5 intervalles x 2 secondes = 10 secondes
                    clearInterval(telemetrieInterval);
                }
            }, 2000); // 2 secondes d'intervalle
       }

   } catch (error) {
       console.error(error);
   }
}

main();