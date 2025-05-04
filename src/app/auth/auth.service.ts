import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma } from '@prisma/client';
import { AppConfigService } from 'src/config/app-config.service';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private config: AppConfigService,
  ) {}

  public async register(params: Prisma.userCreateInput) {
    return await this.prisma.user.create({
      data: params,
    });
  }
}
