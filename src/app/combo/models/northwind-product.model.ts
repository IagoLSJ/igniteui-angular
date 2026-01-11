export interface NorthwindProduct {
    ProductID: number;
    ProductName: string;
    SupplierID?: number;
    CategoryID?: number;
    UnitPrice?: number;
    UnitsInStock?: number;
    UnitsOnOrder?: number;
    ReorderLevel?: number;
    Discontinued?: boolean;
}
