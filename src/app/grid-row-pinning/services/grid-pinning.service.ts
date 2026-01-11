import { Injectable } from '@angular/core';
import { IgxGridComponent, IPinningConfig, ColumnPinningPosition, RowPinningPosition, RowType } from 'igniteui-angular';

@Injectable({
    providedIn: 'root'
})
export class GridPinningService {

    constructor() { }

    public toggleRowPinning(grid: IgxGridComponent, data: unknown[], index: number): void {
        const rec = data[index];
        if (grid.isRecordPinned(rec)) {
            grid.unpinRow(data[index]);
        } else {
            grid.pinRow(data[index]);
        }
    }

    public toggleRowPinningByRow(row: RowType, event: Event): void {
        event.preventDefault();
        if (row.pinned) {
            row.unpin();
        } else {
            row.pin();
        }
    }

    public toggleColumnPinning(config: IPinningConfig): IPinningConfig {
        if (config.columns === ColumnPinningPosition.End) {
            return { columns: ColumnPinningPosition.Start, rows: config.rows };
        } else {
            return { columns: ColumnPinningPosition.End, rows: config.rows };
        }
    }

    public toggleRowPinningPosition(config: IPinningConfig): IPinningConfig {
        if (config.rows === RowPinningPosition.Bottom) {
            return { columns: config.columns, rows: RowPinningPosition.Top };
        } else {
            return { columns: config.columns, rows: RowPinningPosition.Bottom };
        }
    }
}

