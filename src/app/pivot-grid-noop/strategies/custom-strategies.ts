import { IPivotDimension, IPivotValue } from 'igniteui-angular';
import { NoopPivotDimensionsStrategy } from 'igniteui-angular';

export class MyRowStrategy extends NoopPivotDimensionsStrategy {
    public override process<T>(collection: T[], _dimensions: IPivotDimension[], _values: IPivotValue[]): T[] {
        return collection;
    }
}

export class MyColumnStrategy extends NoopPivotDimensionsStrategy {
    public override process<T>(collection: T[], _dimensions: IPivotDimension[], _values: IPivotValue[]): T[] {
        return collection;
    }
}

