import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import configuration from 'shared/config/configuration';
import { StatusModule } from './status/status.module';
import { RocketController } from './app.controller';
import { RocketModule } from './rocket/rocket.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [configuration],
      isGlobal: true,
    }),
    StatusModule,
    RocketModule,
  ],
  controllers: [RocketController],
  providers: [],
})
export class AppModule {}
