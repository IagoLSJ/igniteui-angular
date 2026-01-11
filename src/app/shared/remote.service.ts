import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';
import { map } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { Product } from './models/product';
import { ODataResponse } from './models/oDataResponse';
import { DataState } from './types/data-state.type';

@Injectable()
export class RemoteService {
    public remotePagingData: BehaviorSubject<Product[]>;
    public urlPaging = 'https://www.igniteui.com/api/products';
    public totalCount: Observable<number>;
    public remoteData: Observable<Product[]>;
    public url = `https://services.odata.org/V4/Northwind/Northwind.svc/Products`;
    public urlBuilder: (dataState?: DataState) => string;

    private _remoteData: BehaviorSubject<Product[]>;
    private _totalCount: BehaviorSubject<number>;

    constructor(private http: HttpClient) {
        this._remoteData = new BehaviorSubject<Product[]>([]);
        this.remoteData = this._remoteData.asObservable();
        this._totalCount = new BehaviorSubject<number | null>(null);
        this.totalCount = this._totalCount.asObservable();
        this.remotePagingData = new BehaviorSubject<Product[]>([]);
    }

    public nullData() {
        this._remoteData.next(null as unknown as Product[]);
    }

    public undefinedData() {
        this._remoteData.next(undefined as unknown as Product[]);
    }

    public getData(data?: DataState, cb?: (data: ODataResponse<Product>) => void) {
        return this.http.get<ODataResponse<Product>>(this.buildUrl(data)).pipe(
            map(response => response),
        )
        .subscribe(d => {
            this._remoteData.next(d.value);
            this._totalCount.next(d['@odata.count']);
            if (cb) {
                cb(d);
            }
        });
    }

    public getOrdersData(url: string, _data?: DataState, cb?: (data: ODataResponse<Product>) => void) {
        return this.http.get<ODataResponse<Product>>(url).pipe(
            map(response => response),
        )
        .subscribe(d => {
            this._remoteData.next(d.value);
            this._totalCount.next(d['@odata.count']);
            if (cb) {
                cb(d);
            }
        });
    }

    public buildUrl(dataState?: DataState): string {
        return this.urlBuilder(dataState);
    }

    public getPagingData(index?: number, perPage?: number): void {
        let qS = '';

        if (perPage) {
            qS = `?$skip=${index}&$top=${perPage}&$count=true`;
        }

        this.http
            .get<Product[]>(`${this.urlPaging + qS}`).pipe(
                map((data: Product[]) => data)
            ).subscribe((data) => this.remotePagingData.next(data));
    }

    public getPagingDataLength(): Observable<number> {
        return this.http.get<Product[]>(this.urlPaging).pipe(
            map((data: Product[]) => data.length)
        );
    }
}
