import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  public async findAllInfo(condition: Prisma.userWhereUniqueInput) {
    return await this.prisma.user.findUnique({
      where: condition,
      include: {
        base_config: true,
        modules: true,
        theme: true,
      },
    });
  }
}