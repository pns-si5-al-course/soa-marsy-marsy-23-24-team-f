import { Test, TestingModule } from '@nestjs/testing';
import { RocketController } from './rocket.controller';
import { RocketService } from './rocket.service';

describe('RocketController', () => {
  let controller: RocketController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [RocketController],
      providers: [RocketService],
    }).compile();

    controller = module.get<RocketController>(RocketController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
