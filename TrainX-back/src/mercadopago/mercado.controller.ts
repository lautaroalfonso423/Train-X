import { Body, Controller, Get, Param, ParseUUIDPipe, Post, Query, Req, Res, UseGuards } from "@nestjs/common";
import { MpService } from "./mercado.service";
import { AuthGuard } from "@nestjs/passport";
import { ApiBearerAuth, ApiBody, ApiOperation, ApiParam, ApiQuery, ApiResponse, ApiTags } from "@nestjs/swagger";

@ApiTags("Mercado Pago")
@Controller("mp")
export class MpController {

    constructor(private readonly service: MpService) {}

    @Post('preference/:id')
    @UseGuards(AuthGuard("jwt"))
    @ApiBearerAuth()
    @ApiOperation({ summary: "Create a Mercado Pago payment preference" })
    @ApiParam({ name: "id", type: "string", format: "uuid", description: "Plan ID" })
    @ApiBody({ description: "Data required to create the payment preference", type: Object })
    @ApiResponse({ status: 201, description: "Payment preference successfully created" })
    async preferencePay(
        @Param("id", new ParseUUIDPipe()) idPlan: string,
        @Body() paymentData: any,
        @Req() req
    ) {
        const id = req.user.id;
        const preference = await this.service.CreatePreference(paymentData, id, idPlan);
        return {
            init_point: preference.init_point,
            external_reference: preference.external_reference
        };
    }

    @Post("webhook")
    @ApiOperation({ summary: "Webhook endpoint to receive Mercado Pago notifications" })
    @ApiBody({ description: "Webhook payload sent by Mercado Pago", type: Object })
    @ApiQuery({ name: "topic", required: false, description: "Topic sent by Mercado Pago" })
    @ApiQuery({ name: "id", required: false, description: "ID of the resource notified" })
    @ApiResponse({ status: 200, description: "Webhook successfully processed" })
    async notification(@Body() body: any, @Query() query: any) {

        const topic =
            query.topic ||
            body.topic ||
            body.type ||
            body.action?.split('.')[0];

        const id =
            query.id ||
            body.id ||
            body.data?.id ||
            (body.resource ? body.resource.split('/').pop() : null);

        if (topic === "merchant_order" && id) {
            await this.service.processMerchant(id);
        } else if (topic === "payment" && id) {
            await this.service.processPayment(id);
        } else {
            console.log('⚠️ Unhandled notification type:', topic);
        }

        return { received: true, topic, id };
    }

    @Get('success')
    @ApiOperation({ summary: "Success redirection after payment approval" })
    @ApiResponse({ status: 302, description: "Redirects user after successful payment" })
    handleSuccess(@Res() res: any) {
        return res.redirect("https://trainx-front.vercel.app/dashboard/user")

    }

    @Get('failure')
    @ApiOperation({ summary: "Response for failed payments" })
    @ApiQuery({ name: "data", required: false, description: "Query params returned by Mercado Pago" })
    @ApiResponse({ status: 200, description: "Payment failed response" })
    handleFailure(@Res() res: any) {
        return res.redirect("https://trainx-front.vercel.app/dashboard/user")
    }

    @Get('pending')
    @ApiOperation({ summary: "Response for pending payments" })
    @ApiQuery({ name: "data", required: false, description: "Query params returned by Mercado Pago" })
    @ApiResponse({ status: 200, description: "Payment pending response" })
    handlePending(@Res() res: any) {
        return res.redirect("https://trainx-front.vercel.app/dashboard/user")
    }

}
