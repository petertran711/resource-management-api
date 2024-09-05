import { Test, TestingModule } from '@nestjs/testing';
import { UserPositionController } from './user-position.controller';
import { UserPositionService } from './user-position.service';

describe('UserPositionController', () => {
  let controller: UserPositionController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserPositionController],
      providers: [UserPositionService],
    }).compile();

    controller = module.get<UserPositionController>(UserPositionController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
