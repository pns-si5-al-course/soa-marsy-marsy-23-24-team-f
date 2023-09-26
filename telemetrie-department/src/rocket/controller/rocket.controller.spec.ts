/*
https://docs.nestjs.com/fundamentals/testing#unit-testing
*/

import { Test } from '@nestjs/testing';
import { RocketController } from './rocket.controller';

describe('RocketController', () => {
  let rocketController: RocketController;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [], // Add
      controllers: [], // Add
      providers: [], // Add
    }).compile();

    rocketController = moduleRef.get<RocketController>(RocketController);
  });

  it('should be defined', () => {
    expect(rocketController).toBeDefined();
  });
});
