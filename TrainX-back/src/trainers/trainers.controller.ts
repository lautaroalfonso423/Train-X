import { Body, Controller, Delete, Get, Param, ParseUUIDPipe, Post, Req, UseGuards } from '@nestjs/common';
import { TrainersService } from './trainers.service';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiBody } from '@nestjs/swagger';
import { CreateTrainerDto } from './dto/create-trainer.dto';
import { AdminGuard, JwtAuthGuard} from '../auth/guards/admin.guard';
import { ParamsTokenFactory } from '@nestjs/core/pipes';

@ApiTags('Trainers')
@Controller('trainers')
export class TrainersController {
  constructor(private readonly trainersService: TrainersService) {}

  @Get()
  @ApiOperation({ summary: 'List all trainers available in the platform' })
  @ApiResponse({ status: 200, description: 'Returns a list of trainers.' })
  findAll() {
    return this.trainersService.findAll();
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Create a new trainer' })
  @ApiBody({ description: 'Trainer data to create a new trainer', type: CreateTrainerDto })
  @ApiResponse({ status: 201, description: 'Trainer created successfully.' })
  @ApiResponse({ status: 400, description: 'Invalid input data.' })
  async seed(
    @Body() data: CreateTrainerDto,
    ) {
    return this.trainersService.create(data);
  }

  @Post(":id")
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Rate a trainer' })
  @ApiParam({ name: 'id', description: 'Trainer ID' })
  @ApiBody({
    description: 'Rating to assign to the trainer',
    schema: {
      type: 'object',
      properties: {
        rating: { type: 'number', example: 5 }
      }
    }
  })
  @ApiResponse({ status: 201, description: 'Rating successfully registered.' })
  @ApiResponse({ status: 400, description: 'Invalid trainer ID or rating value.' })
  @ApiResponse({ status: 401, description: 'Unauthorized. User must be logged in.' })
  async quali(
    @Param("id", new ParseUUIDPipe()) idTrainer: string,
    @Body("rating")  rating: number,
    @Req() req: any
  ){
    const idUser = req.user.id 
    return this.trainersService.createQuali(idTrainer, idUser, rating) 
  }

  @Get()
  @ApiOperation({ summary: 'Check rating status for trainers' })
  @ApiResponse({ status: 200, description: 'Returns rating status.' })
  async qualiStatus(){

  }

  @Delete(":id")
  async deleteTrainer(
    @Param("id", new ParseUUIDPipe()) id: string
  ){
    return await this.trainersService.deleteServiceTrainer(id)
  }

}
