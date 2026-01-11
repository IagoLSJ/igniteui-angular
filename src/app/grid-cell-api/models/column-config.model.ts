export interface BaseColumnConfig {
    field: string;
    width?: string | number;
    resizable?: boolean;
    pinned?: boolean;
    hidden?: boolean;
    groupable?: boolean;
    summary?: boolean;
    header?: string;
    label?: string;
    dataType?: string;
    hasSummary?: boolean;
}

export interface GridColumnConfig extends BaseColumnConfig {
    field: string;
    width?: string;
    hidden?: boolean;
    header?: string;
    groupable?: boolean;
    pinned?: boolean;
}

export interface HierarchicalColumnConfig extends BaseColumnConfig {
    field: string;
    width?: string;
}

export interface TreeGridHierColumnConfig extends BaseColumnConfig {
    field: string;
    width: number;
    resizable: boolean;
    pinned?: boolean;
    summary?: boolean;
}

export interface TreeGridColumnConfig extends BaseColumnConfig {
    field: string;
    label: string;
    width: number;
    resizable: boolean;
    dataType: string;
    hasSummary: boolean;
}

