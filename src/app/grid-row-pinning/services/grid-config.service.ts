import { Injectable } from '@angular/core';
import { IGridColumn } from '../models/grid-column.model';
import { IGridOptions } from '../models/grid-options.model';
import { GridSelectionMode } from 'igniteui-angular';

@Injectable({
    providedIn: 'root'
})
export class GridConfigService {

    constructor() { }

    public getDefaultColumns(): IGridColumn[] {
        return [
            { field: 'ID', width: '200px', hidden: true },
            { field: 'CompanyName', width: '200px', groupable: true },
            { field: 'ContactName', width: '200px', pinned: false, groupable: true },
            { field: 'ContactTitle', width: '300px', pinned: false, groupable: true },
            { field: 'Address', width: '250px' },
            { field: 'City', width: '200px' },
            { field: 'Region', width: '300px' },
            { field: 'PostalCode', width: '150px' },
            { field: 'Phone', width: '200px' },
            { field: 'Fax', width: '200px' }
        ];
    }

    public getHierarchicalColumns(): IGridColumn[] {
        return [
            { field: 'ID', width: '200px' },
            { field: 'ChildLevels', width: '200px' },
            { field: 'ProductName', width: '200px' },
            { field: 'Col1', width: '200px' },
            { field: 'Col2', width: '200px' },
            { field: 'Col3', width: '200px' },
            { field: 'childData', width: '200px' },
            { field: 'childData2', width: '200px' },
            { field: 'hasChild', width: '200px' }
        ];
    }

    public getTreeColumns(): IGridColumn[] {
        return [
            { field: 'employeeID', label: 'ID', width: '200px', resizable: true, dataType: 'number', hasSummary: false },
            { field: 'Salary', label: 'Salary', width: '200px', resizable: true, dataType: 'number', hasSummary: true },
            { field: 'firstName', label: 'First Name', width: '300px', resizable: true, dataType: 'string', hasSummary: false },
            { field: 'lastName', label: 'Last Name', width: '150px', resizable: true, dataType: 'string', hasSummary: false },
            { field: 'Title', label: 'Title', width: '200px', resizable: true, dataType: 'string', hasSummary: true }
        ];
    }

    public getDefaultOptions(): IGridOptions {
        return {
            cellSelection: true,
            rowSelection: true,
            filtering: true,
            advancedFiltering: true,
            paging: true,
            sorting: true,
            groupBy: true,
            columns: false,
            rowPinning: true,
            pinningConfig: true
        };
    }

    public getDefaultSelectionMode(): GridSelectionMode {
        return GridSelectionMode.multiple;
    }
}

