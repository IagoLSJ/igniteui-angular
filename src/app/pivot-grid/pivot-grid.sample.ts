import { Component, HostBinding, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
    IgxPivotNumericAggregate,
    IgxPivotGridComponent,
    IPivotConfiguration,
    IPivotDimension,
    IComboSelectionChangingEventArgs,
    FilteringExpressionsTree,
    IgxStringFilteringOperand,
    PivotDimensionType,
    IgxExcelExporterService,
    IgxExcelExporterOptions,
    IgxButtonDirective,
    IgxButtonGroupComponent,
    IgxComboComponent,
    IgxPivotDataSelectorComponent,
    IgxPivotValueChipTemplateDirective,
    IPivotValue
} from 'igniteui-angular';
import { GridSize } from './types/grid-size.type';
import { PivotDataItem } from './models/pivot-data-item.model';
import { ORIG_DATA, DATA_2 } from './data/pivot-grid.data';
import { PivotConfigService } from './services/pivot-config.service';
import { PivotGridConfigFactory } from './config/pivot-grid.config';

@Component({
    providers: [PivotConfigService],
    selector: 'app-tree-grid-sample',
    styleUrls: ['pivot-grid.sample.scss'],
    templateUrl: 'pivot-grid.sample.html',
    imports: [IgxComboComponent, FormsModule, IgxButtonGroupComponent, IgxButtonDirective, IgxPivotGridComponent, IgxPivotValueChipTemplateDirective, IgxPivotDataSelectorComponent]
})
export class PivotGridSampleComponent {
    @HostBinding('style.--ig-size')
    protected get sizeStyle(): string {
        return this.size === 'superCompact' ? `var(--ig-size-small)` : `var(--ig-size-${this.size})`;
    }

    @ViewChild('grid1', { static: true }) public grid1: IgxPivotGridComponent;
    public size: GridSize = 'superCompact';

    public filterExpTree: FilteringExpressionsTree;
    public dimensions: IPivotDimension[];
    public selected: IPivotDimension[];
    public pivotConfigHierarchy: IPivotConfiguration;
    public origData: PivotDataItem[] = ORIG_DATA;
    public data2: PivotDataItem[] = DATA_2;

    constructor(
        private excelExportService: IgxExcelExporterService,
        private pivotConfigService: PivotConfigService
    ) {
        this.filterExpTree = PivotGridConfigFactory.createFilterExpTree();
        this.dimensions = PivotGridConfigFactory.createDimensions();
        this.selected = [this.dimensions[0], this.dimensions[1], this.dimensions[2]];
        this.pivotConfigHierarchy = PivotGridConfigFactory.createPivotConfig(this.filterExpTree);
    }

    public handleChange(event: IComboSelectionChangingEventArgs): void {
        const isColumnChange = this.pivotConfigService.handleDimensionChange(
            { added: event.added as IPivotDimension[], removed: event.removed as IPivotDimension[] },
            this.pivotConfigHierarchy
        );
        this.grid1.notifyDimensionChange(isColumnChange);
    }

    public dimensionChange(): void {
        this.selected = this.pivotConfigService.getEnabledDimensions(this.pivotConfigHierarchy);
    }

    public setDensity(density: GridSize): void {
        this.size = density;
    }

    public autoSizeRow(ind: number): void {
        if (this.pivotConfigHierarchy.rows && this.pivotConfigHierarchy.rows[ind]) {
            this.grid1.autoSizeRowDimension(this.pivotConfigHierarchy.rows[ind]);
        }
    }

    public setRowDimWidth(rowDimIndex: number, widthValue: string): void {
        if (this.pivotConfigHierarchy.rows && this.pivotConfigHierarchy.rows[rowDimIndex]) {
            const newPivotConfig = { ...this.pivotConfigHierarchy };
            newPivotConfig.rows = [...(this.pivotConfigHierarchy.rows || [])];
            newPivotConfig.rows[rowDimIndex] = { ...newPivotConfig.rows[rowDimIndex], width: widthValue };
            this.grid1.pivotConfiguration = newPivotConfig;
        }
    }

    public remove(): void {
        this.grid1.removeDimension({ memberName: 'test', enabled: true });
    }

    public toggle(): void {
        if (this.pivotConfigHierarchy.filters && this.pivotConfigHierarchy.filters.length > 0) {
            this.grid1.toggleDimension(this.pivotConfigHierarchy.filters[0]);
        }
    }

    public move(): void {
        this.grid1.moveDimension({ memberName: 'test', enabled: true }, PivotDimensionType.Filter, 0);
    }

    public insert(): void {
        this.grid1.insertDimensionAt({
            memberName: 'Country',
            displayName: 'Country',
            enabled: true
        }, PivotDimensionType.Filter, 0);
    }

    public removeVal(): void {
        const testValue: IPivotValue = {
            member: 'test',
            enabled: true,
            aggregate: {
                key: 'SUM',
                aggregator: IgxPivotNumericAggregate.sum,
                label: 'Sum'
            }
        };
        this.grid1.removeValue(testValue);
    }

    public toggleVal(): void {
        const testValue: IPivotValue = {
            member: 'test',
            enabled: true,
            aggregate: {
                key: 'SUM',
                aggregator: IgxPivotNumericAggregate.sum,
                label: 'Sum'
            }
        };
        this.grid1.toggleValue(testValue);
    }

    public moveVal(): void {
        const testValue: IPivotValue = {
            member: 'test',
            enabled: true,
            aggregate: {
                key: 'SUM',
                aggregator: IgxPivotNumericAggregate.sum,
                label: 'Sum'
            }
        };
        this.grid1.moveValue(testValue, 0);
    }

    public insertVal(): void {
        const testValue: IPivotValue = {
            member: 'test',
            enabled: true,
            aggregate: {
                key: 'SUM',
                aggregator: IgxPivotNumericAggregate.sum,
                label: 'Sum'
            }
        };
        this.grid1.insertValueAt(testValue, 0);
    }

    public filterDim(): void {
        if (this.pivotConfigHierarchy.columns && this.pivotConfigHierarchy.columns.length > 0) {
            const set = new Set<string>();
            set.add('New York');
            this.grid1.filterDimension(
                this.pivotConfigHierarchy.columns[0],
                set,
                IgxStringFilteringOperand.instance().condition('in')
            );
        }
    }

    public newConfig(): void {
        this.pivotConfigHierarchy = PivotGridConfigFactory.createNewConfig(this.filterExpTree);
    }

    public exportButtonHandler(): void {
        this.excelExportService.export(this.grid1, new IgxExcelExporterOptions('ExportedFile'));
    }
}
