import { Test, TestingModule } from '@nestjs/testing';
import { RocketService } from './rocket.service';
import { ApiService } from '../../common/api/api.service';
import { HttpService } from '@nestjs/axios';
import { RocketDTO } from '../dto/rocket.dto';

describe('RocketService', () => {
  let service: RocketService;
  let apiService: jest.Mocked<ApiService>;
  let httpService: HttpService;

  beforeEach(async () => {
    const httpServiceMock = {
      get: jest.fn(() => ({ toPromise: jest.fn() })),
      post: jest.fn(() => ({ toPromise: jest.fn() })),
    };

    const apiServiceMock = {
      get: jest.fn(),
      post: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RocketService,
        {
          provide: HttpService,
          useValue: httpServiceMock,
        },
        {
          provide: ApiService,
          useValue: apiServiceMock,
        },
      ],
    }).compile();

    service = module.get<RocketService>(RocketService);
    apiService = module.get(ApiService);
    httpService = module.get<HttpService>(HttpService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('initiateStartupSequence', () => {
    it('should update rocket status to Startup', async () => {
      const rocketDTO = new RocketDTO();
      apiService.post.mockResolvedValue(rocketDTO);
      await expect(service.initiateStartupSequence(rocketDTO)).resolves.toEqual(rocketDTO);
      expect(apiService.post).toHaveBeenCalledWith('http://rocket-object-service:3005/rocket/status', { rocket: rocketDTO, status: "Startup" });
    });

    it('should throw an error if the startup sequence fails', async () => {
      const rocketDTO = new RocketDTO();
      const error = new Error('Startup sequence failed');
      apiService.post.mockRejectedValue(error);
      await expect(service.initiateStartupSequence(rocketDTO)).rejects.toThrow(error);
    });
  });

  describe('initiateMainEngineStart', () => {
    it('should update rocket status to Main engine start', async () => {
      const rocketDTO = new RocketDTO();
      apiService.post.mockResolvedValue(rocketDTO);
      await expect(service.initiateMainEngineStart(rocketDTO)).resolves.toEqual(rocketDTO);
      expect(apiService.post).toHaveBeenCalledWith('http://rocket-object-service:3005/rocket/status', { rocket: rocketDTO, status: "Main engine start" });
    });
  
    it('should throw an error if the main engine start sequence fails', async () => {
      const rocketDTO = new RocketDTO();
      const error = new Error('Main engine start sequence failed');
      apiService.post.mockRejectedValue(error);
      await expect(service.initiateMainEngineStart(rocketDTO)).rejects.toThrow(error);
    });
  });

  describe('initiateLiftoff', () => {
    it('should update rocket status to Liftoff', async () => {
      const rocketDTO = new RocketDTO();
      apiService.post.mockResolvedValue(rocketDTO);
      await expect(service.initiateLiftoff(rocketDTO)).resolves.toEqual(rocketDTO);
      expect(apiService.post).toHaveBeenCalledWith('http://rocket-object-service:3005/rocket/status', { rocket: rocketDTO, status: "Liftoff" });
    });
  
    it('should throw an error if the liftoff sequence fails', async () => {
      const rocketDTO = new RocketDTO();
      const error = new Error('Liftoff sequence failed');
      apiService.post.mockRejectedValue(error);
      await expect(service.initiateLiftoff(rocketDTO)).rejects.toThrow(error);
    });
  });
});
