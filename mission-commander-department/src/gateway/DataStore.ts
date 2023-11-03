import { EventEmitter } from 'events';
import * as fs from 'fs';
import * as path from 'path';

export class DataStore {
  static eventEmitter = new EventEmitter();
  static statusLogs: string[] = [];
  static logFilePath = path.join(__dirname, '../log_trace/status.mission.logs');

  static log(message:string) {
    const timestamp = new Date().toISOString();
    const formattedMessage = `${timestamp} - ${message}\n`;
    // Ecrire le message dans le fichier de log
    fs.appendFile(DataStore.logFilePath, formattedMessage, (err: any) => {
        if (err) {
            console.error('Erreur lors de la journalisation :', err);
        }
    });
}

  static addRocketData(data: any): void {
    const d = JSON.parse(data).body;
    if (!DataStore.statusLogs.includes(d.status)) {
      DataStore.statusLogs.push(d.status);
      DataStore.log(d.status);
    }
    DataStore.eventEmitter.emit('logs', data);
  }
}