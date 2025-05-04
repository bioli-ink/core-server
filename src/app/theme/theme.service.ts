import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma } from '@prisma/client';
import { nanoid } from 'nanoid';

@Injectable()
export class ThemeService {
  constructor(private prisma: PrismaService) {}

  public async create(
    data:
      | Omit<Prisma.themeCreateInput, 'id'>
      | Omit<Prisma.themeUncheckedCreateInput, 'id'>,
  ) {
    return await this.prisma.theme.create({
      data: {
        ...data,
        id: nanoid(8),
      },
    });
  }
}
