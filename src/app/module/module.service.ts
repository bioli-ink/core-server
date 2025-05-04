import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma } from '@prisma/client';
import { nanoid } from 'nanoid';
import { MODULE_ID_LENGTH } from './config';

@Injectable()
export class ModuleService {
  constructor(private prisma: PrismaService) {}

  public async create(
    data:
      | Omit<Prisma.modulesCreateInput, 'id' | 'json'>
      | Omit<Prisma.modulesUncheckedCreateInput, 'id' | 'json'>,
  ) {
    return await this.prisma.modules.create({
      data: {
        ...data,
        json: '[]',
        id: nanoid(MODULE_ID_LENGTH),
      },
    });
  }

  public async update(data: Prisma.modulesUpdateInput) {
    return await this.prisma.modules.update({
      data: {
        json: data.json,
      },
      where: {
        id: data.id as string,
      },
    });
  }

  public async query(condition: Prisma.modulesWhereUniqueInput) {
    return await this.prisma.modules.findUnique({
      select: {
        id: true,
        json: true,
      },
      where: condition,
    });
  }
}
