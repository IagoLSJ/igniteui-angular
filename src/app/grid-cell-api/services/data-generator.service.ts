import { Injectable } from '@angular/core';
import { HierarchicalDataItem } from '../models/grid-data.model';

@Injectable()
export class DataGeneratorService {
    public generateDataUneven(count: number, level: number, parentID: string | null = null): HierarchicalDataItem[] {
        const prods: HierarchicalDataItem[] = [];
        const currLevel = level;
        let children: HierarchicalDataItem[] | undefined;

        for (let i = 0; i < count; i++) {
            const rowID = parentID ? parentID + i : i.toString();
            if (level > 0) {
                children = this.generateDataUneven(((i % 2) + 1) * Math.round(count / 3), currLevel - 1, rowID);
            }
            prods.push({
                ID: rowID,
                ChildLevels: currLevel,
                ProductName: 'Product: A' + i,
                Col1: i,
                Col2: i,
                Col3: i,
                childData: children,
                childData2: children,
                hasChild: true
            });
        }

        return prods;
    }

    public getIndices(indices: string): number[] {
        let normalizedIndices = indices;
        if (normalizedIndices.length === 1) {
            normalizedIndices = `0${normalizedIndices}`;
        }
        let nums: number[] = normalizedIndices.split('').map((n: string) => parseInt(n, 10));
        if (nums.length === 0) {
            nums = [0, 0];
        }
        return nums;
    }
}

