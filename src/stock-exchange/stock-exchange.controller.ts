import {Controller, Get, Post, Body, Query, Res, HttpException, HttpStatus, Inject, Param} from '@nestjs/common';
import { Response } from 'express';
import { StockExchangeService } from './stock-exchange.service';
import axios from "axios";

@Controller('stock-exchange')
export class StockExchangeController {
    private stockPrices: { [p: string]: number };
    constructor(private readonly stockExchangeService: StockExchangeService) {}

    private isTrading: boolean = false;
    private currentDate = new Date();
    private k: number = 0;

    private clients: Response[] = [];

    @Get('sse')
    setupSSE(@Res() res: Response): void {
        res.setHeader('Content-Type', 'text/event-stream');
        res.setHeader('Cache-Control', 'no-cache');
        res.setHeader('Connection', 'keep-alive');

        this.clients.push(res);

        res.write(`data: ${JSON.stringify({ type: 'connected', timestamp: this.currentDate.toISOString().split("T")[0], prices: this.stockPrices, start: this.stockExchangeService.startDate })}\n\n`);

        res.on('close', () => {
            this.clients = this.clients.filter(client => client !== res);
        });
    }

    sendSSEUpdate(): void {
        const message = { type: 'update', timestamp: this.currentDate.toISOString().split("T")[0], prices: this.stockPrices, start: this.stockExchangeService.startDate  };

        this.clients.forEach(client => {
            client.write(`data: ${JSON.stringify(message)}\n\n`);
        });
    }

    @Get('current-date')
    getCurrentDate(@Res() res) {
        const currentDate = this.currentDate.toISOString().split('T')[0];

        res.header('Access-Control-Expose-Headers', 'currentDate');
        res.header('currentDate', currentDate);
        res.send();
        return { currentDate };
    }

    @Post('start-trading')
    async startTrading(@Body() settings: {
        startDate: string;
        tradingSpeed: number;
        tickers: string[]
    }, @Res() res: Response) {
        if (this.isTrading) {
            res.status(400).json({error: 'Trading is already in progress'});
        } else {
            this.isTrading = true;
            await this.stockExchangeService.startTrading(settings);
            res.json({message: 'Trading started successfully'});
        }
    }

    @Post('stop-trading')
    stopTrading(@Res() res: Response) {
        if (this.isTrading) {
            this.isTrading = false;
            this.k = 0;
            this.stockExchangeService.stopTrading();
            res.json({ message: 'Trading stopped successfully' });
        } else {
            res.status(400).json({ error: 'No active trading to stop' });
        }
    }

    @Get('stock-prices')
    async getStockPrices(@Query('tickers') tickers: string[], @Query('date') date: any, @Res() res: Response): Promise<any> {
        try {
            if (this.isTrading) {
                const currentDate = date instanceof Date ? date : new Date(date);
                this.currentDate = currentDate;
                this.sendSSEUpdate();
                const stockPrices = this.stockExchangeService.getStockPrices(tickers, currentDate, this.k);
                this.k++;

                this.stockPrices = stockPrices;
                console.log(stockPrices);
                res.status(200).json(stockPrices);
            }
        } catch (error) {
            console.error('Error fetching stock prices', error);
            throw new HttpException('Internal Server Error', HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @Post('buy-stock')
    async buyStock(@Body() data: { ticker: string; quantity: number, username: string }) {
        await this.stockExchangeService.buyStock(data.username, data.ticker, data.quantity, this.k);

        return { success: true, message: 'Акции успешно куплены.' };
    }

    @Post('sell-stock')
    async sellStock(@Body() data: { ticker: string; quantity: number, username: string }) {
        await this.stockExchangeService.sellStock(data.username, data.ticker, data.quantity, this.k);

        return { success: true, message: 'Акции успешно проданы.' };
    }

    @Post('graph')
    async proxyRequest(@Body() data: { ticker: string }, @Res() res: Response) {
        try {
            const response = await axios.get(`https://data.nasdaq.com/api/v3/datasets/WIKI/${data.ticker}.json`, {
                params: {
                    api_key: 'wAyv4RszgyNAf9_QL2eu',
                    start_date: this.stockExchangeService.startDate,
                    end_date: this.currentDate,
                },
            });
            res.status(response.status).json(response.data);
        } catch (error) {
            res.status(error.response.status).json(error.response.data);
        }
    }

    @Get('users')
    async getAllUsers(@Res() res) {
        try {
            const users = await this.stockExchangeService.getAllUsers();
            res.header('Access-Control-Expose-Headers', 'users');
            res.json(users);
            return { users };
        } catch (error) {
            throw error;
        }
    }
}


