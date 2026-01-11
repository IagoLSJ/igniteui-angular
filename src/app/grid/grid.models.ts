export interface Product {
    ProductID: number;
    ProductName: string;
    SupplierID?: number;
    CategoryID?: number;
    UnitsInStock?: number;
    Discontinued?: boolean;
}

export interface LocalRecord {
    ID: number;
    Name: string;
    Date: Date;
}

export type ExportFormat = 'XLSX' | 'CSV' | 'TSV' | 'TAB';