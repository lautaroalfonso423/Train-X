import { Controller, Get, Param, Post, Body, Patch } from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiBody } from '@nestjs/swagger';

@ApiTags('Payments')
@Controller('payments')
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  @Get()
  @ApiOperation({ summary: 'List all payments registered in the platform' })
  findAll() {
    return this.paymentsService.findAll();
  }

  @Get(':userId')
  @ApiOperation({ summary: 'Retrieve all payments made by a specific user' })
  findByUser(@Param('userId') userId: string) {
    return this.paymentsService.findByUser(userId);
  }

  @Post()
  @ApiOperation({ summary: 'Register a new payment in the platform' })
  create(@Body() body: any) {
    return this.paymentsService.create(body);
  }

  @Patch(':id/pay')
  @ApiOperation({ summary: 'Mark an existing payment as paid' })
  markAsPaid(@Param('id') id: string) {
    return this.paymentsService.markAsPaid(id);
  }
}

