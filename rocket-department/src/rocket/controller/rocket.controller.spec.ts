import { Test, TestingModule } from '@nestjs/testing';
import { HttpException, HttpStatus } from '@nestjs/common';
import { RocketController } from './rocket.controller';
import { RocketService } from '../service/rocket.service';
import { RocketDTO } from '../dto/rocket.dto';

describe('RocketController', () => {
  let controller: RocketController;
  let service: jest.Mocked<RocketService>;

  beforeEach(async () => {
    const rocketServiceMock: Partial<jest.Mocked<RocketService>> = {
        initiateStartupSequence: jest.fn(),
        initiateMainEngineStart: jest.fn(),
        initiateLiftoff: jest.fn(),
        loadRocket: jest.fn(),
        askTelemetrieForRocketData: jest.fn(),
      };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [RocketController],
      providers: [
        {
          provide: RocketService,
          useValue: rocketServiceMock
        }
      ],
    }).compile();

    controller = module.get<RocketController>(RocketController);
    service = module.get(RocketService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('initiateStartup', () => {
    it('should initiate startup sequence', async () => {
      const rocketDTO = new RocketDTO();
      service.initiateStartupSequence.mockResolvedValue(rocketDTO);
      await expect(controller.initiateStartup(rocketDTO)).resolves.toEqual(rocketDTO);
    });

    it('should throw HttpException on error', async () => {
      const rocketDTO = new RocketDTO();
      const error = new HttpException('Startup initiation failed', HttpStatus.BAD_REQUEST);
      service.initiateStartupSequence.mockRejectedValue(error);
      await expect(controller.initiateStartup(rocketDTO)).rejects.toThrow(HttpException);
    });

    it('should handle invalid rocket data', async () => {
        const invalidRocketDTO = new RocketDTO();
        invalidRocketDTO.name = ''; 
        invalidRocketDTO.timestamp = 'invalid-date'; 
  
        const error = new HttpException('Invalid data', HttpStatus.BAD_REQUEST);
        service.initiateStartupSequence.mockRejectedValue(error);
  
        await expect(controller.initiateStartup(invalidRocketDTO)).rejects.toThrow(HttpException);
      });

  });

  describe('initiateMainEngineStart', () => {
    it('should initiate main engine start sequence', async () => {
      const rocketDTO = new RocketDTO();
      service.initiateMainEngineStart.mockResolvedValue(rocketDTO);
      await expect(controller.initiateMainEngineStart(rocketDTO)).resolves.toEqual(rocketDTO);
    });
  
    it('should throw HttpException on error', async () => {
      const rocketDTO = new RocketDTO();
      const error = new HttpException('Main engine start failed', HttpStatus.BAD_REQUEST);
      service.initiateMainEngineStart.mockRejectedValue(error);
      await expect(controller.initiateMainEngineStart(rocketDTO)).rejects.toThrow(HttpException);
    });
  
  });

  describe('initiateLiftoff', () => {
    it('should initiate liftoff sequence', async () => {
      const rocketDTO = new RocketDTO();
      service.initiateLiftoff.mockResolvedValue(rocketDTO);
      await expect(controller.initiateLiftoff(rocketDTO)).resolves.toEqual(rocketDTO);
    });
  
    it('should throw HttpException on error', async () => {
      const rocketDTO = new RocketDTO();
      const error = new HttpException('Liftoff failed', HttpStatus.BAD_REQUEST);
      service.initiateLiftoff.mockRejectedValue(error);
      await expect(controller.initiateLiftoff(rocketDTO)).rejects.toThrow(HttpException);
    });
  
  });

});
