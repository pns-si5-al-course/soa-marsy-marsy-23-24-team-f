import fs from 'fs';
import path from 'path';

const logFilePath = process.argv[2] || 'telemetries.log';


/*
    Writing logs in a separate file
    so we can read them in a separate terminal
*/

export function log(message, path=logFilePath) {
    const timestamp = new Date().toISOString();
    const formattedMessage = `${timestamp} - ${message}\n`;
    // Ecrire le message dans le fichier de log
    fs.appendFile(path, formattedMessage, (err) => {
        if (err) {
            console.error('Erreur lors de la journalisation :', err);
        }
    });
}

