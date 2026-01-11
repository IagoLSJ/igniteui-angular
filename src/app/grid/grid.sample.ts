import { Component, OnInit, ViewChild, AfterViewInit, ChangeDetectorRef } from '@angular/core';
import { Observable } from 'rxjs';
import { AsyncPipe, NgIf } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { RemoteService } from '../shared/remote.service';
import { LocalService } from '../shared/local.service';
import { 
    CsvFileTypes, DefaultSortingStrategy, GridSelectionMode, IgxBaseExporter, 
    IgxCheckboxComponent, IgxCsvExporterOptions, 
    IgxCsvExporterService, IgxExcelExporterOptions, IgxExcelExporterService, 
    IgxExporterOptionsBase, IgxGridComponent, IgxSnackbarComponent, 
    IgxStringFilteringOperand, IgxSwitchComponent, IgxToastComponent, 
    IGX_CARD_DIRECTIVES, IGX_GRID_DIRECTIVES, IGX_INPUT_GROUP_DIRECTIVES, 
    SortingDirection, VerticalAlignment, IGridEditEventArgs, IGridCellEventArgs 
} from 'igniteui-angular';
import { ExportFormat, LocalRecord, Product } from './grid.models';

@Component({
    selector: 'app-grid-sample',
    styleUrls: ['grid.sample.scss'],
    templateUrl: 'grid.sample.html',
    standalone: true,
    providers: [LocalService, RemoteService],
    imports: [
        FormsModule, AsyncPipe, NgIf,
        IGX_GRID_DIRECTIVES, IGX_CARD_DIRECTIVES, IGX_INPUT_GROUP_DIRECTIVES,
        IgxCheckboxComponent, IgxSwitchComponent, IgxToastComponent, IgxSnackbarComponent
    ]
})
export class GridSampleComponent implements OnInit, AfterViewInit {
    @ViewChild('grid1', { static: true }) public grid1!: IgxGridComponent;
    @ViewChild('grid2', { static: true }) public grid2!: IgxGridComponent;
    @ViewChild('grid3', { static: true }) public grid3!: IgxGridComponent;
    @ViewChild('toast', { static: true }) private toast!: IgxToastComponent;
    @ViewChild('snax', { static: true }) private snax!: IgxSnackbarComponent;

    public data$!: Observable<LocalRecord[]>;
    public remote$!: Observable<Product[]>;
    public localData: LocalRecord[] = [];
    
    public selectedCell?: IGridCellEventArgs;
    public selectedRowData: any; 
    public newRecordName = '';
    public editCell?: { columnField: string, rowIndex: number };
    
    public exportFormat: ExportFormat;
    public selectionMode = GridSelectionMode.multiple;
    public perPage = 10;

    constructor(
        private localService: LocalService,
        private remoteService: RemoteService,
        private excelExporter: IgxExcelExporterService,
        private csvExporter: IgxCsvExporterService,
        private cdr: ChangeDetectorRef
    ) {
        this.setupRemoteUrlBuilder();
    }

    public ngOnInit(): void {
        this.initializeData();
        this.setupGridsConfiguration();
    }

    public ngAfterViewInit(): void {
        this.cdr.detectChanges();
    }

    private initializeData(): void {
        this.data$ = this.localService.records;
        this.remote$ = this.remoteService.remoteData;
        this.localService.getData();

        this.localData = [
            { ID: 1, Name: 'A', Date: new Date() },
            { ID: 2, Name: 'B', Date: new Date() }
        ];
    }

    private setupGridsConfiguration(): void {
        this.grid2.sortingExpressions = [];
        this.grid3.sortingExpressions = [{
            fieldName: 'ProductID',
            dir: SortingDirection.Desc,
            ignoreCase: true,
            strategy: DefaultSortingStrategy.instance()
        }];
    }

    private setupRemoteUrlBuilder(): void {
        this.localService.url = this.remoteService.url;
        this.remoteService.urlBuilder = (dataState) => {
            const parts: string[] = [];
            
            if (dataState?.paging) {
                const skip = dataState.paging.index * dataState.paging.recordsPerPage;
                parts.push(`$skip=${skip}&$top=${dataState.paging.recordsPerPage}&$count=true`);
            }

            if (dataState?.sorting?.expressions?.length) {
                const orderBy = dataState.sorting.expressions
                    .map(e => `${e.fieldName} ${e.dir === SortingDirection.Asc ? 'asc' : 'desc'}`)
                    .join(',');
                parts.push(`$orderby=${orderBy}`);
            }

            return `${this.remoteService.url}${parts.length ? '?' + parts.join('&') : ''}`;
        };
    }

    public onInlineEdit(event: IGridEditEventArgs): void {
        this.editCell = {
            columnField: event.column?.field ?? '',
            rowIndex: event.rowID
        };
    }

    public isCellEditing(index: number, field: string): boolean {
        return this.editCell?.columnField === field && this.editCell?.rowIndex === index;
    }

    public processRemoteData(): void {
        this.toast.positionSettings.verticalDirection = VerticalAlignment.Bottom;
        this.toast.open('Loading remote data');
        this.remoteService.getData(this.grid3.data, () => this.toast.close());
    }

    public onPagination(page: number): void {
        if ((this.perPage * page) < this.grid2.data.length) {
            this.grid2.paginator.paginate(page);
        }
    }

    public addRow(): void {
        if (!this.newRecordName.trim()) return;

        const nextId = this.grid1.data.length > 0 
            ? this.grid1.data[this.grid1.data.length - 1].ID + 1 
            : 1;

        this.grid1.addRow({ ID: nextId, Name: this.newRecordName });
        this.newRecordName = '';
    }

    public deleteSelectedRow(): void {
        const cell = this.selectedCell?.cell;
        if (cell) {
            const row = cell.row;
            this.selectedRowData = { record: { ...row.data } }; // Backup para restore
            row.delete();
            this.snax.open(`Row with ID ${row.index} was deleted`);
            this.selectedCell = undefined;
        }
    }

    public exportGrid(filterQueso = false): void {
        const options = this.getOptions(filterQueso ? 'Queso Report' : 'Report');
        options.ignoreColumnsVisibility = false;

        if (filterQueso) {
            this.grid3.filter('ProductName', 'Queso', IgxStringFilteringOperand.instance().condition('contains'), true);
            options.ignoreFiltering = false;
        }

        this.getExporterService().export(this.grid3, options);
    }

    private getExporterService(): IgxBaseExporter {
        return this.exportFormat === 'XLSX' ? this.excelExporter : this.csvExporter;
    }

    private getOptions(fileName: string): IgxExporterOptionsBase {
        if (this.exportFormat === 'XLSX') return new IgxExcelExporterOptions(fileName);
        
        const typeMap = {
            'CSV': CsvFileTypes.CSV,
            'TSV': CsvFileTypes.TSV,
            'TAB': CsvFileTypes.TAB
        };
        return new IgxCsvExporterOptions(fileName, typeMap[this.exportFormat] || CsvFileTypes.CSV);
    }
}