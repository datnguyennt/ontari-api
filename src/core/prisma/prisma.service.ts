import { Injectable } from '@nestjs/common';
import { OnModuleInit } from '@nestjs/common/interfaces';
import { OnModuleDestroy } from '@nestjs/common/interfaces/hooks';
import { ConfigService } from '@nestjs/config';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy {
  constructor(conffigService: ConfigService) {
    super({
      datasources: {
        db: {
          url: conffigService.get('DATABASE_URL'),
          // url: 'postgresql://admin1:123@localhost:5432/ontari-db?schema=public',
        },
      },
    });
  }
  async onModuleInit() {
    await this.$connect();
  }
  async onModuleDestroy() {
    await this.$disconnect();
  }
}
