import { Injectable } from '@angular/core';
import { ChangeDetectorRef } from '@angular/core';
import { IgxTreeComponent } from 'igniteui-angular';

@Injectable()
export class TreeSelectionService {
    constructor(private cdr: ChangeDetectorRef) {}

    public selectSpecific(tree: IgxTreeComponent): void {
        tree.nodes.toArray()[0].selected = true;
        tree.nodes.toArray()[14].selected = true;
        tree.nodes.toArray()[1].selected = true;
        tree.nodes.toArray()[4].selected = true;
    }

    public selectAll(tree: IgxTreeComponent): void {
        tree.nodes.toArray().forEach(node => node.selected = true);
    }

    public deselectSpecific(tree: IgxTreeComponent): void {
        const arr = [
            tree.nodes.toArray()[0],
            tree.nodes.toArray()[14],
            tree.nodes.toArray()[1],
            tree.nodes.toArray()[4]
        ];
        tree.deselectAll(arr);
    }

    public deselectAll(tree: IgxTreeComponent): void {
        tree.deselectAll();
    }

    public changeNodeSelectionState(tree: IgxTreeComponent): void {
        tree.nodes.toArray()[8].selected = !tree.nodes.toArray()[8].selected;
    }

    public changeNodeData(tree: IgxTreeComponent): void {
        tree.nodes.toArray()[8].data.selected = !tree.nodes.toArray()[8].data.selected;
        this.cdr.detectChanges();
    }
}
