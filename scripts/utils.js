const authToken = process.env.AUTH_TOKEN;
import chalk from "chalk";
import {} from "dotenv/config";
import fs from "fs";

export function printFormatedTelemetrics(telemetrics) {
    console.log(chalk.yellow("Rocket telemetrics : \r"));
    console.log("");
    console.log(chalk.green("\t" + telemetrics.name));
    console.log(chalk.green("\t" + "Status: ", telemetrics.status));
    console.log("");
    for (let key in telemetrics.stages[0]) {
        console.log(chalk.green("\t\t" + key + " : " + telemetrics.stages[0][key]));
    }
    for (let key in telemetrics.stages[1]) {
        console.log(chalk.green("\t\t" + key + " : " + telemetrics.stages[0][key]));
    }
    console.log("");
    console.log(chalk.blue("\t" + "Altitude: ", telemetrics.altitude));
    console.log("");
    for (let key in telemetrics.payload) {
        console.log(chalk.yellow("\t\t" + key + " : " + telemetrics.payload[key]));
    }
    console.log(chalk.green("\t" + telemetrics.timestamp))
}

// function to Catch Ctrl+C
process.on('SIGINT', async() => {
    try {
        console.log(chalk.red('Simulation stopped by user'));
        process.exit();
    } catch (error) {
        console.error(error);
    }
    console.log(chalk.yellow('Graceful shutdown'))
    process.exit();
});

export function createFileIfNotExist(path) {
    fs.open(path, 'a', (err, fd) => {
        if (err) {
            console.error('Error while creating logs :', err);
        }
    });
}


export function sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}
export const post = async(url, data) => {
    //console.log("POST -- ", url, data, "\n--------")
    try {
        const response = await fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: data ? JSON.stringify(data) : null,
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

export const get = async(url) => {
    // console.log("GET -- ", url, "\n--------")
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

export default {}