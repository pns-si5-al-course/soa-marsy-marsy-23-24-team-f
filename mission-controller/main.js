require('dotenv').config();

const rocketServiceUrl = process.env.ROCKET_SERVICE_URL;
const weatherServiceUrl = process.env.WEATHER_SERVICE_URL;
const authToken = process.env.AUTH_TOKEN;

const status = {
    rocketReady: false,
    weatherOK: false,
}

const post = async (url, data) => {
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
            throw new Error('Erreur de requête HTTP');
        }

        return response.json();
    } catch (error) {
        console.error('Erreur lors de la requête :', error);
        throw error; // Vous pouvez gérer l'erreur ici ou la propager
    }
};

const get = async (url) => {
    try {
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `${authToken}`
            },
        });

        if (!response.ok) {
            throw new Error('Erreur de requête HTTP');
        }

        return response.json();
    } catch (error) {
        console.error('Erreur lors de la requête :', error);
        throw error; // Vous pouvez gérer l'erreur ici ou la propager
    }
}

async function launchRocket() {
    try {
        const data = {
            status: 'GO'
        };

        const rocketData = await post(rocketServiceUrl, data);
        return rocketData;
    } catch (error) {
        console.error('Erreur lors du lancement de la fusée :', error);
        throw error;
    }
}

async function getRocketStatus() {
    try {
        const data = await get(rocketServiceUrl);
        return data;
    } catch (error) {
        throw error;
    }
}

async function getWeatherStatus() {
    try {
        const data = await get(weatherServiceUrl);
        return data;
    } catch (error) {
        throw error;
    }
}

async function main() {
    try {
        const rocketStatus = await getRocketStatus();
        console.log('Rocket status : ', rocketStatus);
        if (rocketStatus.status === 'GO') {
            status.rocketReady = true;
        }

        const weatherStatus = await getWeatherStatus();
        console.log('Weather status : ', weatherStatus);
        if (weatherStatus.status === 'GO') {
            status.weatherReady = true;
        }
        
        //TODO: get weather status
        status.weatherOK = true; //mock weather status

        if (status.rocketReady && status.weatherOK) {
            console.log('Mission commander status : GO');
            rocketLaunched = await launchRocket();
            console.log('Rocket launched : ', rocketLaunched);
        }   

    } catch (error) {
        console.error(error);
    }
}

main();
