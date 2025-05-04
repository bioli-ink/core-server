import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma } from '@prisma/client';
import { nanoid } from 'nanoid';

@Injectable()
export class ConfigService {
  constructor(private prisma: PrismaService) {}

  public async create(
    data:
      | Omit<Prisma.base_configCreateInput, 'id'>
      | Omit<Prisma.base_configUncheckedCreateInput, 'id'>,
  ) {
    return await this.prisma.base_config.create({
      data: {
        ...data,
        id: nanoid(8),
      },
    });
  }

  public async update(
    id: string,
    data: Omit<
      Prisma.base_configUpdateInput,
      'id' | 'user_id' | 'create_time' | 'update_time'
    >,
  ) {
    return await this.prisma.base_config.update({
      data,
      where: {
        user_id: id,
      },
    });
  }
}
