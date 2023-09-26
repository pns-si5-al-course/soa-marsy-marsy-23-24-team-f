import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { RocketService } from './rocket.service';
import { CreateRocketDto } from './dto/create-rocket.dto';
import { UpdateRocketDto } from './dto/update-rocket.dto';

@Controller('rocket')
export class RocketController {
  constructor(private readonly rocketService: RocketService) {}

  @Post()
  create(@Body() createRocketDto: CreateRocketDto) {
    return this.rocketService.create(createRocketDto);
  }

  @Get()
  findAll() {
    return this.rocketService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.rocketService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateRocketDto: UpdateRocketDto) {
    return this.rocketService.update(+id, updateRocketDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.rocketService.remove(+id);
  }

  @Post('load')
  loadRocket() {
      return this.rocketService.loadRocket();
  }
}
