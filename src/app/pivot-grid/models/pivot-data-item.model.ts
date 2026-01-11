export interface PivotDataItem {
    ProductCategory: string;
    UnitPrice: number;
    SellerName: string;
    Country: string;
    City: string;
    Date: string;
    UnitsSold: number;
}

export interface AmountOfSaleDataItem extends PivotDataItem {
    AmountOfSale?: number;
}

