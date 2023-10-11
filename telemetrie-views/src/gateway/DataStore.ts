import { EventEmitter } from 'events';

export class DataStore {
  static eventEmitter = new EventEmitter();

  static addRocketData(data: any): void {
    DataStore.eventEmitter.emit('rocketDataAdded', data);
  }

  static addPayloadData(data: any): void {
    DataStore.eventEmitter.emit('payloadDataAdded', data);
  }
}