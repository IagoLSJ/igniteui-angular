export interface Invoice {
    ID?: number;
    ShipAddress: string;
    ShipCity: string;
    ShipCountry: string;
    ShipName: string;
    ShipRegion: string;
    ShipPostalCode: string;
    CustomerID: string;
    CustomerName: string;
    Address: string;
    City: string;
    Region: string;
    PostalCode: string;
    Country: string;
    Salesperson: string;
    OrderID: number;
    OrderDate: Date;
    ShipperName: string;
    ProductID: number;
    ProductName: string;
    UnitPrice: number;
    Quantity: number;
    Discontinued: boolean;
    ExtendedPrice: number;
    Freight: number;
}