import { PriceResult } from '../models/financial-data.model';

export class FinancialDataGeneratorUtil {
    public static generateRandomNumber(min: number, max: number): number {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    public static generateNewPrice(oldPrice: number): PriceResult {
        const rnd = parseFloat(Math.random().toFixed(2));
        const volatility = 2;
        let newPrice = 0;

        let changePercent = 2 * volatility * rnd;
        if (changePercent > volatility) {
            changePercent -= (2 * volatility);
        }

        const changeAmount = oldPrice * (changePercent / 100);
        newPrice = oldPrice + changeAmount;

        const result: PriceResult = { Price: 0, ChangePercent: 0 };
        result.Price = parseFloat(newPrice.toFixed(2));
        result.ChangePercent = parseFloat(changePercent.toFixed(2));

        return result;
    }

    public static randomizeDate(): Date {
        const date = new Date();
        date.setHours(this.generateRandomNumber(0, 23));
        date.setMonth(this.generateRandomNumber(0, date.getMonth()));
        date.setDate(this.generateRandomNumber(0, 23));
        return date;
    }
}

