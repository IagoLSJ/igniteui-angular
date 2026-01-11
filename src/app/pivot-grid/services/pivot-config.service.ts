import { Injectable } from '@angular/core';
import { IPivotConfiguration, IPivotDimension } from 'igniteui-angular';

@Injectable()
export class PivotConfigService {
    public handleDimensionChange(
        event: { added: IPivotDimension[]; removed: IPivotDimension[] },
        pivotConfig: IPivotConfiguration
    ): boolean {
        let isColumnChange = false;
        const allDims = [
            ...(pivotConfig.rows || []),
            ...(pivotConfig.columns || []),
            ...(pivotConfig.filters || [])
        ];

        if (event.added.length > 0) {
            const dim = allDims.find((x: IPivotDimension | null) => x && x.memberName === event.added[0].memberName);
            isColumnChange = dim !== undefined && (pivotConfig.columns || []).indexOf(dim) !== -1;
            if (dim) {
                dim.enabled = true;
            } else {
                if (!pivotConfig.rows) {
                    pivotConfig.rows = [];
                }
                pivotConfig.rows = pivotConfig.rows.concat(event.added);
            }
        } else if (event.removed.length > 0) {
            const dims = allDims.filter((x: IPivotDimension | null) => x && event.removed.indexOf(x) !== -1);
            dims.forEach((x: IPivotDimension) => x.enabled = false);
            isColumnChange = dims.some((x: IPivotDimension) => (pivotConfig.columns || []).indexOf(x) !== -1);
        }

        return isColumnChange;
    }

    public getEnabledDimensions(pivotConfig: IPivotConfiguration): IPivotDimension[] {
        const allDims = [
            ...(pivotConfig.rows || []),
            ...(pivotConfig.columns || []),
            ...(pivotConfig.filters || [])
        ];
        return allDims.filter((x: IPivotDimension | null) => x && x.enabled);
    }
}

