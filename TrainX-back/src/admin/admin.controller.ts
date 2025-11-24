import { Controller, Patch, Param, Body, UseGuards, Get, Query } from '@nestjs/common';
import { AdminService } from './admin.service';
import { UpdateUserStatusDto } from './dto/update-user-status.dto';
import { 
  ApiTags, 
  ApiOperation, 
  ApiResponse, 
  ApiParam, 
  ApiBody, 
  ApiQuery, 
  ApiBearerAuth
} from '@nestjs/swagger';
import { AdminGuard, JwtAuthGuard } from '../auth/guards/admin.guard';
import { UserEnum } from 'src/user.enum';

@ApiTags('Admin')
@Controller('admin')
@UseGuards( JwtAuthGuard, AdminGuard)
@ApiBearerAuth()
export class AdminController {

  constructor(private readonly adminService: AdminService) {}

  @Get("filter")
  async filter(
    @Query("status") status: UserEnum
  ){
    return await this.adminService.filterService(status)
  }

  @Get("seek")
  async seek(
    @Query("searchTerm") searchTerm: string
  ){
    return await this.adminService.seekService(searchTerm)
  }

  @Patch('users/:id/status')
  @ApiOperation({ 
    summary: 'Update user status',
    description: `Update the status of a specific user, such as activating, pausing, or suspending their account.  
This endpoint is typically used by administrators to manage user access or subscription states.`
  })
  @ApiParam({ 
    name: 'id', 
    description: 'Unique identifier of the user whose status will be updated', 
    type: String 
  })
  @ApiBody({ 
    description: 'Object containing the new status for the user. Example: { "status": "active" }', 
    type: UpdateUserStatusDto 
  })
  @ApiResponse({ status: 200, description: 'User status updated successfully and returns updated user data.' })
  @ApiResponse({ status: 400, description: 'Invalid user ID or invalid status value.' })
  @ApiResponse({ status: 404, description: 'User not found.' })
  updateUserStatus(
    @Param('id') id: string, 
    @Body("status") status: UserEnum) {
    return this.adminService.updateUserStatus(id, status);
  }

  @Get('payments')
  @ApiOperation({ 
    summary: 'Retrieve payment history',
    description: `Returns a list of all payments made by users.  
You may optionally filter the results by providing a specific *userId* to only show their payments.`
  })
  @ApiQuery({ 
    name: 'userId', 
    required: false, 
    description: 'Optional user ID to filter the list of payments', 
    type: String 
  })
  @ApiResponse({ status: 200, description: 'List of payments successfully retrieved.' })
  getPayments(@Query('userId') userId?: string) {
    return this.adminService.getPayments(userId);
  }

  @Get('statistics')
  @ApiOperation({
    summary: 'Get general platform statistics',
    description: `Returns global metrics and insights about the platform, such as number of active users, total subscriptions, revenue insights, and usage data.`
  })
  @ApiResponse({ status: 200, description: 'Statistics retrieved successfully.' })
  async getStatistics() {
    return this.adminService.getStatistics();
  }

  @Get('users')
  @ApiOperation({ 
    summary: 'Get a detailed list of all users',
    description: `Returns an enriched list of all registered users including:  
- Personal details  
- Subscription info  
- Payment history  
- Assigned trainer  
- Reservations and schedule usage  
This endpoint is ideal for generating admin dashboards.`
  })
  @ApiResponse({ status: 200, description: 'Users list with detailed related data retrieved successfully.' })
  async getUsersList() {
    return this.adminService.getUsersList();
  }

  @Get('statistics/monthly-revenue')
  @ApiOperation({ 
    summary: 'Get total monthly revenue',
    description: `Calculates and returns the total amount earned from paid subscriptions for the current month.  
Useful for financial dashboards and business analytics.`
  })
  @ApiResponse({ status: 200, description: 'Total monthly revenue returned successfully.' })
  async getMonthlyRevenue() {
    return this.adminService.getMonthlyRevenue();
  }

  @Get('statistics/plans/week-3')
  @ApiOperation({ 
    summary: 'Count of purchased 3-day plans',
    description: 'Returns how many 3-day subscription plans have been purchased by users.'
  })
  @ApiResponse({ status: 200, description: 'Count of 3-day plans returned successfully.' })
  async get3DaysPlansCount() {
    return this.adminService.getPlansCountByType('week-3');
  }

  @Get('statistics/plans/week-5')
  @ApiOperation({ 
    summary: 'Count of purchased 5-day plans',
    description: 'Returns how many 5-day subscription plans have been purchased by users.'
  })
  @ApiResponse({ status: 200, description: 'Count of 5-day plans returned successfully.' })
  async get5DaysPlansCount() {
    return this.adminService.getPlansCountByType('week-5');
  }

  @Patch('users/:id/activate')
  @ApiOperation({ 
    summary: 'Activate a user account',
    description: `This endpoint reactivates a user's account so they can resume using the system, booking classes, and accessing features.`
  })
  @ApiParam({ name: 'id', description: 'User ID to activate', type: String })
  @ApiResponse({ status: 200, description: 'User successfully activated.' })
  @ApiResponse({ status: 404, description: 'User not found.' })
  async activateUser(@Param('id') id: string) {
    return this.adminService.activateUser(id);
  }

  @Patch('users/:id/deactivate')
  @ApiOperation({ 
    summary: 'Deactivate a user account',
    description: `Temporarily disables a user account, preventing them from booking classes or accessing premium features.  
This does *not* delete their data or cancel future charges (unless handled elsewhere).`
  })
  @ApiParam({ name: 'id', description: 'User ID to deactivate', type: String })
  @ApiResponse({ status: 200, description: 'User successfully deactivated.' })
  @ApiResponse({ status: 404, description: 'User not found.' })
  async deactivateUser(@Param('id') id: string) {
    return this.adminService.deactivateUser(id);
  }

  

}
