import { Injectable } from '@nestjs/common';
import * as fs from 'fs';

@Injectable()
export class BrokerService {
    private filePath = 'brokers.json';

    getBrokers(): any[] {
        try {
            const data = fs.readFileSync(this.filePath, 'utf-8');
            return JSON.parse(data);
        } catch (error) {
            console.error('Error reading brokers file:', error);
            return [];
        }
    }

    saveBrokers(brokers: any[]): void {
        try {
            const data = JSON.stringify(brokers, null, 2);
            fs.writeFileSync(this.filePath, data, 'utf-8');
        } catch (error) {
            console.error('Error writing brokers file:', error);
        }
    }

    addBroker(broker: any): void {
        const brokers = this.getBrokers();
        brokers.push(broker);
        this.saveBrokers(brokers);
    }

    deleteBroker(id: number): void {
        const brokers = this.getBrokers();
        const updatedBrokers = brokers.filter(broker => broker.id !== id);
        this.saveBrokers(updatedBrokers);
    }

    updateBalance(id: number, newBalance: number): void {
        const brokers = this.getBrokers();
        const updatedBrokers = brokers.map(broker => {
            if (broker.id === id) {
                return { ...broker, balance: newBalance };
            }
            return broker;
        });
        this.saveBrokers(updatedBrokers);
    }
}
