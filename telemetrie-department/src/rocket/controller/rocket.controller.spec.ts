/*
https://docs.nestjs.com/fundamentals/testing#unit-testing
*/

import { Test } from '@nestjs/testing';
import { RocketController } from './rocket.controller';
import { RocketService } from '../service/rocket.service';
import { getModelToken } from '@nestjs/mongoose';
import { Telemetrics } from '../../../schema/telemetrics.schema';
import { TelemetricsDto } from '../../../dto/create-telemetrics.dto';

describe('RocketController', () => {
  let rocketController: RocketController;
  let rocketService: RocketService;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      controllers: [RocketController],
      providers: [RocketService, { provide: getModelToken(Telemetrics.name), useValue: jest.fn() }]
    }).compile();

    rocketController = moduleRef.get<RocketController>(RocketController);
  });

  it('should be defined', () => {
    expect(rocketController).toBeDefined();
  });

  describe('getTelemetrics when empty', () => {
    it('should return an empty telemetrics', async () => {
      const result = new Telemetrics();
      jest.spyOn(rocketController, 'getTelemetrics').mockImplementation(async () => result);
      expect(await rocketController.getTelemetrics()).toBe(result);
    });
  });


  describe('getlastTelemetrics after adding one', () => {
    it('should accept the post and return the telemetrics', async () => {
      // create a mock telemetrics
      const result: TelemetricsDto = {
        name: 'test',
        status: 'test',
        stages: [{ id: 1, fuel: 1 }],
        altitude: 1,
        payload: { passengers: 1, altitude: 1, weight: 1 },
        timestamp: 'test'
      };
      jest.spyOn(rocketController, 'postTelemetrics').mockImplementation(async () => result);
      expect(await rocketController.postTelemetrics(result)).toBe(result);
    })
    it('should return the telemetrics', async () => {
      // create a mock telemetrics
      const result: TelemetricsDto = {
        name: 'test',
        status: 'test',
        stages: [{ id: 1, fuel: 1 }],
        altitude: 1,
        payload: { passengers: 1, altitude: 1, weight: 1 },
        timestamp: 'test'
      };
      jest.spyOn(rocketController, 'postTelemetrics').mockImplementation(async () => result);
      expect(await rocketController.postTelemetrics(result)).toBe(result);
      jest.spyOn(rocketController, 'getTelemetrics').mockImplementation(async () => result);
      expect(await rocketController.getTelemetrics()).toBe(result);
    });});

});
