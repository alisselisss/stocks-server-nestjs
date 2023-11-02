import { Controller, Get, Param } from '@nestjs/common';

@Controller('stocks')
export class StockController {
    @Get()
    getStocks(): any[] {
        return [
            { symbol: 'AAPL', name: 'Apple, Inc.' },
            { symbol: 'SBUX', name: 'Starbucks, Inc.' },
            { symbol: 'MSFT', name: 'Microsoft, Inc.' },
            { symbol: 'CSCO', name: 'Cisco Systems, Inc.' },
            { symbol: 'QCOM', name: 'QUALCOMM Incorporated' },
            { symbol: 'AMZN', name: 'Amazon.com, Inc.' },
            { symbol: 'TSLA', name: 'Tesla, Inc.' },
            { symbol: 'AMD', name: 'Advanced Micro Devices, Inc.' },
        ];
    }

    @Get(':symbol/history')
    getStockHistory(@Param('symbol') symbol: string): any[] {
        return [
            { date: '2023-09-01', price: 150.0 },
            { date: '2023-09-02', price: 152.5 },
        ];
    }
}
