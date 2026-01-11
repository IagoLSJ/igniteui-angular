export interface IProductNode  {
    ID: string;
    ChildLevels: number;
    ProductName: string;
    Col1: number;
    Col2: number;
    Col3: number;
    childData?: IProductNode [];
    childData2?: IProductNode [];
    hasChild: boolean;
}

