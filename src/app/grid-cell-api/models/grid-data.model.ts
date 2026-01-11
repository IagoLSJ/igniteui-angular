export interface SampleDataItem {
    ID: string;
    CompanyName: string;
    ContactName: string;
    ContactTitle: string;
    Address: string;
    City: string;
    Region?: string | null;
    PostalCode: string;
    Country: string;
    Phone: string;
    Fax?: string | null;
    Employees?: number;
    DateCreated?: Date | undefined;
    Contract?: boolean | null;
    Time?: Date;
}

export interface HierarchicalDataItem {
    ID: string;
    ChildLevels: number;
    ProductName: string;
    Col1: number;
    Col2: number;
    Col3: number;
    childData?: HierarchicalDataItem[];
    childData2?: HierarchicalDataItem[];
    hasChild: boolean;
}

export interface TreeGridDataItem {
    employeeID: number;
    PID: number;
    Salary: number;
    firstName: string;
    lastName: string;
    Title: string;
}

