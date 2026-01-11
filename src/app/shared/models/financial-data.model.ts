export interface FinancialDataItem {
    Category: string;
    Type: string;
    Spread: number;
    'Open Price': number;
    Price: number;
    Buy: number;
    Sell: number;
    Change: number;
    'Change(%)': number;
    Volume: number;
    'High(D)': number;
    'Low(D)': number;
    'High(Y)': number;
    'Low(Y)': number;
    'Start(Y)': number;
    'Change On Year(%)': number;
}

export interface GeneratedFinancialData extends FinancialDataItem {
    ID?: number;
    Region?: string;
    Country?: string;
    Settlement?: string;
    Contract?: string;
    LastUpdated?: Date;
    OpenPriceDiff?: number;
    BuyDiff?: number;
    SellDiff?: number;
    'Start(Y)Diff'?: number;
    'High(Y)Diff'?: number;
    'Low(Y)Diff'?: number;
    'High(D)Diff'?: number;
    'Low(D)Diff'?: number;
    IndGrou?: string;
    IndSect?: string;
    IndSubg?: string;
    SecType?: string;
    CpnTyp?: string;
    IssuerN?: string;
    Moodys?: string;
    Fitch?: string;
    DBRS?: string;
    CollatT?: string;
    Curncy?: string;
    Security?: string;
    sector?: string;
    CUSIP?: string;
    Ticker?: string;
    Cpn?: string;
    Maturity?: string;
    KRD_3YR?: number;
    RISK_COUNTRY?: string;
    MUNI_SECTOR?: string;
    ZV_SPREAD?: number;
    KRD_5YR?: number;
    KRD_1YR?: number;
    PD_WALA?: string | null;
    [key: string]: string | number | Date | null | undefined;
}

export interface MockFinancialData {
    IndGrou: string;
    IndSect: string;
    IndSubg: string;
    SecType: string;
    CpnTyp: string;
    IssuerN: string;
    Moodys: string;
    Fitch: string;
    DBRS: string;
    CollatT: string;
    Curncy: string;
    Security: string;
    sector: string;
    CUSIP: string;
    Ticker: string;
    Cpn: string;
    Maturity: string;
    KRD_3YR: number;
    RISK_COUNTRY: string;
    MUNI_SECTOR: string;
    ZV_SPREAD: number;
    KRD_5YR: number;
    KRD_1YR: number;
    PD_WALA: string | null;
}

export interface PriceResult {
    Price: number;
    ChangePercent: number;
}

