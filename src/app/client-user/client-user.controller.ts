import { Controller, Get, Param } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { parseJSON } from 'src/utils/transform';
import { ModuleStatus } from 'src/types/module';

@Controller('client/user')
export class ClientUserController {
  public constructor(private userService: UserService) {}

  @Get('/:username')
  public async getUserInfo(@Param('username') username: string) {
    const result = await this.userService.findAllInfo({ username });

    if (!result) {
      return {};
    }

    delete result.create_time;
    delete result.update_time;
    delete result.base_config.create_time;
    delete result.base_config.update_time;
    delete result.modules.create_time;
    delete result.modules.update_time;

    result.theme.map((t) => {
      delete t.create_time;
      delete t.update_time;
    });

    return {
      ...result,
      modules: {
        ...result.modules,
        list: parseJSON(result.modules.json).filter(
          (module: any) => module.status !== ModuleStatus.DELETED,
        ),
      },
    };
  }
}
