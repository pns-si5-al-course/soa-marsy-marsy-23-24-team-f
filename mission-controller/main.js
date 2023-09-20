require('dotenv').config();

const rocketServiceUrl = process.env.ROCKET_SERVICE_URL;
const weatherServiceUrl = process.env.WEATHER_SERVICE_URL;
const authToken = process.env.AUTH_TOKEN;

const status = {
    rocketReady: false,
    weatherReady: false,
}

const post = async(url, data) => {
    console.log(url)
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

        const rocketData = await post(rocketServiceUrl + path, data);
        return rocketData;
    } catch (error) {
        console.error('Erreur lors du lancement de la fusée :', error);
        throw error;
    }
}

async function getRocketStatus(path) {
    try {
        const data = await get(rocketServiceUrl + path);
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
        console.log('Richard : asking rocket department status');
        console.log('Elon : monitoring the status of the rocket')
        const rocketStatus = await getRocketStatus("/status");
        console.log('Rocket status : ', rocketStatus);
        if (rocketStatus.status === 'GO') {
            status.rocketReady = true;
            console.log('Elon : rocket is ready to launch');
        }
        else {
            console.log('Elon : rocket is not ready to launch');
        }

        // Launch rocket if all systems are ready
        if (status.rocketReady && status.weatherReady) {
            console.log('All systems are ready !');
            console.log('Richard : asking rocket department to launch the rocket');
            rocketLaunched = await launchRocket("/status");
            console.log('Elon : monitoring the launch of the rocket')
            console.log('Rocket launched : ', rocketLaunched);
        }

    } catch (error) {
        console.error(error);
    }
}

main();