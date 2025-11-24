import { Controller, Get, Post, Body } from '@nestjs/common';
import { MaintenanceService } from './maintenance.service';
import { ApiTags, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';
import { MaintenanceGateway } from './maintenance.gateway';
import { CreateMaintenanceDto } from './dto/create-maintenance.dto';



@ApiTags('Maintenance')
@Controller('maintenance')
export class MaintenanceController {
  constructor(
    private readonly maintenanceService: MaintenanceService,
    private readonly gateway: MaintenanceGateway,
  ) {}

  @Post()
  @ApiOperation({
    summary: 'Enable or disable maintenance mode',
    description:
      'Switches the application state to maintenance mode (`true`) or normal mode (`false`). Also broadcasts the new status via WebSocket.',
  })
  @ApiBody({
    description: 'Maintenance status',
    schema: {
      type: 'object',
      properties: {
        active: { type: 'boolean', example: true }
      }
    }
  })
  @ApiResponse({
    status: 201,
    description: 'Maintenance status updated successfully.',
    schema: {
      example: { 
        active: true,
        message: 'Modo mantenimiento activado' 
      },
    },
  })
  async toggle(@Body() body: CreateMaintenanceDto) {
    const status = await this.maintenanceService.setStatus(body.active);
    this.gateway.sendMaintenanceStatus(status);
    
    if (status) {
      return { 
        active: status,
        message: 'Modo mantenimiento activado' 
      };
    } else {
      return { 
        active: status,
        message: 'Modo mantenimiento desactivado' 
      };
    }
  }

  @Get()
  @ApiOperation({
    summary: 'Get current maintenance status',
    description:
      'Returns whether the application is currently in maintenance mode (`true`) or normal mode (`false`).',
  })
  @ApiResponse({
    status: 200,
    description: 'Current maintenance status retrieved successfully.',
    schema: {
      example: { active: false },
    },
  })
  async getStatus() {
    const isActive = await this.maintenanceService.getStatus();
    if (isActive) {
      return { active: isActive, message: 'Sistema en mantenimiento' };
    } else {
      return { active: isActive };
    }
  }
  
}