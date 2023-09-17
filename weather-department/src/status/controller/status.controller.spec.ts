import { Test } from '@nestjs/testing';
import { StatusController } from './status.controller';

describe('Status Controller', () => {
  let controller: StatusController;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      controllers: [StatusController],
    }).compile();

    controller = module.get<StatusController>(StatusController);
  });

  it('should raise HttpException when calling with wrong token', () => {
    expect(() => controller.getStatus("anything")).toThrow('Http Exception');
  });

  it('should return "GO" when calling with right token', () => {
    expect(controller.getStatus("missioncontrol-token")).toEqual({ status: "GO" });
  });
});