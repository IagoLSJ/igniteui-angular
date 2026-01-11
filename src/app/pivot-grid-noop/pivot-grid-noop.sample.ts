import { Component, ViewChild } from '@angular/core';
import {
    IGridState,
    IPivotConfiguration,
    IPivotUISettings,
    IgxButtonDirective,
    IgxGridStateDirective,
    IgxPivotGridComponent,
    NoopSortingStrategy,
    PivotRowLayoutType
} from 'igniteui-angular';
import { take } from 'rxjs/operators';
import { PivotGridNoopConfigFactory } from './config/pivot-grid-noop.config';
import { MOCK_DATA, DATA, MOCK_REMOTE_DATA_DIFFERENT_SEPARATOR } from './data/pivot-grid-noop.data';
import { GridStateService } from './services/grid-state.service';
import { PivotMockDataItem, PivotSimpleDataItem, PivotRemoteDataItem } from './models/pivot-mock-data.model';


@Component({
    providers: [GridStateService],
    selector: 'app-tree-grid-sample',
    styleUrls: ['pivot-grid-noop.sample.scss'],
    templateUrl: 'pivot-grid-noop.sample.html',
    imports: [IgxPivotGridComponent, IgxGridStateDirective, IgxButtonDirective]
})
export class PivotGridNoopSampleComponent {
    @ViewChild('grid1', { static: true }) public grid1: IgxPivotGridComponent;
    @ViewChild(IgxGridStateDirective, { static: true })
    public state!: IgxGridStateDirective;

    public myStrategy = NoopSortingStrategy.instance();
    public myState: IGridState;
    public pivotUI: IPivotUISettings = {
        showConfiguration: true,
        showRowHeaders: true,
        rowLayout: PivotRowLayoutType.Horizontal
    };

    public pivotConfigHierarchy: IPivotConfiguration = PivotGridNoopConfigFactory.createPivotConfigHierarchy();
    public mockData: PivotMockDataItem[] = MOCK_DATA;
    public configDifferentSeparator: IPivotConfiguration = PivotGridNoopConfigFactory.createConfigDifferentSeparator();
    public mockRemoteDataDifferentSeparator: PivotRemoteDataItem[] = MOCK_REMOTE_DATA_DIFFERENT_SEPARATOR;
    public data: PivotSimpleDataItem[] = DATA;

    constructor(private gridStateService: GridStateService) {}

    public saveState(): void {
        const state = this.state.getState() as string;
        this.myState = this.state.getState(false) as IGridState;
        this.gridStateService.saveState(state, this.myState);
    }

    public restoreState(): void {
        const state = this.gridStateService.getStateFromStorage();
        if (state) {
            this.state.stateParsed.pipe(take(1)).subscribe((parsedState: IGridState) => {
                this.gridStateService.applyNoopStrategiesToState(parsedState);
            });
            this.state.setState(state);
        }
    }

    public restoreStateFromObject(): void {
        if (this.myState) {
            this.gridStateService.applyNoopStrategiesToState(this.myState);
            this.state.setState(this.myState);
        }
    }
}
