import { Module } from '@nestjs/common';
import { StockController } from './stock.controller';

@Module({
    controllers: [StockController],
})
export class StockModule {}
