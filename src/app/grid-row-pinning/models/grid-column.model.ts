export interface IGridColumn {
    field: string;
    width?: string;
    hidden?: boolean;
    groupable?: boolean;
    pinned?: boolean;
    label?: string;
    resizable?: boolean;
    dataType?: 'string' | 'number' | 'date' | 'boolean';
    hasSummary?: boolean;
}

