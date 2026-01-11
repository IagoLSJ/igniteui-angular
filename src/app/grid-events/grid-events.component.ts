import { Component, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
    IgxGridComponent,
    ISortingExpression, IPinColumnEventArgs,
    IColumnResizeEventArgs, IColumnSelectionEventArgs, IPageEventArgs, ISortingEventArgs,
    IFilteringEventArgs, IgxStringFilteringOperand, IColumnMovingEndEventArgs,
    IColumnMovingEventArgs, IColumnMovingStartEventArgs, IPinColumnCancellableEventArgs,
    IColumnVisibilityChangingEventArgs,
    IFilteringExpressionsTree,
    IColumnVisibilityChangedEventArgs,
    IgxSwitchComponent,
    IgxInputGroupComponent,
    IgxInputDirective,
    IgxGridToolbarComponent,
    IgxGridToolbarActionsComponent,
    IgxGridToolbarHidingComponent,
    IgxGridToolbarPinningComponent,
    IgxGridToolbarAdvancedFilteringComponent,
    IgxColumnComponent,
    IgxPaginatorComponent,
    IgxButtonDirective,
    IgxIconComponent
} from 'igniteui-angular';
import { data } from '../shared/data';

@Component({
    selector: 'app-grid-events',
    styleUrls: ['grid-events.component.scss'],
    templateUrl: 'grid-events.component.html',
    imports: [CommonModule, IgxSwitchComponent, IgxInputGroupComponent, IgxInputDirective, IgxGridComponent, IgxGridToolbarComponent, IgxGridToolbarActionsComponent, IgxGridToolbarHidingComponent, IgxGridToolbarPinningComponent, IgxGridToolbarAdvancedFilteringComponent, IgxColumnComponent, IgxPaginatorComponent, IgxButtonDirective, IgxIconComponent]
})
export class GridEventsComponent {

    @ViewChild('grid1', { read: IgxGridComponent, static: true }) public grid: IgxGridComponent;

    public $sorting = false;
    public $filtering = false;
    public $paging = false;
    public $pinning = false;
    public $resizing = false;
    public $columnSelectionChanging = false;
    public $hiding = false;
    public $moving = false;
    public localData: any[];
    public eventLogs: string[] = [];

    constructor() {
        this.localData = data;
    }

    public filter(term) {
        this.grid.filter('ProductName', term, IgxStringFilteringOperand.instance().condition('contains'));
    }

    public columnMovingStart(event: IColumnMovingStartEventArgs) {
        console.log('event' + event);
        this.logAnEvent('=> columnMovingStart');
    }
    public columnMoving(event: IColumnMovingEventArgs) {
        event.cancel = this.$moving;
        this.logAnEvent(event.cancel ? '=> columnMoving cancelled' : '=> columnMoving');
    }
    public columnMovingEnd(event: IColumnMovingEndEventArgs) {
        console.log('event' + event);
        this.logAnEvent('=> columnMovingEnd');
    }

    public onSorting(event: ISortingEventArgs) {
        event.cancel = this.$sorting;
        this.logAnEvent('=> sorting', event.cancel);
    }
    public sortingDone(event: ISortingExpression | ISortingExpression []) {
        console.log('event' + event);
        this.logAnEvent(`=> sortingDone`);
    }

    public onFiltering(event: IFilteringEventArgs) {
        event.cancel = this.$filtering;
        this.logAnEvent('=> filtering', event.cancel);
    }
    public filteringDone(event: IFilteringExpressionsTree) {
        console.log('event' + event);
        this.logAnEvent(`=> filteringDone`);
    }
    public pagingDone(event: IPageEventArgs) {
        console.log('event' + event);
        this.logAnEvent(`=> pagingDone`);
    }

    public columnPin(event: IPinColumnCancellableEventArgs) {
        event.cancel = this.$pinning;
        this.logAnEvent('=> columnPin', event.cancel);
    }
    public columnPinned(event: IPinColumnEventArgs) {
        console.log('event' + event);
        this.logAnEvent(`=> columnPinned`);
    }

    public columnVisibilityChanging(event: IColumnVisibilityChangingEventArgs ) {
        event.cancel = this.$hiding;
        this.logAnEvent('=> columnVisibilityChanging', event.cancel);
    }
    public columnVisibilityChanged(event: IColumnVisibilityChangedEventArgs) {
        console.log('event' + event);
        this.logAnEvent(`=> columnVisibilityChanged`);
    }

    public columnResized(event: IColumnResizeEventArgs) {
        console.log('event' + event);
        this.logAnEvent(`=> columnResized`);
    }

    public columnSelectionChanging(event: IColumnSelectionEventArgs) {
        event.cancel = this.$columnSelectionChanging;
        this.logAnEvent('=> columnSelectionChanging', event.cancel);
    }

    public clearLog() {
        this.eventLogs = [];
    }

    private logAnEvent(msg: string, cancelled?: boolean) {
        if (cancelled) {
            msg = msg.concat(': cancelled ');
        }
        this.eventLogs.unshift(msg);
    }
}

