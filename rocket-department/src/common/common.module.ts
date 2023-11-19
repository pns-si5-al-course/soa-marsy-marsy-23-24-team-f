// src/common/common.module.ts
import { Module } from '@nestjs/common';
import { ApiService } from './api/api.service';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [HttpModule],
  providers: [ApiService],
  exports: [ApiService], // Export ApiService so it can be used elsewhere
})
export class CommonModule {}
