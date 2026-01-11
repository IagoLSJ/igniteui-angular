import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { FinancialData } from './financialData';
import { GeneratedFinancialData } from './models/financial-data.model';
import { ODataResponse } from './models/oDataResponse';

@Injectable()
export class LocalService {
    public records: Observable<GeneratedFinancialData[]>;
    public url: string;
    public dataStore: GeneratedFinancialData[];

    private _records: BehaviorSubject<GeneratedFinancialData[]>;

    constructor(private http: HttpClient) {
        this.dataStore = [];
        this._records = new BehaviorSubject<GeneratedFinancialData[]>([]);
        this.records = this._records.asObservable();
    }

    public getData() {
        return this.http.get<ODataResponse<GeneratedFinancialData>>(this.url).subscribe(data => {
            this.dataStore = data.value;
            this._records.next(this.dataStore);
        });
    }

    public getFinancialData(count = 10) {
        this._records.next(FinancialData.generateData(count));
    }

    public updateAllPriceValues(data: GeneratedFinancialData[]) {
        const newData = FinancialData.updateAllPrices(data);
        this._records.next(newData);
    }

    public updateRandomPriceValues(data: GeneratedFinancialData[]) {
        const newData = FinancialData.updateRandomPrices(data);
        this._records.next(newData);
    }
}
