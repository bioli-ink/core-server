import { HttpService } from '@nestjs/axios';
import { Controller, Get } from '@nestjs/common';
import { AppConfigService } from 'src/config/app-config.service';

@Controller('transfer')
export class TransferController {
  public constructor(
    private config: AppConfigService,
    private readonly httpService: HttpService,
  ) {}

  @Get('/bing/today')
  public async getBingToday() {
    const result = await this.httpService.axiosRef.get(
      `${this.config.getDailyImageDomain()}/bing/today`,
    );

    const { url, date } = result.data.data;

    return { url, date };
  }
}
