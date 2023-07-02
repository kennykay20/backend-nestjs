import { Body, Controller, Get, Post, Req, Res } from '@nestjs/common';
import { Request, Response } from 'express';
import { Cat, CreateCatsDTO } from './DTO/cats.dto';
import { CatsService } from './cats.service';

@Controller('cats')
export class CatsController {
  constructor(private catService: CatsService) {}
  @Get('findAll')
  async FindAll(): Promise<Cat[]> {
    return this.catService.findAllCat();
  }

  @Post('addNewCat')
  async AddCats(@Body() req: CreateCatsDTO): Promise<object> {
    return this.catService.create(req);
  }

  @Get(':id')
  async GetCatById(@Req() req: Request): Promise<string> {
    const { id } = req.params;
    console.log('id: ', id);
    return `cat with id ${id} found`;
  }
}
