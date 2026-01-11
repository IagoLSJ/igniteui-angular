import { Injectable } from '@angular/core';
import { GridSize } from '../types/grid-size.type';

@Injectable({
    providedIn: 'root'
})
export class GridDensityService {

    constructor() { }

    public toggleDensity(currentSize: GridSize): GridSize {
        switch (currentSize) {
            case 'large': return 'small';
            case 'small': return 'medium';
            case 'medium': return 'small';
            default: return 'large';
        }
    }
}

