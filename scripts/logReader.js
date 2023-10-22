import fs from 'fs';
import chalk from "chalk";

const path = process.argv[2] || "telemetries.log";

export function readSync(path=path) {
    fs.watch(path, (event, filename) => {
        if (event === 'change') {
            let newFileSize = fs.statSync(path).size;
            if (newFileSize > fileSize) {
                // Si le fichier est plus grand, de nouvelles lignes ont été ajoutées.
                let stream = fs.createReadStream(path, {
                    start: fileSize,
                    end: newFileSize
                });
                stream.on('data', function(newData) {
                    const line = newData.toString().split(' - ');
                    console.log("Payload data : ", line[0]);
                    console.log(JSON.parse(line[1]));
                });
                fileSize = newFileSize;
            }
        }
    });
}


export function readLastLine(path=path) {
    fs.readFile(path, 'utf-8', (err, data) => {
        if (err) throw err;
        const lines = data.trim().split('\n');
        const line = lines.pop().split(' - ');
        console.log(chalk.green(path.split(".log")[0]+ " data : "), line[0]);
        console.log(JSON.parse(line[1]));
    });
}


