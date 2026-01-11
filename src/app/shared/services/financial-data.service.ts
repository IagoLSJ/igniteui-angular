import { Injectable } from '@angular/core';
import { Region } from '../models/region.model';
import { GeneratedFinancialData, FinancialDataItem, PriceResult } from '../models/financial-data.model';
import { SettlementType } from '../types/settlement.type';
import { ContractType } from '../types/contract.type';
import { REGIONS } from '../data/regions.data';
import { DATA } from '../data/financial-data.data';
import { SETTLEMENT } from '../data/settlement.data';
import { CONTRACT } from '../data/contract.data';
import { MOCKFINANCEDATA } from '../data/mock-financial-data.data';
import { FinancialDataGeneratorUtil } from '../utils/financial-data-generator.util';

@Injectable()
export class FinancialDataService {
    public updateAllPrices(data: GeneratedFinancialData[]): GeneratedFinancialData[] {
        for (const dataRow of data) {
            this.randomizeObjectData(dataRow);
        }
        return Array.from(data);
    }

    public updateRandomPrices(data: GeneratedFinancialData[]): GeneratedFinancialData[] {
        for (let i = Math.round(Math.random() * 10); i < data.length; i += Math.round(Math.random() * 10)) {
            this.randomizeObjectData(data[i]);
        }
        return Array.from(data);
    }

    public generateData(count: number): GeneratedFinancialData[] {
        const currData: GeneratedFinancialData[] = [];
        for (let i = 0; i < count; i++) {
            const rand = Math.floor(Math.random() * Math.floor(DATA.length));
            const dataObj = Object.assign({}, DATA[rand]) as GeneratedFinancialData;

            dataObj.Settlement = SETTLEMENT[FinancialDataGeneratorUtil.generateRandomNumber(0, 1)];
            dataObj.Contract = CONTRACT[FinancialDataGeneratorUtil.generateRandomNumber(0, 4)];
            dataObj.LastUpdated = FinancialDataGeneratorUtil.randomizeDate();
            dataObj['OpenPriceDiff'] = (((dataObj['Open Price'] - dataObj['Price']) / dataObj['Price']) * 100) * 150;
            dataObj['BuyDiff'] = (((dataObj['Buy'] - dataObj['Price']) / dataObj['Price']) * 100) * 150;
            dataObj['SellDiff'] = (((dataObj['Sell'] - dataObj['Price']) / dataObj['Price']) * 100) * 150;
            dataObj['Start(Y)Diff'] = (((dataObj['Start(Y)'] - dataObj['Price']) / dataObj['Price']) * 100) * 150;
            dataObj['High(Y)Diff'] = (((dataObj['High(Y)'] - dataObj['Price']) / dataObj['Price']) * 100) * 150;
            dataObj['Low(Y)Diff'] = (((dataObj['Low(Y)'] - dataObj['Price']) / dataObj['Price']) * 100) * 150;
            dataObj['High(D)Diff'] = (((dataObj['High(D)'] - dataObj['Price']) / dataObj['Price']) * 100) * 150;
            dataObj['Low(D)Diff'] = (((dataObj['Low(D)'] - dataObj['Price']) / dataObj['Price']) * 100) * 150;

            const region = REGIONS[FinancialDataGeneratorUtil.generateRandomNumber(0, 5)];
            dataObj.Region = region.Region;
            dataObj.Country = this.randomizeCountry(region);

            for (const mockData of MOCKFINANCEDATA) {
                for (const prop in mockData) {
                    if (mockData.hasOwnProperty(prop)) {
                        (dataObj as Record<string, string | number | null | undefined>)[prop] = mockData[prop as keyof typeof mockData];
                    }
                }
            }

            dataObj.ID = i;
            this.randomizeObjectData(dataObj);
            currData.push(dataObj);
        }
        return currData;
    }

    private randomizeObjectData(dataObj: GeneratedFinancialData): void {
        const changeP = 'Change(%)';
        const res = FinancialDataGeneratorUtil.generateNewPrice(dataObj.Price);
        dataObj.Change = res.Price - dataObj.Price;
        dataObj.Price = res.Price;
        dataObj[changeP] = res.ChangePercent;
    }

    private randomizeCountry(region: Region): string | undefined {
        let country: string | undefined;
        switch (region.Region) {
            case 'North America': {
                country = region.Countries[FinancialDataGeneratorUtil.generateRandomNumber(0, 2)];
                break;
            }
            case 'South America': {
                country = region.Countries[FinancialDataGeneratorUtil.generateRandomNumber(0, 11)];
                break;
            }
            case 'Europe': {
                country = region.Countries[FinancialDataGeneratorUtil.generateRandomNumber(0, 26)];
                break;
            }
            case 'Asia Pacific': {
                country = region.Countries[FinancialDataGeneratorUtil.generateRandomNumber(0, 15)];
                break;
            }
            case 'Africa': {
                country = region.Countries[FinancialDataGeneratorUtil.generateRandomNumber(0, 10)];
                break;
            }
            case 'Middle East': {
                country = region.Countries[FinancialDataGeneratorUtil.generateRandomNumber(0, 12)];
                break;
            }
        }
        return country;
    }
}

