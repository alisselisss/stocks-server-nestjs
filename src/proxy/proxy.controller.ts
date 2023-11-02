import { Controller, Get, Param, Res } from '@nestjs/common';
import axios from 'axios';
import { Response } from 'express';

@Controller('proxy')
export class ProxyController {
    @Get(':url')
    async proxyRequest(@Param('url') url: string, @Res() res: Response) {
        try {
            const response = await axios.get(`https://data.nasdaq.com/api/v3/datasets/WIKI/${url}.json`, {
                params: {
                    api_key: 'wAyv4RszgyNAf9_QL2eu',
                },
            });

            res.status(response.status).json(response.data);
        } catch (error) {
            res.status(error.response.status).json(error.response.data);
        }
    }
}
