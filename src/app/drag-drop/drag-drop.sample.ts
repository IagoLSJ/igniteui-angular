import { ChangeDetectorRef, Component, ViewChild, ViewChildren, QueryList } from '@angular/core';
import { NgClass, NgStyle } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { ShadowGridSampleComponent } from './shadow-dom-grid/shadow-grid-sample';
import { DragDirection, GlobalPositionStrategy, IDragBaseEventArgs, IDragStartEventArgs, IDropDroppedEventArgs, IgxButtonDirective, IgxDragDirective, IgxDragHandleDirective, IgxDragIgnoreDirective, IgxDragLocation, IgxDropDirective, IgxIconComponent, IgxInputDirective, IgxInputGroupComponent, IgxInsertDropStrategy, IgxLabelDirective, IgxPrefixDirective, IgxRippleDirective, IgxToggleDirective, NoOpScrollStrategy, OverlaySettings } from 'igniteui-angular';

@Component({
    selector: 'app-drag-drop-sample',
    templateUrl: './drag-drop.sample.html',
    styleUrls: ['drag-drop.sample.scss'],
    imports: [
        NgStyle, NgClass, FormsModule,
        IgxDragDirective, IgxDragIgnoreDirective, IgxDragHandleDirective, IgxDropDirective,
        IgxIconComponent, IgxButtonDirective, IgxRippleDirective, IgxToggleDirective,
        IgxInputGroupComponent, IgxPrefixDirective, IgxInputDirective, IgxLabelDirective,
        ShadowGridSampleComponent
    ]
})
export class DragDropSampleComponent {
    @ViewChild('dragNoGhostAnim', { read: IgxDragDirective, static: true })
    public dragNoGhostAnim: IgxDragDirective;

    @ViewChild('dragGhostAnim', { read: IgxDragDirective, static: true })
    public dragGhostAnim: IgxDragDirective;

    @ViewChild('dragGhostAnimHost', { read: IgxDragDirective, static: true })
    public dragGhostAnimHost: IgxDragDirective;

    public animationDuration: number | string = '';
    public animationDelay: number | string = '';
    public animationFunction: string = '';
    public startX: number | string = '';
    public startY: number | string = '';
    public endX: number | string = 500;
    public endY: number | string = 500;

    @ViewChild('toggleForm', { static: true })
    public toggleForm: IgxToggleDirective;

    @ViewChild('toggleForm', { read: IgxDragDirective, static: true })
    public toggleFormDrag: IgxDragDirective;

    @ViewChild('toggleForm1', { static: true })
    public toggleForm1: IgxToggleDirective;

    @ViewChild('toggleForm', { read: IgxDragDirective, static: true })
    public toggleFormDrag1: IgxDragDirective;

    @ViewChildren('listItem', { read: IgxDragDirective })
    public listNotesDirs: QueryList<IgxDragDirective>;

    public dragDir = DragDirection.BOTH;
    public dropStrategy = IgxInsertDropStrategy;
    public draggedElem = false;
    public customDragged = false;
    public customDraggedScroll = false;
    public customDraggedAnim = false;
    public customDraggedAnimScroll = false;
    public customDraggedAnimXY = false;
    public customDraggedAnimHostXY = false;
    public ghostInDropArea = false;
    public friendlyArea = true;
    public draggingElem = false;
    public dragEnteredArea = false;
    public categoriesNotes = [
        { text: 'Action', dragged: false },
        { text: 'Fantasy', dragged: false },
        { text: 'Drama', dragged: false }
    ];
    public listNotes = [
        { text: 'Avengers: Endgame', category: 'Action', dragged: false },
        { text: 'Avatar', category: 'Fantasy', dragged: false },
        { text: 'Titanic', category: 'Drama', dragged: false },
        { text: 'Star Wars: The Force Awakens', category: 'Fantasy', dragged: false },
        { text: 'Avengers: Infinity War', category: 'Action', dragged: false },
        { text: 'Jurassic World', category: 'Fantasy', dragged: false },
        { text: 'The Avengers', category: 'Action', dragged: false }
    ];
    public listObserver = null;
    public draggableElems: {value: string; hide?: boolean}[] = [
        { value: 'Suspect 1' },
        { value: 'Suspect 2' },
        { value: 'Suspect 3' },
        { value: 'Suspect 4' }];

    public toggleStartPageX;
    public toggleStartPageY;

    // Multi selection row drag
    public sourceRows: any[] = Array.from(Array(10)).map((_e, i) => {
        return {name: "Item " + i, selected: false}
    });
    public targetRows: any[] = [];
    public selectedRows: any[] = [];

    /** List drag properties */
    public draggedDir = null;
    public draggedIndex = null;
    public get newDraggedIndex() {
        if (this.draggedIndex === null) {
            return null;
        }

        const listNotesDirsArray = this.listNotesDirs.toArray();
        let firstMovedIndex = null;
        let lastMovedIndex = null;

        for (let i = 0; i < listNotesDirsArray.length; i++) {
            if (firstMovedIndex === null && listNotesDirsArray[i].data.moved) {
                firstMovedIndex = i;
            }
            if (listNotesDirsArray[i].data.moved) {
                lastMovedIndex = i;
            }
        }

        if (firstMovedIndex === null && lastMovedIndex === null) {
            return null;
        }
        return this.draggedIndex < firstMovedIndex ? lastMovedIndex : firstMovedIndex ;
    }

    private overlaySettings: OverlaySettings = {
        positionStrategy: new GlobalPositionStrategy(),
        scrollStrategy: new NoOpScrollStrategy(),
        modal: false,
        closeOnOutsideClick: true
    };

    constructor(private cdr: ChangeDetectorRef) {
    }

    public onDragStart() {
        this.draggingElem = true;
        this.cdr.detectChanges();
    }

    public onDragCageEnter() {
        this.dragEnteredArea = true;
    }

    public onDragCageLeave() {
        this.dragEnteredArea = false;
    }

    public onDragEnd(event: IDragBaseEventArgs) {
        this.draggingElem = false;
        this.cdr.detectChanges();
        event.owner.transitionToOrigin();
    }

    public enterCustomOutside(event) {
        if (event.drag.data.id === 'customGhost') {
            this.ghostInDropArea = true;
            this.friendlyArea = true;
        }
    }

    public enterCustomCage(event) {
        if (event.drag.data.id === 'customGhost') {
            this.ghostInDropArea = true;
            this.friendlyArea = false;
        }
    }

    public leaveCustom(event) {
        if (event.drag.data.id === 'customGhost') {
            this.ghostInDropArea = false;
        }
    }

    public openDialog() {
        this.toggleForm.open(this.overlaySettings);

        if (!this.toggleStartPageX && !this.toggleStartPageY) {
            this.toggleStartPageX = this.toggleFormDrag.pageX;
            this.toggleStartPageY = this.toggleFormDrag.pageY;
        }
        this.toggleFormDrag.setLocation(new IgxDragLocation(this.toggleStartPageX, this.toggleStartPageY));
    }

    public openOverlappingDialog() {
        const overlaySettings: OverlaySettings = {
            positionStrategy: new GlobalPositionStrategy(),
            scrollStrategy: new NoOpScrollStrategy(),
            modal: false,
            closeOnOutsideClick: false
        };
        this.toggleForm1.open(overlaySettings);

        if (!this.toggleStartPageX && !this.toggleStartPageY) {
            this.toggleStartPageX = this.toggleFormDrag.pageX;
            this.toggleStartPageY = this.toggleFormDrag.pageY;
        }
        this.toggleFormDrag.setLocation(new IgxDragLocation(this.toggleStartPageX, this.toggleStartPageY));
    }

    public toOriginNoGhost() {
        const startX = this.startX;
        const startY = this.startY;
        const startLocation: IgxDragLocation = startX && startY ? new IgxDragLocation(Number(startX), Number(startY)) : null ;
        this.dragNoGhostAnim.transitionToOrigin({
            duration: Number(this.animationDuration) || undefined,
            timingFunction: this.animationFunction || undefined,
            delay: Number(this.animationDelay) || undefined
        }, startLocation);
    }

    public toLocationNoGhost() {
        const startX = this.startX;
        const startY = this.startY;
        const startLocation: IgxDragLocation = startX && startY ? new IgxDragLocation(Number(startX), Number(startY)) : null ;

        const endX = this.endX;
        const endY = this.endY;
        const endLocation: IgxDragLocation = endX && endY ? new IgxDragLocation(Number(endX), Number(endY)) : null;

        this.dragNoGhostAnim.transitionTo(
            endLocation,
            {
                duration: Number(this.animationDuration) || undefined,
                timingFunction: this.animationFunction || undefined,
                delay: Number(this.animationDelay) || undefined
            },
             startLocation
        );
    }

    public dragGhostAnimOrigin(event) {
        event.owner.transitionToOrigin({
            duration: Number(this.animationDuration) || undefined,
            timingFunction: this.animationFunction || undefined,
            delay: Number(this.animationDelay) || undefined
        });
    }

    public dragGhostAnimXY() {

    }

    public toOriginGhost() {
        this.toOriginGhostImpl(this.dragGhostAnim);
    }

    public toLocationGhost() {
        this.toLocationGhostImpl(this.dragGhostAnim);
    }

    public toOriginGhostWithHost() {
        this.toOriginGhostImpl(this.dragGhostAnimHost);
    }

    public toLocationGhostWithHost() {
        this.toLocationGhostImpl(this.dragGhostAnimHost);
    }

    public toOriginGhostImpl(dragElem: IgxDragDirective) {
        const startX = this.startX;
        const startY = this.startY;
        const startLocation: IgxDragLocation = startX && startY ? new IgxDragLocation(Number(startX), Number(startY)) : null ;
        dragElem.transitionToOrigin({
            duration: Number(this.animationDuration) || undefined,
            timingFunction: this.animationFunction || undefined,
            delay: Number(this.animationDelay) || undefined
        }, startLocation);
    }

    public toLocationGhostImpl(dragElem: IgxDragDirective) {
        const startX = this.startX;
        const startY = this.startY;
        const startLocation: IgxDragLocation = startX && startY ? new IgxDragLocation(Number(startX), Number(startY)) : null ;

        const endX = this.endX;
        const endY = this.endY;
        const endLocation: IgxDragLocation = endX && endY ? new IgxDragLocation(Number(endX), Number(endY)) : null;

        dragElem.transitionTo(
            endLocation,
            {
                duration: Number(this.animationDuration) || undefined,
                timingFunction: this.animationFunction || undefined,
                delay: Number(this.animationDelay) || undefined
            },
             startLocation
        );
    }

    public listItemDragStart(event, item, dragIndex) {
        item.dragged = true;
        this.draggedIndex = dragIndex;
        this.draggedDir = event.owner;
    }

    public listItemDragEnd(event: IDragBaseEventArgs, item) {
        if (this.newDraggedIndex !== null) {
            const moveDown = this.newDraggedIndex > this.draggedIndex;
            const prefix = moveDown ? 1 : -1;

            item.dragged = true;
            const originLocation = event.owner.originLocation;
            event.owner.transitionTo(new IgxDragLocation(
                originLocation.pageX,
                originLocation.pageY + prefix * Math.abs(this.newDraggedIndex - this.draggedIndex) * 68
            ), { duration: Number(this.animationDuration) || undefined });
        } else {
            event.owner.transitionToOrigin({ duration: Number(this.animationDuration) || undefined });
        }
    }

    public litsItemTransitioned(event, item, itemIndex) {
        if (itemIndex === this.draggedIndex && this.newDraggedIndex != null) {
            this.shiftElements(this.draggedIndex, this.newDraggedIndex);
            event.owner.setLocation(event.owner.originLocation);
            this.draggedIndex = null;
            this.draggedDir = null;
        }
        item.dragged = false;
    }

    private getItemHeight(itemIndex: number, listNotesDirsArray: IgxDragDirective[]): number {
        if (itemIndex < 0 || itemIndex >= listNotesDirsArray.length - 1) {
            return 68;
        }
        const currentItem = listNotesDirsArray[itemIndex];
        const nextItem = listNotesDirsArray[itemIndex + 1];
        const currentLocation = currentItem.originLocation;
        const nextLocation = nextItem.originLocation;
        const height = Math.abs(nextLocation.pageY - currentLocation.pageY);
        return height || 68;
    }

    public listItemEnter(_event, itemIndex) {
        const moveDown = this.draggedIndex < itemIndex;
        const listNotesDirsArray = this.listNotesDirs.toArray();

        if (moveDown && !listNotesDirsArray[itemIndex].data.moved) {
            const itemsToMove = listNotesDirsArray.slice(this.draggedIndex + 1, itemIndex + 1);
            itemsToMove.forEach((item, index) => {
                if (!item.data.moved) {
                    const currentLocation = item.location;
                    const previousItemHeight = this.getItemHeight(this.draggedIndex + index, listNotesDirsArray);
                    item.transitionTo(new IgxDragLocation(currentLocation.pageX, currentLocation.pageY - previousItemHeight),
                        { duration: Number(this.animationDuration) || undefined });
                    item.data.moved = true;
                }
            });

            const itemsAbove = listNotesDirsArray.slice(0, this.draggedIndex);
            itemsAbove.forEach((item) => {
                if (item.data.moved) {
                    item.transitionToOrigin({ duration: Number(this.animationDuration) || undefined });
                    item.data.moved = false;
                }
            });
        } else if (moveDown && listNotesDirsArray[itemIndex].data.moved) {
            const restBellow = listNotesDirsArray.slice(itemIndex);
            restBellow.forEach((item) => {
                if (item.data.moved) {
                    item.transitionToOrigin({ duration: Number(this.animationDuration) || undefined });
                    item.data.moved = false;
                }
            });
        } else if (!listNotesDirsArray[itemIndex].data.moved) {
            const itemsToMove = listNotesDirsArray.slice(itemIndex , this.draggedIndex);
            itemsToMove.forEach((item, index) => {
                if (!item.data.moved) {
                    const currentLocation = item.location;
                    const previousItemHeight = this.getItemHeight(itemIndex + index, listNotesDirsArray);
                    item.transitionTo(new IgxDragLocation(currentLocation.pageX, currentLocation.pageY + previousItemHeight),
                        { duration: Number(this.animationDuration) || undefined });
                    item.data.moved = true;
                }
            });

            const itemsBelow = listNotesDirsArray.slice(this.draggedIndex + 1);
            itemsBelow.forEach((item) => {
                if (item.data.moved) {
                    item.transitionToOrigin({ duration: Number(this.animationDuration) || undefined });
                    item.data.moved = false;
                }
            });
        } else {
            const restAbove = listNotesDirsArray.slice(0, itemIndex + 1);
            restAbove.forEach((item) => {
                if (item.data.moved) {
                    item.transitionToOrigin({ duration: Number(this.animationDuration) || undefined });
                    item.data.moved = false;
                }
            });
        }
    }

    public listItemOver(_event, itemIndex) {
        const moveDown = itemIndex > this.draggedIndex;
        const itemDragDir = this.listNotesDirs.toArray()[itemIndex];
        const listNotesDirsArray = this.listNotesDirs.toArray();

        if (itemDragDir.animInProgress) {
            return;
        }

        if (itemDragDir.data.moved) {
            itemDragDir.data.moved = false;
            itemDragDir.transitionToOrigin({ duration: Number(this.animationDuration) || undefined });
        } else {
            const currentLocation = itemDragDir.location;
            let nextLocation;
            if (moveDown) {
                const prevItemHeight = this.getItemHeight(itemIndex - 1, listNotesDirsArray);
                nextLocation = -1 * prevItemHeight;
            } else {
                const nextItemHeight = this.getItemHeight(itemIndex, listNotesDirsArray);
                nextLocation = nextItemHeight;
            }
            itemDragDir.transitionTo(new IgxDragLocation(currentLocation.pageX, currentLocation.pageY + nextLocation),
                { duration: Number(this.animationDuration) || undefined });
            itemDragDir.data.moved = true;
        }
    }

    public shiftElements(draggedIndex, targetIndex) {
        const movedElem = this.listNotes.splice(draggedIndex, 1);
        this.listNotes.splice(targetIndex, 0, movedElem[0]);

        this.listNotesDirs.forEach((dir) => {
            if (this.listNotes[targetIndex].text !== dir.data.id) {
                dir.setLocation(dir.originLocation);
                dir.data.moved = false;
            }
        });
    }

    public dragClick() {
        console.log('click');
    }

    public onDragMove(e) {
        const deltaX = e.nextPageX - e.pageX;
        const deltaY = e.nextPageY - e.pageY;
        e.cancel = true;
        this.toggleForm.setOffset(deltaX, deltaY);
      }

    public dropArea1Items: Array<{type: 'username' | 'password', id: string}> = [
        { type: 'username', id: 'username-1' },
        { type: 'password', id: 'password-1' }
    ];
    public dropArea2Items: Array<{type: 'username' | 'password', id: string}> = [];

    public onItemDropped(event: IDropDroppedEventArgs) {
        const draggedItem = event.drag.data?.item;
        if (draggedItem) {
            const dropAreaId = event.owner.data?.dropAreaId;
            const isFromArea1 = this.dropArea1Items.some(item => item.id === draggedItem.id);
            const isFromArea2 = this.dropArea2Items.some(item => item.id === draggedItem.id);
            
            if (dropAreaId === 'area2' && isFromArea1) {
                const index = this.dropArea1Items.findIndex(item => item.id === draggedItem.id);
                if (index >= 0) {
                    const item = this.dropArea1Items.splice(index, 1)[0];
                    this.dropArea2Items.push(item);
                }
            } else if (dropAreaId === 'area1' && isFromArea2) {
                const index = this.dropArea2Items.findIndex(item => item.id === draggedItem.id);
                if (index >= 0) {
                    const item = this.dropArea2Items.splice(index, 1)[0];
                    this.dropArea1Items.push(item);
                }
            }
        }
        event.cancel = true;
    }

    public getCategoryMovies(inCategory: string){
        return this.listNotes.filter(item => item.category === inCategory);
    }


    // Multi selection row drag
    public rowClicked(item: any): void {
        const index = this.sourceRows.findIndex((row) => row.name === item.name);
        if(index < 0) return;
        this.sourceRows[index].selected = !this.sourceRows[index].selected;
    }

    public dragStartHandler(_event: IDragStartEventArgs, item: any) {
        const dragItemId = item?.name;
        if(dragItemId !== undefined){
          const index = this.sourceRows.findIndex((row) => row.name === dragItemId);
          if(index >= 0) this.sourceRows[index].selected = true;
        }

        this.selectedRows = this.sourceRows.filter(row => row.selected).map((row) => {
            return {name: row.name, selected: false}
        });
    }

    public onSelectRowDropped() {
        if(this.selectedRows.length === 0) return;
        this.selectedRows.forEach(clickedCard => {
          const dragItemIndexInFromArray = this.sourceRows.findIndex((item) => item.name === clickedCard.name);
          this.sourceRows.splice(dragItemIndexInFromArray, 1);
        });
        this.targetRows.push(...this.selectedRows);
        console.log(this.targetRows);

        this.selectedRows = [];
    }
}
