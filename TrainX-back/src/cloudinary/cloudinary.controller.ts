import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { CloudinaryService } from './cloudinary.service';
import { AuthGuard } from '@nestjs/passport';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

@ApiTags('Cloudinary')
@Controller('cloudinary')
export class CloudinaryController {
    constructor(private readonly cloudinaryService: CloudinaryService) {}

    @UseGuards(AuthGuard('jwt'))
    @Get('signature')
    @ApiOperation({ summary: 'Generate a secure upload signature for Cloudinary' })
    @ApiResponse({ status: 200, description: 'Returns a signature and timestamp for uploading files to Cloudinary in the user-specific folder.' })
    @ApiResponse({ status: 401, description: 'Unauthorized if the JWT token is missing or invalid.' })
    getSignature(@Req() req) {
        const userId = req.user.id;
        const folder = `pins/${userId}`;
        return this.cloudinaryService.generateUploadSignature(folder);
    }
}
