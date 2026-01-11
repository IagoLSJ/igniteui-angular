import { PivotAggregation } from 'igniteui-angular';
import { PivotDataItem } from '../models/pivot-data-item.model';

export class IgxTotalSaleAggregate {
    public static totalSale: PivotAggregation = (_members: unknown[], data: PivotDataItem[]): number =>
        data.reduce((accumulator: number, value: PivotDataItem) => accumulator + value.UnitPrice * value.UnitsSold, 0);

    public static totalMin: PivotAggregation = (_members: unknown[], data: PivotDataItem[]): number => {
        let min = 0;
        if (data.length === 1) {
            min = data[0].UnitPrice * data[0].UnitsSold;
        } else if (data.length > 1) {
            const mappedData = data.map((x: PivotDataItem) => x.UnitPrice * x.UnitsSold);
            min = mappedData.reduce((a: number, b: number) => Math.min(a, b));
        }
        return min;
    };

    public static totalMax: PivotAggregation = (_members: unknown[], data: PivotDataItem[]): number => {
        let max = 0;
        if (data.length === 1) {
            max = data[0].UnitPrice * data[0].UnitsSold;
        } else if (data.length > 1) {
            const mappedData = data.map((x: PivotDataItem) => x.UnitPrice * x.UnitsSold);
            max = mappedData.reduce((a: number, b: number) => Math.max(a, b));
        }
        return max;
    };
}

