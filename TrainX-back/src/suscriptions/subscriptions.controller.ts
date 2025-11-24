import { Controller, Get, Post, Delete, Body, Param } from '@nestjs/common';
import { SubscriptionsService } from './subscriptions.service';
import { Subscription } from './entities/subscription.entity';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiBody } from '@nestjs/swagger';

@ApiTags('Subscriptions')
@Controller('subscriptions')
export class SubscriptionsController {
  constructor(private readonly subscriptionsService: SubscriptionsService) {}

  @Get()
  @ApiOperation({ summary: 'Retrieve all subscriptions registered in the platform' })
  @ApiResponse({ status: 200, description: 'Returns an array with all subscriptions, including details like ID, user, type, and status.' })
  findAll() {
    return this.subscriptionsService.findAll();
  }

  @Post()
  @ApiOperation({ summary: 'Create a new subscription for a user' })
  @ApiBody({ description: 'Partial subscription object containing user ID, type, and other optional fields.', type: Object })
  @ApiResponse({ status: 201, description: 'Returns the newly created subscription with all its details.' })
  create(@Body() subscription: Partial<Subscription>) {
    return this.subscriptionsService.create(subscription);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Remove a subscription by its ID' })
  @ApiParam({ name: 'id', description: 'Unique ID of the subscription to delete', type: String })
  @ApiResponse({ status: 200, description: 'Returns confirmation that the subscription was removed successfully.' })
  remove(@Param('id') id: string) {
    return this.subscriptionsService.remove(id);
  }

  @Get(':id/status')
  @ApiOperation({ summary: 'Check the status of a specific subscription' })
  @ApiParam({ name: 'id', description: 'Unique ID of the subscription to check', type: String })
  @ApiResponse({ status: 200, description: 'Returns the current status of the subscription (active, expired, etc.).' })
  checkStatus(@Param('id') id: string) {
    return this.subscriptionsService.checkSubscriptionStatus(id);
  }
}
