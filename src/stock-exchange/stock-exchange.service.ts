import {Injectable} from '@nestjs/common';
import axios from 'axios';
import * as fs from 'fs';

@Injectable()
export class StockExchangeService {
    private isTrading = false;
    private currentDate: Date;
    private readonly brokersFile = 'brokers.json';
    private stockPrices: { [key: string]: number } = {};
    startDate: Date;

    getStatus() {
        return {isTrading: this.isTrading, currentDate: this.currentDate};
    }

    async getAllUsers(): Promise<any> {
        try {
            const brokers = this.loadBrokers();;
            return brokers;
        } catch (error) {
            throw error;
        }
    }
    startTrading(settings: { startDate: string; tradingSpeed: number; tickers: string[] }): void {
        if (this.isTrading) {
            throw new Error('Trading is already in progress');
        }

        this.isTrading = true;
        this.currentDate = new Date(settings.startDate);
        this.startDate = new Date(settings.startDate);

        console.log("start");
        settings.tickers.forEach(async (ticker) => {
            const stockPrice = await this.getStockPriceFromApi(ticker, this.currentDate);
            this.stockPrices[ticker] = stockPrice;
        });
    }

    stopTrading(): void {
        if (!this.isTrading) {
            throw new Error('No active trading to stop');
        }

        this.isTrading = false;
    }

    getStockPrices(tickers: string[], currentDate: Date, k: number): { [p: string]: number } {
        const stockPrices: { [key: string]: number } = {};

        tickers.forEach((ticker) => {
            if (this.stockPrices && this.stockPrices[ticker] && this.stockPrices[ticker][k])
                stockPrices[ticker] = this.stockPrices[ticker][k][8];
        });

        return stockPrices;
    }

    private async getStockPriceFromApi(symbol: string, date: any): Promise<number> {
        try {
            const currentDate = date instanceof Date ? date : new Date(date);
            console.log(`https://data.nasdaq.com/api/v3/datasets/WIKI/${symbol}.json`);
            const response = await axios.get(`https://data.nasdaq.com/api/v3/datasets/WIKI/${symbol}.json`, {
                params: {
                    start_date: currentDate,
                    api_key: 'wAyv4RszgyNAf9_QL2eu',
                },
            });

            const stockPrice = response.data.dataset.data;
            return stockPrice;
        } catch (error) {
            console.log(`Error`);
            console.error(`Error fetching stock price for ${symbol} on ${date}`, error);
            throw new Error(`Error fetching stock price for ${symbol} on ${date}`);
        }
    }

    async buyStock(username: string, ticker: string, quantity: number, k: number) {
        const brokers = this.loadBrokers();

        const userIndex = brokers.findIndex((user) => user.name === username);

        if (userIndex !== -1) {
            const user = brokers[userIndex];

            const stockPrice = this.stockPrices[ticker][k][8];
            const totalPrice = stockPrice * quantity;

            console.log(stockPrice, quantity, totalPrice, user.balance);
            if (totalPrice <= user.balance) {
                user.balance -= totalPrice;
                user.stocks[ticker].purchasePrice += totalPrice;

                if (!user.stocks) {
                    user.stocks = {};
                }

                user.stocks[ticker].quantity += quantity;
                brokers[userIndex] = user;
                this.saveBrokers(brokers);

                return true;
            } else {
                throw new Error('Недостаточно средств для покупки акций.');
            }
        } else {
            throw new Error('Пользователь не найден.');
        }
    }

    async sellStock(username: string, ticker: string, quantity: number, k: number) {
        const brokers = this.loadBrokers();

        const userIndex = brokers.findIndex((user) => user.name === username);

        if (userIndex !== -1) {
            const user = brokers[userIndex];

            if (user.stocks && user.stocks[ticker].quantity >= quantity) {
                const stockPrice = this.stockPrices[ticker][k][8];
                const totalPrice = stockPrice * quantity;

                user.balance += totalPrice;
                user.stocks[ticker].quantity -= quantity;
                user.stocks[ticker].purchasePrice -= totalPrice;


                brokers[userIndex] = user;
                this.saveBrokers(brokers);

                return true;
            } else {
                throw new Error('Недостаточно акций для продажи.');
            }
        } else {
            throw new Error('Пользователь не найден.');
        }
    }

    private loadBrokers() {
        const data = fs.readFileSync(this.brokersFile, 'utf-8');
        return JSON.parse(data);
    }

    private saveBrokers(brokers: any[]) {
        fs.writeFileSync(this.brokersFile, JSON.stringify(brokers, null, 2), 'utf-8');
    }
}

