import { Injectable } from '@angular/core';
import { IgxGridStateDirective } from 'igniteui-angular';

@Injectable({
    providedIn: 'root'
})
export class GridStateService {
    private readonly STATE_KEY_PREFIX = 'grid-state-';

    constructor() { }

    public saveGridState(state: IgxGridStateDirective, gridId: string): void {
        const gridState = state.getState() as string;
        const key = this.getStateKey(gridId);
        window.localStorage.setItem(key, gridState);
    }

    public restoreGridState(state: IgxGridStateDirective, gridId: string): void {
        const key = this.getStateKey(gridId);
        const savedState = window.localStorage.getItem(key);
        if (savedState) {
            state.setState(savedState);
        }
    }

    public removeGridState(gridId: string): void {
        const key = this.getStateKey(gridId);
        window.localStorage.removeItem(key);
    }

    public hasGridState(gridId: string): boolean {
        const key = this.getStateKey(gridId);
        return window.localStorage.getItem(key) !== null;
    }

    private getStateKey(gridId: string): string {
        return `${this.STATE_KEY_PREFIX}${gridId}`;
    }
}