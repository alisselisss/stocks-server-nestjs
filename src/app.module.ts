import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { BrokerController } from './broker/broker.controller';
import { BrokerService } from './broker/broker.service';
import { BrokerModule } from './broker/broker.module';
import { StockController } from './stock/stock.controller';
import { StockModule } from './stock/stock.module';
import { ProxyController } from './proxy/proxy.controller';
import { ProxyModule } from './proxy/proxy.module';
import { StockExchangeController} from './stock-exchange/stock-exchange.controller';
import { StockExchangeModule } from './stock-exchange/stock-exchange.module';
import { StockExchangeService } from './stock-exchange/stock-exchange.service';
import { AuthController } from './auth/auth.controller';
import { AuthModule } from './auth/auth.module';
import { JwtService } from "@nestjs/jwt";

@Module({
  imports: [BrokerModule, StockModule, ProxyModule, StockExchangeModule, AuthModule],
  controllers: [AppController, BrokerController, StockController, ProxyController, StockExchangeController, AuthController],
  providers: [AppService, BrokerService, StockExchangeService, JwtService],
})
export class AppModule {}
