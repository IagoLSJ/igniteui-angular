export interface CompanyData {
    ID: string;
    CompanyName?: string;
    ContactName?: string;
    ContactTitle?: string;
    Address?: string;
    City?: string;
    Region?: string;
    PostalCode?: string;
    Country?: string;
    Phone?: string;
    Fax?: string;
    ChildCompanies?: CompanyData[];
    selected?: boolean;
    expanded?: boolean;
    disabled?: boolean;
    active?: boolean;
}
