import { Controller, Get, Post, Body, Delete, Param, Patch } from '@nestjs/common';
import { BrokerService } from './broker.service';

@Controller('brokers')
export class BrokerController {
    constructor(private readonly brokerService: BrokerService) {}

    @Get()
    getBrokers(): any[] {
        return this.brokerService.getBrokers();
    }

    @Post()
    addBroker(@Body() broker: any): void {
        this.brokerService.addBroker({ ...broker, id: Date.now() });
    }

    @Delete(':id')
    deleteBroker(@Param('id') id: string): void {
        this.brokerService.deleteBroker(parseInt(id, 10));
    }

    @Patch(':id/balance')
    updateBalance(@Param('id') id: string, @Body('balance') balance: number): void {
        this.brokerService.updateBalance(parseInt(id, 10), balance);
    }
}
