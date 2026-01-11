export interface SellerRecord {
    SellerName: string;
    [key: string]: string | number;
}

export interface AllSellerRecord {
    AllSeller: string;
    AllSeller_records: SellerRecord[];
    [key: string]: string | number | AllSellerRecord | SellerRecord[];
}

export interface ProductCategoryRecord {
    ProductCategory: string;
    AllSeller_records: AllSellerRecord[];
    [key: string]: string | number | AllSellerRecord[];
}

export interface PivotMockDataItem {
    AllProducts: string;
    AllProducts_records?: ProductCategoryRecord[];
    AllSeller_records?: AllSellerRecord[];
    [key: string]: string | number | ProductCategoryRecord[] | AllSellerRecord[];
}

export interface PivotSimpleDataItem {
    AllProducts: string;
    All: number;
    AllProducts_records: {
        ProductCategory: string;
        All: number;
        [key: string]: string | number;
    }[];
    [key: string]: string | number | {
        ProductCategory: string;
        All: number;
        [key: string]: string | number;
    }[];
}

export interface PivotRemoteDataItem {
    AllProducts: string;
    All: number;
    'AllProducts-records': {
        ProductCategory: string;
        All: number;
        [key: string]: string | number;
    }[];
    [key: string]: string | number | {
        ProductCategory: string;
        All: number;
        [key: string]: string | number;
    }[];
}

