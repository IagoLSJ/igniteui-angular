export interface ICustomer {
    ID: string;
    CompanyName?: string;
    ContactName?: string;
    ContactTitle?: string;
    Address?: string;
    City?: string;
    Region?: string | null;
    PostalCode?: string;
    Country?: string;
    Phone?: string;
    Fax?: string | null;
    Employees?: number;
    DateCreated?: Date;
    Contract?: boolean | null;
    Time?: Date;
}

