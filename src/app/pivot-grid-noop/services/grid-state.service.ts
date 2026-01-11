import { Injectable } from '@angular/core';
import { IGridState, ISortingExpression } from 'igniteui-angular';
import { NoopSortingStrategy, NoopPivotDimensionsStrategy } from 'igniteui-angular';

@Injectable()
export class GridStateService {
    private readonly STORAGE_KEY = 'grid-state';

    public saveState(stateString: string, _stateObject: IGridState): void {
        window.sessionStorage.setItem(this.STORAGE_KEY, stateString);
    }

    public getStateFromStorage(): string | null {
        return window.sessionStorage.getItem(this.STORAGE_KEY);
    }

    public applyNoopStrategiesToState(state: IGridState): void {
        if (state.sorting) {
            state.sorting.forEach((expression: ISortingExpression) => {
                expression.strategy = NoopSortingStrategy.instance();
            });
        }
        if (state.pivotConfiguration) {
            state.pivotConfiguration.rowStrategy = NoopPivotDimensionsStrategy.instance();
            state.pivotConfiguration.columnStrategy = NoopPivotDimensionsStrategy.instance();
        }
    }
}

