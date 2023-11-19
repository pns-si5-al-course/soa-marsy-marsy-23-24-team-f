import { EventEmitter } from 'events';

export class DataStore {
  private static datas: any[] = [];
  static eventEmitter = new EventEmitter();

  static addData(data: any): void {
    DataStore.datas.push(data);
    if (!JSON.parse(data).body.name) {
      console.log('stage data receiv : ', data);
      DataStore.eventEmitter.emit('StageData', data);
      return;
    } 
    console.log('telemetrics data receiv : ', data);
    DataStore.eventEmitter.emit('dataAdded', data);
  }

  static getDatas(): any[] {
    return DataStore.datas;
  }
}