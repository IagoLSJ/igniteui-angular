import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
    CellType,
    IgxPaginatorComponent,
    IgxGridDetailTemplateDirective,
    IgxColumnComponent,
    IgxGridToolbarComponent,
    IgxGridToolbarActionsComponent,
    IgxGridToolbarPinningComponent,
    IgxGridToolbarHidingComponent,
    IgxButtonDirective,
    IgxIconComponent,
    IgxRowIslandComponent,
    IgxGridComponent,
    IgxTreeGridComponent,
    IgxHierarchicalGridComponent
} from 'igniteui-angular';
import { HIERARCHICAL_SAMPLE_DATA, SAMPLE_DATA } from '../shared/sample-data';
import { SampleDataItem, HierarchicalDataItem, TreeGridDataItem } from './models/grid-data.model';
import {
    GridColumnConfig,
    HierarchicalColumnConfig,
    TreeGridHierColumnConfig,
    TreeGridColumnConfig
} from './models/column-config.model';
import { ColumnConfigFactory } from './config/column-config.config';
import { TREE_GRID_DATA } from './data/tree-grid-data.data';
import { DataGeneratorService } from './services/data-generator.service';
import { CellLoggerService } from './services/cell-logger.service';
import { GridComponentType } from './types/grid-type.union';

@Component({
    selector: 'app-grid-cell-api-sample',
    styleUrls: ['grid-cell-api.sample.scss'],
    templateUrl: 'grid-cell-api.sample.html',
    providers: [DataGeneratorService, CellLoggerService],
    imports: [
        FormsModule,
        IgxGridComponent,
        IgxPaginatorComponent,
        IgxGridDetailTemplateDirective,
        IgxColumnComponent,
        IgxGridToolbarComponent,
        IgxGridToolbarActionsComponent,
        IgxGridToolbarPinningComponent,
        IgxGridToolbarHidingComponent,
        IgxButtonDirective,
        IgxIconComponent,
        IgxTreeGridComponent,
        IgxHierarchicalGridComponent,
        IgxRowIslandComponent
    ]
})
export class GridCellAPISampleComponent implements OnInit {
    public data2: unknown;
    public data: SampleDataItem[];
    public treeGridHierData: SampleDataItem[];
    public hierarchicalData: HierarchicalDataItem[];
    public columns: GridColumnConfig[];
    public hColumns: HierarchicalColumnConfig[];
    public treeGridHierColumns: TreeGridHierColumnConfig[];
    public treeColumns: TreeGridColumnConfig[];
    public treeData: TreeGridDataItem[];

    public index = '00';
    public tIndex = '00';
    public tHIndex = '00';
    public hIndex = '00';

    public cellKey = 'ALFKI';
    public tCellKey = '0';
    public tHCellKey = 'ALFKI';
    public hCellKey = '0';

    public columnField = 'ContactName';
    public tcolumnField = 'Salary';
    public tHcolumnField = 'ContactName';
    public hcolumnField = 'ProductName';

    public selectedCell: CellType;

    constructor(
        private dataGeneratorService: DataGeneratorService,
        private cellLoggerService: CellLoggerService
    ) {}

    public ngOnInit(): void {
        this.columns = ColumnConfigFactory.createGridColumns();
        this.hColumns = ColumnConfigFactory.createHierarchicalColumns();
        this.treeGridHierColumns = ColumnConfigFactory.createTreeGridHierColumns();
        this.treeColumns = ColumnConfigFactory.createTreeGridColumns();

        this.treeGridHierData = HIERARCHICAL_SAMPLE_DATA.slice(0) as SampleDataItem[];
        this.data = SAMPLE_DATA as SampleDataItem[];
        this.hierarchicalData = this.dataGeneratorService.generateDataUneven(100, 3);
        this.treeData = TREE_GRID_DATA;
    }

    public updateCell(
        grid: GridComponentType,
        rIndex: string,
        field: string,
        logger: HTMLElement
    ): void {
        const cell = grid.getCellByColumn(parseInt(rIndex, 10), field);
        cell.update('New Value');
        this.cellLoggerService.logState(grid, rIndex, field, logger);
    }

    public select(
        grid: GridComponentType,
        rIndex: string,
        field: string,
        logger: HTMLElement
    ): void {
        const cell = grid.getCellByColumn(parseInt(rIndex, 10), field);
        cell.selected = !cell.selected;
        this.selectedCell = cell;
        this.cellLoggerService.logState(grid, rIndex, field, logger);
    }

    public setEditMode(
        grid: GridComponentType,
        rIndex: string,
        field: string,
        logger: HTMLElement
    ): void {
        const cell = grid.getCellByColumn(parseInt(rIndex, 10), field);
        cell.editMode = !cell.editMode;
        this.cellLoggerService.logState(grid, rIndex, field, logger);
    }

    public logState(
        grid: GridComponentType,
        rIndex: string,
        field: string,
        logger: HTMLElement
    ): void {
        this.cellLoggerService.logState(grid, rIndex, field, logger);
    }

    public logStateByKey(
        grid: GridComponentType,
        rIndex: string,
        field: string,
        logger: HTMLElement
    ): void {
        this.cellLoggerService.logStateByKey(grid, rIndex, field, logger);
    }

    public logStateByColumn(
        grid: GridComponentType,
        rowIndex: string,
        field: string,
        logger: HTMLElement
    ): void {
        this.cellLoggerService.logStateByColumn(grid, rowIndex, field, logger);
    }

    private getIndices(indices: string): number[] {
        return this.dataGeneratorService.getIndices(indices);
    }
}
