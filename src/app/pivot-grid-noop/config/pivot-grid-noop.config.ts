import {
    IPivotConfiguration,
    IgxPivotNumericAggregate,
    NoopPivotDimensionsStrategy
} from 'igniteui-angular';

export class PivotGridNoopConfigFactory {
    public static createPivotConfigHierarchy(): IPivotConfiguration {
        return {
            columnStrategy: NoopPivotDimensionsStrategy.instance(),
            rowStrategy: NoopPivotDimensionsStrategy.instance(),
            columns: [
                {
                    memberName: 'Country',
                    enabled: true
                }
            ],
            rows: [
                {
                    memberFunction: () => 'All',
                    memberName: 'AllProducts',
                    enabled: true,
                    width: '25%',
                    childLevel: {
                        memberName: 'ProductCategory',
                        enabled: true
                    }
                },
                {
                    memberName: 'AllSeller',
                    memberFunction: () => 'All Sellers',
                    enabled: true,
                    childLevel: {
                        enabled: true,
                        memberName: 'SellerName'
                    }
                }
            ],
            values: [
                {
                    member: 'UnitsSold',
                    aggregate: {
                        aggregator: IgxPivotNumericAggregate.sum,
                        key: 'sum',
                        label: 'Sum'
                    },
                    enabled: true
                }
            ],
            filters: null
        };
    }

    public static createConfigDifferentSeparator(): IPivotConfiguration {
        return {
            pivotKeys: {
                aggregations: 'aggregations',
                records: 'records',
                children: 'children',
                level: 'level',
                columnDimensionSeparator: '_',
                rowDimensionSeparator: '-'
            },
            columnStrategy: NoopPivotDimensionsStrategy.instance(),
            rowStrategy: NoopPivotDimensionsStrategy.instance(),
            columns: [
                {
                    memberName: 'All',
                    memberFunction: () => 'All',
                    enabled: true,
                    childLevel: {
                        memberName: 'Country',
                        enabled: true
                    }
                }
            ],
            rows: [
                {
                    memberName: 'AllProducts',
                    memberFunction: () => 'All Products',
                    enabled: true,
                    childLevel: {
                        memberName: 'ProductCategory',
                        enabled: true
                    }
                }
            ],
            values: [
                {
                    member: 'UnitsSold',
                    aggregate: {
                        aggregator: IgxPivotNumericAggregate.sum,
                        key: 'sum',
                        label: 'Sum'
                    },
                    enabled: true
                }
            ],
            filters: null
        };
    }
}

