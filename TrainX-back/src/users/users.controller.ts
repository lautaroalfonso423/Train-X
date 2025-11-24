import { Controller, Get, Post, Delete, Param, Body, Patch, ParseUUIDPipe, Req, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { User } from './entities/user.entity';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiBody } from '@nestjs/swagger';
import { AssignTrainerDto } from './dtos/assign-trainer.dto';
import { UpdateNameDto } from './dtos/update-name.dto';
import { AdminGuard, JwtAuthGuard } from '../auth/guards/admin.guard';

@ApiTags('Users')
@Controller('users')
export class UsersController {
    constructor(private readonly usersService: UsersService) {}

    @Get()
    @ApiOperation({ summary: 'Retrieve all users registered in the platform' })
    @ApiResponse({ status: 200, description: 'Returns an array of all users, including details like ID, name, email, and profile picture.' })
    findAll() {
        return this.usersService.findAll();
    }

    @Get(':id')
    @ApiOperation({ summary: 'Retrieve a specific user by their ID' })
    @ApiParam({ name: 'id', description: 'Unique ID of the user to retrieve', type: String })
    @ApiResponse({ status: 200, description: 'Returns the user details for the specified ID.' })
    findOne(@Param('id') id: string) {
        return this.usersService.findOne(id);
    }

    @Get('trainer/:id')
    @ApiOperation({ summary: 'Retrieve the trainer assigned to a specific user' })
    @ApiParam({ name: 'id', description: 'Unique ID of the user to check trainer assignment', type: String })
    @ApiResponse({ status: 200, description: 'Returns the trainer assigned to the specified user.' })
    findUserTrainer(@Param('id') id: string) {
        return this.usersService.findUserTrainer(id);
    }

    @Get("plan/:id")
    @ApiOperation({ summary: 'Retrieve the active plan of a specific user' })
    @ApiParam({ name: 'id', description: 'Unique ID of the user', type: String })
    @ApiResponse({ status: 200, description: 'Returns the plan information for the specified user.' })
    async planUser(
        @Param("id", new ParseUUIDPipe()) userId: string,
    ){
        return this.usersService.planUserService(userId);
    }

    @Get(':id/can-have-trainer')
    @ApiOperation({ summary: 'Check if a user can have a personal trainer based on their plan' })
    @ApiParam({ name: 'id', description: 'Unique ID of the user', type: String })
    @ApiResponse({ 
        status: 200, 
        description: 'Returns whether the user can have a trainer and the reason if not allowed.',
        schema: {
            example: {
                allowed: false,
                reason: 'El plan de 3 días no incluye entrenador personal',
                planType: 'week-3'
            }
        }
    })
    async canHaveTrainer(@Param('id') id: string) {
        return this.usersService.canHaveTrainer(id);
    }

    @Post()
    @ApiOperation({ summary: 'Create a new user in the platform' })
    @ApiBody({ description: 'Partial user object containing the necessary data to create a user.', type: Object })
    @ApiResponse({ status: 201, description: 'Returns the newly created user with all its details.' })
    create(@Body() user: Partial<User>) {
        return this.usersService.create(user);
    }

    @Delete(':id')
    @ApiOperation({ summary: 'Remove a user by their ID' })
    @ApiParam({ name: 'id', description: 'Unique ID of the user to remove', type: String })
    @ApiResponse({ status: 200, description: 'Returns confirmation that the user was successfully removed.' })
    remove(@Param('id') id: string) {
        return this.usersService.remove(id);
    }

    @Patch(':id/profile-picture')
    @ApiOperation({ summary: 'Update the profile picture of a specific user' })
    @ApiParam({ name: 'id', description: 'Unique ID of the user whose profile picture will be updated', type: String })
    @ApiBody({ description: 'Object containing the new image URL for the profile picture.', type: Object })
    @ApiResponse({ status: 200, description: 'Returns the user with the updated profile picture.' })
    async uploadProfilePicture(@Param('id') id: string, @Body() body: { imageUrl: string }) {
        return this.usersService.uploadProfilePicture(id, body.imageUrl);
    }

    @Patch(':id/trainer')
    @UseGuards(JwtAuthGuard)
    @ApiOperation({ summary: 'Assign a trainer to the user (only if they have an active subscription)' })
    @ApiParam({ name: 'id', description: 'User ID to assign trainer to', type: String })
    @ApiBody({ type: AssignTrainerDto })
    @ApiResponse({ status: 200, description: 'Trainer assigned successfully.' })
    assignTrainer(
        @Param('id') id: string,
        @Req() req: any
    ) {
        const userId = req.user.id
        return this.usersService.assignTrainer(id, userId);
    }
    
    @Patch(':id/name')
    @ApiOperation({ summary: 'Update the name of a specific user' })
    @ApiParam({ name: 'id', description: 'Unique ID of the user to update', type: String })
    @ApiBody({ type: UpdateNameDto })
    @ApiResponse({ status: 200, description: 'Returns the user with the updated name.' })
    async updateName(@Param('id') id: string, @Body() body: UpdateNameDto) {
        return this.usersService.updateName(id, body.name);
    }
}
