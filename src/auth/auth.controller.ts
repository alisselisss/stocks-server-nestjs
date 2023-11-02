import {Controller, Post, Body, Res} from '@nestjs/common';
import { Response } from 'express';
import * as jwt from 'jsonwebtoken';
import * as fs from 'fs';

@Controller('auth')
export class AuthController {
    private readonly brokersFilePath = 'brokers.json';
    @Post('login')
    login(@Body() body: { username: string }, @Res() res: Response) {
        const brokers = this.loadBrokers();
        const user = brokers.find((broker) => broker.name === body.username);

        if (user) {
            const token = jwt.sign({ username: user.name}, 'secretKey');
            res.json({user: user, token: token});
        } else {
            //throw new Error('User not found');
            res.status(404).json({ message: 'User not found' });
        }
    }

    private loadBrokers() {
        try {
            const brokersData = fs.readFileSync(this.brokersFilePath, 'utf-8');
            return JSON.parse(brokersData);
        } catch (error) {
            console.error('Error loading brokers:', error.message);
            return [];
        }
    }
}
