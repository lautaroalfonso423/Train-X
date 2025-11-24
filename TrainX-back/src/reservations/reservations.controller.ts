import { Controller, Post, Body, Delete, Param, BadRequestException, Get, Req, ParseUUIDPipe, UseGuards, Patch } from '@nestjs/common';
import { ReservationsService } from './reservations.service';
import { CancelReservationDto } from "./dtos/cancel-reservation.dto"
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiBody } from '@nestjs/swagger';
import { AdminGuard, JwtAuthGuard } from '../auth/guards/admin.guard';

@ApiTags('Reservations')
@Controller('reservations')
export class ReservationsController {
    constructor(private readonly reservationsService: ReservationsService) {}

    @Get()
    @ApiOperation({ summary: 'Get all reservations' })
    @ApiResponse({ status: 200, description: 'List of reservations retrieved successfully' })
    findAllReservations() {
        return this.reservationsService.findAllReservations();
    }

    @Get("user/:id")
    @ApiOperation({ summary: 'Get user reservations' })
    findUserReservations(@Param('id') userId: string) {
        return this.reservationsService.findUserReservations(userId);
    }

    @Get('user/:id/weekly-status')
    @ApiOperation({ summary: 'Get user weekly reservation status and limits' })
    @ApiParam({ name: 'id', description: 'User ID', type: String })
    @ApiResponse({ 
        status: 200, 
        description: 'Returns the weekly reservation status including used days and remaining days',
        schema: {
            example: {
                planType: 'week-3',
                maxDaysPerWeek: 3,
                usedDays: 2,
                remainingDays: 1,
                reservedDays: ['lunes', 'miércoles'],
                canReserveNewDay: true
            }
        }
    })
    async getWeeklyStatus(@Param('id') userId: string) {
        return this.reservationsService.getWeeklyReservationStatus(userId);
    }


    @Get('can-reserve/:userId/:scheduleId')
    @ApiOperation({ summary: 'Check if user can reserve a specific schedule' })
    @ApiParam({ name: 'userId', description: 'User ID', type: String })
    @ApiParam({ name: 'scheduleId', description: 'Schedule ID', type: String })
    @ApiResponse({ 
        status: 200, 
        description: 'Returns whether the user can reserve that specific day',
        schema: {
            example: {
                canReserve: true,
                reason: 'Ya tienes 3 días reservados: lunes, miércoles, viernes',
                reservedDays: ['lunes', 'miércoles', 'viernes']
            }
        }
    })
    async canReserveOnDay(
        @Param('userId') userId: string,
        @Param('scheduleId') scheduleId: string
    ) {
        return this.reservationsService.canReserveOnDay(userId, scheduleId);
    }

    @UseGuards(JwtAuthGuard)
    @Post(":id")
    @ApiOperation({ summary: 'Create a new reservation' })
    @ApiBody({ 
        description: 'Reservation data',
        schema: {
            type: 'object',
            properties: {
                userId: { type: 'string', description: 'User ID' },
                scheduleId: { type: 'string', description: 'Schedule ID' }
            },
            required: ['userId', 'scheduleId']
        }
    })
    @ApiResponse({ status: 201, description: 'Reservation created successfully' })
    @ApiResponse({ status: 400, description: 'Invalid input data' })
    @ApiResponse({ status: 404, description: 'User or schedule not found' })
    @ApiResponse({ status: 409, description: 'Reservation already exists or schedule is full' })
    async createReservation(
        @Param("id", new ParseUUIDPipe()) scheduleId: string ,
        @Req() req: any
    ) {
        const userId = req.user.id
        return this.reservationsService.createReservation(userId, scheduleId);
    }

    @UseGuards(JwtAuthGuard)
    @Patch(':id')
    @ApiOperation({ summary: 'Cancel a reservation' })
    @ApiParam({ name: 'id', description: 'Reservation ID' })
    @ApiBody({ type: CancelReservationDto })
    @ApiResponse({ status: 200, description: 'Reservation cancelled successfully' })
    @ApiResponse({ status: 400, description: 'User ID is required' })
    @ApiResponse({ status: 404, description: 'Reservation not found' })
    @ApiResponse({ status: 403, description: 'User not authorized to cancel this reservation' })
    async cancelReservation(
        @Param('id', new ParseUUIDPipe()) id: string,
        @Req() req: any
    ) {
        const userId = req.user.id
        return this.reservationsService.cancelReservation(id, userId);
    }

    @UseGuards(JwtAuthGuard)
    @Delete(":id")
    @ApiOperation({ summary: 'Delete a reservation' })
    @ApiParam({ name: 'id', description: 'Reservation ID' })
    @ApiResponse({ status: 200, description: 'Reservation deleted successfully' })
    @ApiResponse({ status: 404, description: 'Reservation not found' })
    @ApiResponse({ status: 403, description: 'User not authorized to delete this reservation' })
    async deleteReservation(
        @Param("id", new ParseUUIDPipe())  id: string,
        @Req() req: any
    ){
        const userId = req.user.id
        await this.reservationsService.deleteReservation(id, userId);
        return {message: "Reserva eliminada correctamente"}
    }

}