import { Controller, Get, Post, Param, Body, BadRequestException, Put, Delete, Query } from '@nestjs/common';
import { ActivitiesService } from './activities.service';
import { CloudinaryService } from '../cloudinary/cloudinary.service';
import * as path from 'path';
import { UpdateActivityDto } from './dtos/update-activity.dto';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiBody, ApiQuery } from '@nestjs/swagger';

@ApiTags('Activities')
@Controller('activities')
export class ActivitiesController {
    constructor(
        private readonly activitiesService: ActivitiesService,
        private readonly cloudinaryService: CloudinaryService
    ) {}

    @Get("filter")
    @ApiOperation({ summary: 'Filter activities by name' })
    @ApiQuery({ name: 'name', required: false, description: 'Activity name to filter by' })
    @ApiResponse({ status: 200, description: 'Filtered list of activities returned successfully' })
    @ApiResponse({ status: 404, description: 'No activities found matching the filter' })
    async filter(
        @Query("name") name: string
    ){
        return this.activitiesService.filterService(name);
    }

    @Get()
    @ApiOperation({ summary: 'Get all activities' })
    @ApiResponse({ status: 200, description: 'List of activities retrieved successfully' })
    findAll() {
        return this.activitiesService.findAll();
    }

    @Get(':id')
    @ApiOperation({ summary: 'Get an activity by ID' })
    @ApiParam({ name: 'id', description: 'Activity ID' })
    @ApiResponse({ status: 200, description: 'Activity found successfully' })
    @ApiResponse({ status: 404, description: 'Activity not found' })
    findOne(@Param('id') id: string) {
        return this.activitiesService.findOne(id);
    }

    @Post()
    @ApiOperation({ summary: 'Create a new activity' })
    @ApiBody({
        description: 'Data to create activity',
        schema: {
            type: 'object',
            properties: {
                name: { type: 'string' },
                description: { type: 'string' },
                requiresReservation: { type: 'boolean' },
                maxCapacity: { type: 'number', nullable: true },
                imageUrl: { type: 'string' }
            },
            required: ['imageUrl']
        }
    })
    @ApiResponse({ status: 201, description: 'Activity created successfully' })
    @ApiResponse({ status: 400, description: 'Invalid input data' })
    create(@Body() data: any) {

        if (!data.imageUrl) {
            throw new BadRequestException("'imageUrl' is required");
        }

        return this.activitiesService.create(data);
    }

    @Post('seeder')
    @ApiOperation({ summary: 'Seed database with sample activities' })
    @ApiResponse({ status: 201, description: 'Activities seeded successfully' })
    async seed() {
        const activities = [
            {
                name: 'CrossFit',
                description: 'Entrenamiento funcional de alta intensidad.',
                requiresReservation: true,
                maxCapacity: 10,
                imageUrl: 'https://res.cloudinary.com/dxpqhpme3/image/upload/v1762788444/crossfit_gkvp1x.png',
            },
            {
                name: 'Pilates',
                description: 'Fortalece el cuerpo y mejora la flexibilidad.',
                requiresReservation: true,
                maxCapacity: 10,
                imageUrl: 'https://res.cloudinary.com/dxpqhpme3/image/upload/v1762788444/pilates_t6ccjg.png',
            },
            {
                name: 'Zumba',
                description: 'Clases bailables de acondicionamiento físico que son divertidas, energéticas y te hacen sentir genial.',
                requiresReservation: true,
                maxCapacity: 10,
                imageUrl: 'https://res.cloudinary.com/dxpqhpme3/image/upload/v1762788444/zumba_uae14f.png',
            },
            {
                name: 'Telas',
                description: 'La danza aérea es una nueva forma de expresión en donde el cuerpo en suspensión se expresa. Se centra en la fuerza, la flexibilidad, la coordinación y el control corporal.',
                requiresReservation: true,
                maxCapacity: 10,
                imageUrl: 'https://res.cloudinary.com/dxpqhpme3/image/upload/v1762788445/telas_kkowkt.png',
            },
            {
                name: 'Gym',
                description: 'Acceso gratuito al gimnasio para entrenar en cualquier momento dentro del horario autorizado.',
                requiresReservation: false,
                maxCapacity: null,
                imageUrl: 'https://res.cloudinary.com/dxpqhpme3/image/upload/v1762788445/gym_oscgja.png',
            }
        ];

        for (const activity of activities) {
            const exists = await this.activitiesService.findByName(activity.name);
            if (!exists) {
                await this.activitiesService.create(activity);
            }
        }

        return { message: 'Actividades cargadas correctamente ✅' };
    }

    @Put(':id')
    @ApiOperation({ summary: 'Update an existing activity' })
    @ApiParam({ name: 'id', description: 'Activity ID to update' })
    @ApiBody({ type: UpdateActivityDto })
    @ApiResponse({ status: 200, description: 'Activity updated successfully' })
    @ApiResponse({ status: 400, description: 'Invalid ID or input data' })
    @ApiResponse({ status: 404, description: 'Activity not found' })
    async update(@Param('id') id: string, @Body() body: UpdateActivityDto) {
        if (!id) throw new BadRequestException('Valid ID must be provided');
        return this.activitiesService.updateActivity(id, body);
    }

    @Delete(':id')
    @ApiOperation({ summary: 'Delete an activity' })
    @ApiParam({ name: 'id', description: 'Activity ID to delete' })
    @ApiResponse({ status: 200, description: 'Activity deleted successfully' })
    @ApiResponse({ status: 400, description: 'Invalid ID' })
    @ApiResponse({ status: 404, description: 'Activity not found' })
    async delete(@Param('id') id: string) {
        if (!id) throw new BadRequestException('Valid ID must be provided');
        return this.activitiesService.deleteActivity(id);
    }

}