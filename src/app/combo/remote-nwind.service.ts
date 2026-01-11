import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { IForOfState } from 'igniteui-angular';
import { BehaviorSubject, Subscription } from 'rxjs';
import { ODataResponse } from '../shared/models/oDataResponse';
import { NorthwindProduct } from './models/northwind-product.model';

@Injectable({ providedIn: 'root' })
export class RemoteNWindService {
    public remoteData: BehaviorSubject<NorthwindProduct[]>;
    private url = 'https://services.odata.org/V4/Northwind/Northwind.svc/Products';

    constructor(private http: HttpClient) {
        this.remoteData = new BehaviorSubject<NorthwindProduct[]>([]);
    }

    public getData(data?: IForOfState, searchText?: string, cb?: (data: ODataResponse<NorthwindProduct>) => void): Subscription {
        return this.http
            .get<ODataResponse<NorthwindProduct>>(this.buildUrl(data, searchText))
            .subscribe((d: ODataResponse<NorthwindProduct>) => {
                this.remoteData.next(d.value);
                if (cb) {
                    cb(d);
                }
            });
    }

    private buildUrl(dataState?: IForOfState, searchText?: string): string {
        let qS = '?';
        let requiredChunkSize: number;
        if (dataState) {
            const skip = dataState.startIndex;

            requiredChunkSize = dataState.chunkSize === 0 ?
                10 : dataState.chunkSize;
            qS += `$skip=${skip}&$top=${requiredChunkSize}&$count=true`;

            if (searchText) {
                qS += `&$filter=contains(ProductName, '` + searchText + `')`;
            }
        }
        return `${this.url}${qS}`;
    }
}
