import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  public async query(condition: Prisma.userWhereUniqueInput) {
    return await this.prisma.user.findUnique({
      where: condition,
    });
  }

  public async queryAll(condition: Prisma.userWhereInput) {
    return await this.prisma.user.findMany({
      where: condition,
    });
  }

  public async update(id: string, params: Omit<Prisma.userUpdateInput, 'id'>) {
    return await this.prisma.user.update({
      data: params,
      where: { id },
    });
  }

  public async getBaseInfo(id: string) {
    return await this.prisma.user.findUnique({
      where: {
        id,
      },
      include: { base_config: true },
    });
  }

  public async findAllInfo(condition: Prisma.userWhereInput) {
    return await this.prisma.user.findFirst({
      where: condition,
      include: {
        base_config: true,
        modules: true,
        theme: true,
      },
    });
  }
}
