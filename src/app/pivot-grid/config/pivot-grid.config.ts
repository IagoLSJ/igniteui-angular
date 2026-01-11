import {
    IPivotConfiguration,
    IPivotDimension,
    IPivotGridRecord,
    IPivotGridColumn,
    IgxPivotDateDimension
} from 'igniteui-angular';
import { FilteringExpressionsTree, FilteringLogic, IgxStringFilteringOperand } from 'igniteui-angular';
import { IgxTotalSaleAggregate } from '../aggregates/total-sale.aggregate';

export class PivotGridConfigFactory {
    public static createFilterExpTree(): FilteringExpressionsTree {
        const filterExpTree = new FilteringExpressionsTree(FilteringLogic.And);
        filterExpTree.filteringOperands = [
            {
                condition: IgxStringFilteringOperand.instance().condition('equals'),
                conditionName: IgxStringFilteringOperand.instance().condition('equals').name,
                fieldName: 'SellerName',
                searchVal: 'Stanley'
            }
        ];
        return filterExpTree;
    }

    public static createDimensions(): IPivotDimension[] {
        return [
            {
                memberName: 'Country',
                displayName: 'Country',
                enabled: true
            },
            new IgxPivotDateDimension(
                {
                    memberName: 'Date',
                    displayName: 'Date',
                    enabled: true
                },
                {
                    months: true,
                    quarters: true
                }
            ),
            {
                memberFunction: () => 'All',
                memberName: 'AllProducts',
                displayName: 'All Products',
                enabled: true,
                childLevel: {
                    memberFunction: (data: { ProductCategory: string }) => data.ProductCategory,
                    memberName: 'ProductCategory',
                    displayName: 'Product Category',
                    enabled: true
                }
            },
            {
                memberName: 'AllSeller',
                displayName: 'All Sellers',
                enabled: true,
                childLevel: {
                    enabled: true,
                    memberName: 'SellerName',
                    displayName: 'Seller Name'
                }
            }
        ];
    }

    public static createPivotConfig(_filterExpTree: FilteringExpressionsTree): IPivotConfiguration {
        return {
            columns: [
                {
                    memberName: 'City',
                    displayName: 'City',
                    enabled: true,
                    width: 'auto'
                }
            ],
            rows: [
                {
                    memberName: 'SellerName',
                    displayName: 'Seller Name',
                    enabled: true,
                    width: 'auto'
                }
            ],
            values: [
                {
                    member: 'UnitsSold',
                    displayName: 'Units Sold',
                    aggregate: {
                        key: 'SUM',
                        aggregatorName: 'SUM',
                        label: 'Sum'
                    },
                    enabled: true,
                    styles: {
                        upFont: (rowData: IPivotGridRecord, columnData: IPivotGridColumn): boolean =>
                            (rowData.aggregationValues.get(columnData.field) as number) > 300,
                        downFont: (rowData: IPivotGridRecord, columnData: IPivotGridColumn): boolean =>
                            (rowData.aggregationValues.get(columnData.field) as number) <= 300
                    },
                    formatter: (value: number | string | null | undefined): string | undefined => {
                        return value ? `${value}$` : undefined;
                    }
                },
                {
                    member: 'AmountOfSale',
                    displayName: 'Amount of Sale',
                    aggregate: {
                        key: 'SUM',
                        aggregator: IgxTotalSaleAggregate.totalSale,
                        label: 'Sum of Sale'
                    },
                    aggregateList: [
                        {
                            key: 'SUM',
                            aggregator: IgxTotalSaleAggregate.totalSale,
                            label: 'Sum of Sale'
                        },
                        {
                            key: 'MIN',
                            aggregator: IgxTotalSaleAggregate.totalMin,
                            label: 'Minimum of Sale'
                        },
                        {
                            key: 'MAX',
                            aggregator: IgxTotalSaleAggregate.totalMax,
                            label: 'Maximum of Sale'
                        }
                    ],
                    enabled: true,
                    dataType: 'currency',
                    styles: {
                        upFont1: (rowData: IPivotGridRecord, columnKey: IPivotGridColumn): boolean => {
                            const value = rowData.aggregationValues.get(columnKey.field);
                            return typeof value === 'number' && value > 50;
                        },
                        downFont1: (rowData: IPivotGridRecord, columnKey: IPivotGridColumn): boolean => {
                            const value = rowData.aggregationValues.get(columnKey.field);
                            return typeof value === 'number' && value <= 50;
                        }
                    }
                }
            ]
        };
    }

    public static createNewConfig(filterExpTree: FilteringExpressionsTree): IPivotConfiguration {
        return {
            columns: [
                {
                    memberName: 'City',
                    displayName: 'City',
                    enabled: true
                }
            ],
            rows: [
                {
                    memberName: 'SellerName',
                    displayName: 'Seller Name',
                    enabled: true,
                    filter: filterExpTree
                }
            ],
            values: [
                {
                    member: 'UnitsSold',
                    displayName: 'Units Sold',
                    aggregate: {
                        key: 'SUM',
                        aggregatorName: 'SUM',
                        label: 'Sum'
                    },
                    enabled: true
                }
            ]
        };
    }
}

