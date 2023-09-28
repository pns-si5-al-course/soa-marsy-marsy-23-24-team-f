import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { RocketService } from './rocket/rocket.service';


@Injectable()
export class AppService {
  constructor(private httpService: HttpService, private RocketService: RocketService) {}

  stopSimulation(): Promise<any> {
    return this.RocketService.stopSimulation();
  }
   
}
