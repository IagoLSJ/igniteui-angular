import { TemplateRef } from '@angular/core';
import { ColumnType, RowType } from './common/grid.interface';
import { IgxRowDirective } from './row.directive';
import { ISearchInfo } from './common/events';
import { GridSelectionMode } from './common/enums';

export interface IgxGridCellConfig {
    column: ColumnType;
    isPlaceholder?: boolean;
    isMerged?: boolean;
    intRow: IgxRowDirective;
    rowData?: any;
    columnData?: any;
    cellTemplate?: TemplateRef<any>;
    cellValidationErrorTemplate?: TemplateRef<any>;
    pinnedIndicator?: TemplateRef<any>;
    value?: any;
    formatter?: (value: any, rowData?: any, columnData?: any) => any;
    visibleColumnIndex?: number;
    cellSelectionMode?: GridSelectionMode;
    lastSearchInfo?: ISearchInfo;
    lastPinned?: boolean;
    firstPinned?: boolean;
    editMode?: boolean;
    width?: string;
    active?: boolean;
    displayPinnedChip?: boolean;
}