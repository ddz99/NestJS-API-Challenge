import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HttpModule } from '@nestjs/axios';
import { RepositoryService } from './repository.service';
import { RepositoryController } from './repository.controller';
import { Repository } from './entities/repository.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Repository]),
    HttpModule,
  ],
  providers: [RepositoryService],
  controllers: [RepositoryController],
})
export class RepositoryModule {}
