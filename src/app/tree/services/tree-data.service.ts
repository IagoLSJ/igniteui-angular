import { Injectable } from '@angular/core';
import { ChangeDetectorRef } from '@angular/core';
import { IgxTreeNodeComponent, IgxTreeComponent } from 'igniteui-angular';
import { Subject } from 'rxjs';
import { CompanyData } from '../models/company-data.model';
import { generateHierarchicalData } from '../utils/hierarchical-data-generator.util';
import { TreeDataHelper } from '../utils/tree-data.helper';

@Injectable()
export class TreeDataService {
    private iteration = 0;
    private addedIndex = 0;

    constructor(private cdr: ChangeDetectorRef) {}

    public setDummy(): CompanyData[] {
        return generateHierarchicalData('ChildCompanies', 3, 6, 0);
    }

    public addDataChild(tree: IgxTreeComponent, key: string): void {
        const targetNode = TreeDataHelper.getNodeByName(tree, key);
        if (!targetNode.data.ChildCompanies) {
            targetNode.data.ChildCompanies = [];
        }
        const data = targetNode.data.ChildCompanies;
        data.push(Object.assign({}, data[data.length - 1],
            { CompanyName: `Added ${this.addedIndex++}`, selected: this.addedIndex % 2 === 0, ChildCompanies: [] }));
        this.cdr.detectChanges();
    }

    public deleteLastChild(tree: IgxTreeComponent, key: string): void {
        const targetNode = TreeDataHelper.getNodeByName(tree, key);
        if (!targetNode.data.ChildCompanies) {
            targetNode.data.ChildCompanies = [];
        }
        const data = targetNode.data.ChildCompanies;
        data.splice(data.length - 1, 1);
    }

    public deleteNodesFromParent(tree: IgxTreeComponent, key: string, deleteNodes: string): void {
        const parent = TreeDataHelper.getNodeByName(tree, key);
        const nodeIds = deleteNodes.split(';');
        nodeIds.forEach((nodeId) => {
            const index = parent.data.ChildCompanies.findIndex(e => e.ID === nodeId);
            parent.data.ChildCompanies.splice(index, 1);
        });
    }

    public addSeveralNodes(tree: IgxTreeComponent, key: string): void {
        const targetNode = TreeDataHelper.getNodeByName(tree, key);
        if (!targetNode.data.ChildCompanies) {
            targetNode.data.ChildCompanies = [];
        }
        const arr: CompanyData[] = [{
            ID: 'Some1',
            CompanyName: 'Test 1',
            selected: false,
            ChildCompanies: [{
                ID: 'Some4',
                CompanyName: 'Test 5',
                selected: true,
            }]
        },
        {
            ID: 'Some2',
            CompanyName: 'Test 2',
            selected: false
        },
        {
            ID: 'Some3',
            CompanyName: 'Test 3',
            selected: false
        }];
        TreeDataHelper.getNodeByName(tree, key).data.ChildCompanies = arr;
        this.cdr.detectChanges();
    }

    public handleRemote(node: IgxTreeNodeComponent<CompanyData>, event: boolean, asyncItems: Subject<CompanyData[]>, loadDuration: number): void {
        console.log(event);
        node.loading = true;
        setTimeout(() => {
            const newData: CompanyData[] = [];
            for (let i = 0; i < 10; i++) {
                newData.push({
                    ID: `Remote ${i}`,
                    CompanyName: `Remote ${i}`
                });
            }
            node.loading = false;
            asyncItems.next(newData);
        }, loadDuration);
    }

    public addItem(data: CompanyData[]): CompanyData[] {
        const newArray = [...data];
        const children = Math.floor(Math.random() * 4);

        const createChildren = (count: number): CompanyData[] => {
            const array: CompanyData[] = [];
            for (let i = 0; i < count; i++) {
                this.iteration++;
                array.push({
                    ID: `TEST${this.iteration}`,
                    CompanyName: `TEST${this.iteration}`
                });
            }
            return array;
        };

        this.iteration++;
        newArray.push({
            ID: `TEST${this.iteration}`,
            CompanyName: `TEST${this.iteration}`,
            ChildCompanies: createChildren(children)
        });
        return newArray;
    }

    public resetData(initData: CompanyData[]): CompanyData[] {
        return [...initData];
    }
}
