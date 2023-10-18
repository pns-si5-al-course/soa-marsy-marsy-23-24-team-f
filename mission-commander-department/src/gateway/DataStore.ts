import { EventEmitter } from 'events';

export class DataStore {
  static eventEmitter = new EventEmitter();

  static addRocketData(data: any): void {
    DataStore.eventEmitter.emit('logs', data);
  }
}