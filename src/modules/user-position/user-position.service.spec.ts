import { Test, TestingModule } from '@nestjs/testing';
import { UserPositionService } from './user-position.service';

describe('UserPositionService', () => {
  let service: UserPositionService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UserPositionService],
    }).compile();

    service = module.get<UserPositionService>(UserPositionService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
