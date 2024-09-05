import { Controller, Get, Query } from '@nestjs/common';
import { DashboardService } from './dashboard.service';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { Auth } from '../../constant/auth.decorator';

@ApiTags('Dashboard')
@Controller('dashboard')
@Auth()
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  @Get('/byMonth')
  @ApiOperation({
    summary: 'Biểu đồ tăng trưởng theo tháng',
  })
  async byMonth(@Query('month') month: string): Promise<any> {
    return await this.dashboardService.byMonth(month);
  }
}
