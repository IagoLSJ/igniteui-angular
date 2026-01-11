import { REGIONS } from './data/regions.data';
import { DEAL_TYPE } from './data/deal-type.data';
import { CONTRACT } from './data/contract.data';
import { SETTLEMENT } from './data/settlement.data';
import { MOCKFINANCEDATA } from './data/mock-financial-data.data';
import { DATA } from './data/financial-data.data';
import { FinancialDataService } from './services/financial-data.service';
import { GeneratedFinancialData } from './models/financial-data.model';

export { REGIONS, DEAL_TYPE as DealType, CONTRACT as Contract, SETTLEMENT as Settlement, MOCKFINANCEDATA, DATA };

export class FinancialData {
    private static service = new FinancialDataService();

    public static updateAllPrices(data: GeneratedFinancialData[]): GeneratedFinancialData[] {
        return this.service.updateAllPrices(data);
    }

    public static updateRandomPrices(data: GeneratedFinancialData[]): GeneratedFinancialData[] {
        return this.service.updateRandomPrices(data);
    }

    public static generateData(count: number): GeneratedFinancialData[] {
        return this.service.generateData(count);
    }
}
