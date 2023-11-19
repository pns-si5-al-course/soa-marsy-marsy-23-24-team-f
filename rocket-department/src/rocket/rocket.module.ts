import { Module } from '@nestjs/common';
import { RocketService } from './service/rocket.service';
import { RocketController } from './controller/rocket.controller';
import { HttpModule } from '@nestjs/axios';
import { CommonModule } from 'src/common/common.module';

@Module({
  imports: [HttpModule,CommonModule],
  controllers: [RocketController],
  providers: [RocketService],
  exports: [RocketService],
})
export class RocketModule {}
