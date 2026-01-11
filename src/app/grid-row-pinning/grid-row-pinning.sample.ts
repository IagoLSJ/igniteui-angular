import { Component, OnInit, ViewChild, AfterViewInit, HostBinding, inject } from '@angular/core';

import {
    IgxGridComponent,
    ColumnPinningPosition,
    IPinningConfig,
    IgxGridStateDirective,
    IgxExcelExporterService,
    IgxExcelExporterOptions,
    GridSelectionMode,
    IgxIconService,
    RowType,
    IGX_HIERARCHICAL_GRID_DIRECTIVES,
    IgxTreeGridComponent,
    IgxIconComponent,
    IgxSwitchComponent,
    IgxButtonDirective
} from 'igniteui-angular';
import { pinLeft, unpinLeft } from '@igniteui/material-icons-extended';
import { GridSearchBoxComponent } from '../grid-search-box/grid-search-box.component';
import { SAMPLE_DATA } from '../shared/sample-data';
import { IGridColumn } from './models/grid-column.model';
import { ICustomer } from './models/customer.model';
import { IProductNode } from './models/product.model';
import { IEmployee } from './models/employee.model';
import { IGridOptions } from './models/grid-options.model';
import { GridSize } from './types/grid-size.type';
import { GridDataService } from './services/grid-data.service';
import { GridStateService } from './services/grid-state.service';
import { GridPinningService } from './services/grid-pinning.service';
import { GridConfigService } from './services/grid-config.service';
import { GridDensityService } from './services/grid-density.service';

@Component({
    selector: 'app-grid-row-pinning-sample',
    styleUrls: ['grid-row-pinning.sample.scss'],
    templateUrl: 'grid-row-pinning.sample.html',
    providers: [
        IgxIconService
    ],
    imports: [IGX_HIERARCHICAL_GRID_DIRECTIVES, IgxGridComponent, IgxTreeGridComponent, IgxIconComponent, GridSearchBoxComponent, IgxSwitchComponent, IgxButtonDirective]
})

export class GridRowPinningSampleComponent implements OnInit, AfterViewInit {
    @HostBinding('style.--ig-size')
    protected get sizeStyle(): string {
        return `var(--ig-size-${this.size})`;
    }
    @ViewChild('grid1', { static: true })
    private grid1: IgxGridComponent;

    @ViewChild(IgxGridStateDirective, { static: true })
    private state: IgxGridStateDirective;

    private iconService = inject(IgxIconService);
    private excelExportService = inject(IgxExcelExporterService);
    private gridStateService = inject(GridStateService);
    private gridPinningService = inject(GridPinningService);
    private gridConfigService = inject(GridConfigService);
    private gridDataService = inject(GridDataService);
    private gridDensityService = inject(GridDensityService);

    public pinningConfig: IPinningConfig = { columns: ColumnPinningPosition.Start };

    public options: IGridOptions = this.gridConfigService.getDefaultOptions();
    public selectionMode: GridSelectionMode;
    public size: GridSize = 'large';
    public data: ICustomer[];
    public hierarchicalData: IProductNode[];
    public columns: IGridColumn[];
    public hColumns: IGridColumn[];
    public treeColumns: IGridColumn[];
    public treeData: IEmployee[];

    public ngOnInit(): void {
        this.columns = this.gridConfigService.getDefaultColumns();
        this.hColumns = this.gridConfigService.getHierarchicalColumns();
        this.data = SAMPLE_DATA as ICustomer[];
        this.hierarchicalData = this.gridDataService.generateProductData(100, 3);
        this.treeColumns = this.gridConfigService.getTreeColumns();
        this.treeData = this.gridDataService.getEmployeeData();
        this.selectionMode = this.gridConfigService.getDefaultSelectionMode();
    }

    public ngAfterViewInit(): void {
        this.iconService.addSvgIconFromText(pinLeft.name, pinLeft.value, 'imx-icons');
        this.iconService.addSvgIconFromText(unpinLeft.name, unpinLeft.value, 'imx-icons');
    }

    public onRowChange(): void {
        this.pinningConfig = this.gridPinningService.toggleRowPinningPosition(this.pinningConfig);
    }

    public onChange(): void {
        this.pinningConfig = this.gridPinningService.toggleColumnPinning(this.pinningConfig);
    }

    public togglePinRow(index: number): void {
        this.gridPinningService.toggleRowPinning(this.grid1, this.data, index);
    }

    public togglePining(row: RowType, event: Event): void {
        this.gridPinningService.toggleRowPinningByRow(row, event);
    }

    public clickUnpin(): void {
        this.grid1.unpinRow('aaaa');
    }

    public generateDataUneven(count: number, level: number, parendID: string = null): IProductNode[] {
        return this.gridDataService.generateProductData(count, level, parendID);
    }

    public isPinned(cell: unknown): boolean {
        console.log(cell);
        return true;
    }

    public exportButtonHandler(): void {
        this.excelExportService.export(this.grid1, new IgxExcelExporterOptions('ExportFileFromGrid'));
    }

    public saveGridState(): void {
        this.gridStateService.saveGridState(this.state, 'grid1');
    }

    public restoreGridState(): void {
        this.gridStateService.restoreGridState(this.state, 'grid1');
    }

    public toggleDensity(): void {
        this.size = this.gridDensityService.toggleDensity(this.size);
    }
}
