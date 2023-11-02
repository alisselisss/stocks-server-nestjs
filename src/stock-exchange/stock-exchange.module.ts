import { Module } from '@nestjs/common';
import { StockExchangeController} from './stock-exchange.controller';
import { StockExchangeService } from './stock-exchange.service';

@Module({
    controllers: [StockExchangeController],
    providers: [
        StockExchangeService,
    ],
})
export class StockExchangeModule {}

