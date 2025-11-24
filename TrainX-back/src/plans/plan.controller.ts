import { Body, Controller, Delete, Get, Param, ParseUUIDPipe, Patch, Post, Put, Req, UseGuards } from "@nestjs/common";
import { PlanService } from "./plan.service";
import { partialDto, planDto } from "./plan.dto";
import { AuthGuard } from "@nestjs/passport";
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiBody, ApiBearerAuth } from "@nestjs/swagger";
import { AdminGuard, JwtAuthGuard } from "../auth/guards/admin.guard";

@ApiTags('Plans')
@Controller("plans")
export class PlanController{

    constructor(private readonly service: PlanService){}
    
    @Get()
    @ApiOperation({ summary: 'Get all plans' })
    @ApiResponse({ status: 200, description: 'List of plans retrieved successfully' })
    async viewPlan(){
        return await this.service.view()
    }
    
    @UseGuards(JwtAuthGuard)
    @Post()
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Create a new plan' })
    @ApiBody({ type: planDto })
    @ApiResponse({ status: 201, description: 'Plan created successfully' })
    @ApiResponse({ status: 400, description: 'Invalid input data' })
    @ApiResponse({ status: 401, description: 'Unauthorized' })
    async createPlan(
        @Body() plan: planDto,
        @Req() req: any
    ){
        const id = req.user.id
        return await this.service.create(plan, id)
    }
    
    @UseGuards(JwtAuthGuard)
    @Put(":id")
    @ApiOperation({ summary: 'Update a plan' })
    @ApiParam({ name: 'id', description: 'Plan ID' })
    @ApiBody({ type: partialDto })
    @ApiResponse({ status: 200, description: 'Plan updated successfully' })
    @ApiResponse({ status: 400, description: 'Invalid input data' })
    @ApiResponse({ status: 404, description: 'Plan not found' })
    async modifyPlan(
        @Param("id", new ParseUUIDPipe()) planId: string,
        @Body() plan: partialDto,
        @Req() req: any
    ){
        const userId = req.user.id
        return await this.service.modify(plan, userId, planId)
    }

    @UseGuards(JwtAuthGuard)
    @Delete(":id")
    @ApiOperation({ summary: 'Delete a plan' })
    @ApiParam({ name: 'id', description: 'Plan ID' })
    @ApiResponse({ status: 200, description: 'Plan deleted successfully' })
    @ApiResponse({ status: 404, description: 'Plan not found' })
    async deletePlan(
        @Param("id", new ParseUUIDPipe) id: string,
        @Req() req: any
    ){
        const userId = req.user.id
        await this.service.delete(userId, id)
        return {message: "Plan successfully deleted"} 
    }

    @UseGuards(JwtAuthGuard)
    @Patch(":id")
    @ApiOperation({ summary: 'Update plan status' })
    @ApiParam({ name: 'id', description: 'Plan ID' })
    @ApiResponse({ status: 200, description: 'Plan status updated successfully' })
    @ApiResponse({ status: 404, description: 'Plan not found' })
    async modifyStatus(
        @Param("id", new ParseUUIDPipe) id: string,
        @Req() req: any
    ){
        const userId = req.user.id
        return await this.service.status(id, userId)
    }
}