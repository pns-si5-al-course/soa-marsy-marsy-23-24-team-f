import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { RocketModule } from './rocket/rocket.module';
import { ConfigModule } from '@nestjs/config';
import configuration from 'shared/config/configuration';
@Module({
  imports: [
    ConfigModule.forRoot({
      load: [configuration],
      isGlobal: true,
    }),
    RocketModule
  ],
  controllers: [AppController],
  providers: [],
})
export class AppModule {}

