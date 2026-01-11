import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { SortingDirection } from 'igniteui-angular';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { Product } from './models/product';
import { ODataResponse } from './models/oDataResponse';
import { VirtualizationArgs } from './models/virtualizationArgs'; 
import { SortingArgs } from './models/sortingArgs'; 

const DATA_URL = 'https://services.odata.org/V4/Northwind/Northwind.svc/Products';
const EMPTY_STRING = '';

export enum SortOrder {
  ASC = 'asc',
  DESC = 'desc',
  NONE = ''
}

@Injectable({ providedIn: 'root' })
export class RemoteVirtService {

  private readonly dataSubject =
    new BehaviorSubject<Product[]>([]);

  public readonly data$: Observable<Product[]> =
    this.dataSubject.asObservable();

  private cachedData: (Product | null)[] = [];

  constructor(private http: HttpClient) {}

  public hasItemsInCache(args: VirtualizationArgs): boolean {
    const startIndex = args.startIndex;
    const endIndex = args.chunkSize + startIndex;

    for (let i = startIndex; i < endIndex; i++) {
      if (this.cachedData[i] === null) {
        return false;
      }
    }
    return true;
  }

  public getData(
    virtualizationArgs: VirtualizationArgs,
    sortingArgs?: SortingArgs,
    resetData = false,
    cb?: (data: Product[]) => void
  ): void {

    const startIndex = virtualizationArgs.startIndex;
    const endIndex = virtualizationArgs.chunkSize + startIndex;

    if (resetData) {
      this.http
        .get<ODataResponse<Product>>(this.buildDataUrl(virtualizationArgs, sortingArgs))
        .subscribe(response => {
          this.cachedData =
            new Array<Product | null>(response['@odata.count']).fill(null);

          this.updateData(response, startIndex);
          cb?.(response.value);
        });

      return;
    }

    if (!this.hasItemsInCache(virtualizationArgs)) {
      this.http
        .get<ODataResponse<Product>>(this.buildDataUrl(virtualizationArgs, sortingArgs))
        .subscribe(response => {
          this.updateData(response, startIndex);
          cb?.(response.value);
        });
    } else {
      const data = this.cachedData
        .slice(startIndex, endIndex)
        .filter((p): p is Product => p !== null);

      this.dataSubject.next(data);
      cb?.(data);
    }
  }

  private updateData(
    response: ODataResponse<Product>,
    startIndex: number
  ): void {
    this.dataSubject.next(response.value);

    response.value.forEach((item, i) => {
      this.cachedData[i + startIndex] = item;
    });
  }

  private buildDataUrl(
    virtualizationArgs: VirtualizationArgs,
    sortingArgs?: SortingArgs
  ): string {

    let baseQueryString = `${DATA_URL}?$count=true`;
    let scrollingQuery = EMPTY_STRING;
    let orderQuery = EMPTY_STRING;

    if (sortingArgs) {
      const sortingDirection =
        sortingArgs.dir === SortingDirection.Asc
          ? SortOrder.ASC
          : sortingArgs.dir === SortingDirection.Desc
            ? SortOrder.DESC
            : SortOrder.NONE;

      orderQuery = `$orderby=${sortingArgs.fieldName} ${sortingDirection}`;
    }

    if (virtualizationArgs) {
      const skip = virtualizationArgs.startIndex;
      const requiredChunkSize =
        virtualizationArgs.chunkSize === 0 ? 11 : virtualizationArgs.chunkSize;

      scrollingQuery = `$skip=${skip}&$top=${requiredChunkSize}`;
    }

    let query = EMPTY_STRING;
    if (orderQuery) query += `&${orderQuery}`;
    if (scrollingQuery) query += `&${scrollingQuery}`;

    return baseQueryString + query;
  }
}
