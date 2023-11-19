import { EventEmitter } from 'events';

export class DataStore {
  private static datas: any[] = [];
  static eventEmitter = new EventEmitter();

  static addData(data: any): void {
    DataStore.datas.push(data);
    DataStore.eventEmitter.emit('dataAdded', data);
  }

  static getDatas(): any[] {
    return DataStore.datas;
  }
}