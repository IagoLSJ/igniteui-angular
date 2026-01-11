import {
    Component,
    ChangeDetectorRef,
    EventEmitter,
    ElementRef,
    HostBinding,
    HostListener,
    Input,
    Output,
    ViewChild,
    Renderer2,
    TemplateRef,
    OnDestroy,
    OnInit,
    inject,
    DOCUMENT
} from '@angular/core';
import { IgxDragDirective, IDragBaseEventArgs, IDragStartEventArgs, IDropBaseEventArgs, IDropDroppedEventArgs, IgxDropDirective } from 'igniteui-angular/directives';
import { IBaseEventArgs, ɵSize } from 'igniteui-angular/core';
import { ChipResourceStringsEN, IChipResourceStrings } from 'igniteui-angular/core';
import { Subject } from 'rxjs';
import { IgxIconComponent } from 'igniteui-angular/icon';
import { NgClass, NgTemplateOutlet } from '@angular/common';
import { getCurrentResourceStrings } from 'igniteui-angular/core';
import { IgxChipConfig } from './chip.config';

export const IgxChipTypeVariant = {
    PRIMARY: 'primary',
    INFO: 'info',
    SUCCESS: 'success',
    WARNING: 'warning',
    DANGER: 'danger'
} as const;
export type IgxChipTypeVariant = (typeof IgxChipTypeVariant)[keyof typeof IgxChipTypeVariant];

export interface IBaseChipEventArgs extends IBaseEventArgs {
    originalEvent: IDragBaseEventArgs | IDropBaseEventArgs | KeyboardEvent | MouseEvent | TouchEvent;
    owner: IgxChipComponent;
}

export interface IChipClickEventArgs extends IBaseChipEventArgs {
    cancel: boolean;
}

export interface IChipKeyDownEventArgs extends IBaseChipEventArgs {
    originalEvent: KeyboardEvent;
    cancel: boolean;
}

export interface IChipEnterDragAreaEventArgs extends IBaseChipEventArgs {
    dragChip: IgxChipComponent;
}

export interface IChipSelectEventArgs extends IBaseChipEventArgs {
    cancel: boolean;
    selected: boolean;
}

let CHIP_ID = 0;

/**
 * Chip is compact visual component that displays information in an obround.
 *
 * @igxModule IgxChipsModule
 *
 * @igxTheme igx-chip-theme
 *
 * @igxKeywords chip
 *
 * @igxGroup display
 *
 * @remarks
 * The Ignite UI Chip can be templated, deleted, and selected.
 * Multiple chips can be reordered and visually connected to each other.
 * Chips reside in a container called chips area which is responsible for managing the interactions between the chips.
 *
 * @example
 * ```html
 * <igx-chip class="chipStyle" [id]="901" [draggable]="true" [removable]="true" (remove)="chipRemoved($event)">
 *    <igx-avatar class="chip-avatar-resized" igxPrefix></igx-avatar>
 * </igx-chip>
 * ```
 */
@Component({
    selector: 'igx-chip',
    templateUrl: 'chip.component.html',
    imports: [IgxDropDirective, IgxDragDirective, NgClass, NgTemplateOutlet, IgxIconComponent]
})
export class IgxChipComponent implements OnInit, OnDestroy {
    public cdr = inject(ChangeDetectorRef);
    private ref = inject<ElementRef<HTMLElement>>(ElementRef);
    private renderer = inject(Renderer2);
    public document = inject(DOCUMENT);

    @Input()
    public config!: IgxChipConfig;

    private _defaultId: string | undefined;

    private get defaultConfig(): IgxChipConfig {
        if (!this._defaultId) {
            this._defaultId = `igx-chip-${CHIP_ID++}`;
        }
        return {
            id: this._defaultId,
            tabIndex: null,
            draggable: false,
            animateOnRelease: true,
            hideBaseOnDrag: true,
            removable: false,
            selectable: false,
            class: '',
            disabled: false,
            selected: false
        };
    }

    private get cfg(): IgxChipConfig {
        return this.config || this.defaultConfig;
    }
    @HostBinding('attr.id')
    public get id() {
        return this.cfg.id ?? this.defaultConfig.id!;
    }

    /**
     * Returns the `role` attribute of the chip.
     *
     * @example
     * ```typescript
     * let chipRole = this.chip.role;
     * ```
     */
    @HostBinding('attr.role')
    public role = 'option';

    @HostBinding('attr.tabIndex')
    public get tabIndex() {
        const configTabIndex = this.cfg.tabIndex;
        if (configTabIndex !== null && configTabIndex !== undefined) {
            this._tabIndex = configTabIndex;
        }
        if (this._tabIndex !== null && this._tabIndex !== undefined) {
            return this._tabIndex;
        }
        return !this.disabled ? 0 : null;
    }

    public get data() {
        return this.cfg.data;
    }

    public get draggable() {
        return this.cfg.draggable ?? false;
    }

    public get animateOnRelease() {
        return this.cfg.animateOnRelease ?? true;
    }

    public get hideBaseOnDrag() {
        return this.cfg.hideBaseOnDrag ?? true;
    }

    public get removable() {
        return this.cfg.removable ?? false;
    }

    public get removeIcon() {
        return this.cfg.removeIcon;
    }

    public get selectable() {
        return this.cfg.selectable ?? false;
    }

    public get selectIcon() {
        return this.cfg.selectIcon;
    }

    public get class() {
        return this.cfg.class ?? '';
    }

    @HostBinding('class.igx-chip--disabled')
    public get disabled() {
        return this.cfg.disabled ?? false;
    }

    @HostBinding('attr.aria-selected')
    public set selected(newValue: boolean) {
        if (this.config) {
            this.config.selected = newValue;
        }
        this.changeSelection(newValue);
    }

    /**
     * Returns if the `IgxChipComponent` is selected.
     *
     * @example
     * ```typescript
     * @ViewChild('myChip')
     * public chip: IgxChipComponent;
     * selectedChip(){
     *     let selectedChip = this.chip.selected;
     * }
     * ```
     */
    public get selected() {
        return this._selected;
    }

    /**
     * @hidden
     * @internal
     */
    @Output()
    public selectedChange = new EventEmitter<boolean>();

    public set color(newColor: string) {
        if (this.config) {
            this.config.color = newColor;
        }
        if (this.chipArea?.nativeElement) {
            this.chipArea.nativeElement.style.backgroundColor = newColor;
        }
    }

    /**
     * Returns the background color of the `IgxChipComponent`.
     *
     * @example
     * ```typescript
     * @ViewChild('myChip')
     * public chip: IgxChipComponent;
     * ngAfterViewInit(){
     *     let chipColor = this.chip.color;
     * }
     * ```
     */
    public get color() {
        return this.chipArea.nativeElement.style.backgroundColor;
    }

    public set resourceStrings(value: IChipResourceStrings) {
        if (this.config) {
            this.config.resourceStrings = value;
        }
        this._resourceStrings = Object.assign({}, this._resourceStrings, value);
    }

    /**
     * An accessor that returns the resource strings.
     */
    public get resourceStrings(): IChipResourceStrings {
        return this._resourceStrings;
    }

    /**
     * Emits an event when the `IgxChipComponent` moving starts.
     * Returns the moving `IgxChipComponent`.
     *
     * @example
     * ```html
     * <igx-chip #myChip [id]="'igx-chip-1'" [draggable]="true" (moveStart)="moveStarted($event)">
     * ```
     */
    @Output()
    public moveStart = new EventEmitter<IBaseChipEventArgs>();

    /**
     * Emits an event when the `IgxChipComponent` moving ends.
     * Returns the moved `IgxChipComponent`.
     *
     * @example
     * ```html
     * <igx-chip #myChip [id]="'igx-chip-1'" [draggable]="true" (moveEnd)="moveEnded($event)">
     * ```
     */
    @Output()
    public moveEnd = new EventEmitter<IBaseChipEventArgs>();

    /**
     * Emits an event when the `IgxChipComponent` is removed.
     * Returns the removed `IgxChipComponent`.
     *
     * @example
     * ```html
     * <igx-chip #myChip [id]="'igx-chip-1'" [draggable]="true" (remove)="remove($event)">
     * ```
     */
    @Output()
    public remove = new EventEmitter<IBaseChipEventArgs>();

    /**
     * Emits an event when the `IgxChipComponent` is clicked.
     * Returns the clicked `IgxChipComponent`, whether the event should be canceled.
     *
     * @example
     * ```html
     * <igx-chip #myChip [id]="'igx-chip-1'" [draggable]="true" (click)="chipClick($event)">
     * ```
     */
    @Output()
    public chipClick = new EventEmitter<IChipClickEventArgs>();

    /**
     * Emits event when the `IgxChipComponent` is selected/deselected.
     * Returns the selected chip reference, whether the event should be canceled, what is the next selection state and
     * when the event is triggered by interaction `originalEvent` is provided, otherwise `originalEvent` is `null`.
     *
     * @example
     * ```html
     * <igx-chip #myChip [id]="'igx-chip-1'" [selectable]="true" (selectedChanging)="chipSelect($event)">
     * ```
     */
    @Output()
    public selectedChanging = new EventEmitter<IChipSelectEventArgs>();

    /**
     * Emits event when the `IgxChipComponent` is selected/deselected and any related animations and transitions also end.
     *
     * @example
     * ```html
     * <igx-chip #myChip [id]="'igx-chip-1'" [selectable]="true" (selectedChanged)="chipSelectEnd($event)">
     * ```
     */
    @Output()
    public selectedChanged = new EventEmitter<IBaseChipEventArgs>();

    /**
     * Emits an event when the `IgxChipComponent` keyboard navigation is being used.
     * Returns the focused/selected `IgxChipComponent`, whether the event should be canceled,
     * if the `alt`, `shift` or `control` key is pressed and the pressed key name.
     *
     * @example
     * ```html
     * <igx-chip #myChip [id]="'igx-chip-1'" [draggable]="true" (keyDown)="chipKeyDown($event)">
     * ```
     */
    @Output()
    public keyDown = new EventEmitter<IChipKeyDownEventArgs>();

    /**
     * Emits an event when the `IgxChipComponent` has entered the `IgxChipsAreaComponent`.
     * Returns the target `IgxChipComponent`, the drag `IgxChipComponent`, as  well as
     * the original drop event arguments.
     *
     * @example
     * ```html
     * <igx-chip #myChip [id]="'igx-chip-1'" [draggable]="true" (dragEnter)="chipEnter($event)">
     * ```
     */
    @Output()
    public dragEnter = new EventEmitter<IChipEnterDragAreaEventArgs>();

    /**
     * Emits an event when the `IgxChipComponent` has left the `IgxChipsAreaComponent`.
     * Returns the target `IgxChipComponent`, the drag `IgxChipComponent`, as  well as
     * the original drop event arguments.
     *
     * @example
     * ```html
     * <igx-chip #myChip [id]="'igx-chip-1'" [draggable]="true" (dragLeave)="chipLeave($event)">
     * ```
     */
    @Output()
    public dragLeave = new EventEmitter<IChipEnterDragAreaEventArgs>();

    /**
     * Emits an event when the `IgxChipComponent` is over the `IgxChipsAreaComponent`.
     * Returns the target `IgxChipComponent`, the drag `IgxChipComponent`, as  well as
     * the original drop event arguments.
     *
     * @example
     * ```html
     * <igx-chip #myChip [id]="'igx-chip-1'" [draggable]="true" (dragOver)="chipOver($event)">
     * ```
     */
    @Output()
    public dragOver = new EventEmitter<IChipEnterDragAreaEventArgs>();

    /**
     * Emits an event when the `IgxChipComponent` has been dropped in the `IgxChipsAreaComponent`.
     * Returns the target `IgxChipComponent`, the drag `IgxChipComponent`, as  well as
     * the original drop event arguments.
     *
     * @example
     * ```html
     * <igx-chip #myChip [id]="'igx-chip-1'" [draggable]="true" (dragDrop)="chipLeave($event)">
     * ```
     */
    @Output()
    public dragDrop = new EventEmitter<IChipEnterDragAreaEventArgs>();

    @HostBinding('class.igx-chip')
    protected defaultClass = 'igx-chip';

    public get variant(): IgxChipTypeVariant | null | undefined {
        return this.cfg.variant as IgxChipTypeVariant | null | undefined;
    }

    @HostBinding('class.igx-chip--primary')
    protected get isPrimary() {
        return this.variant === IgxChipTypeVariant.PRIMARY;
    }

    @HostBinding('class.igx-chip--info')
    protected get isInfo() {
        return this.variant === IgxChipTypeVariant.INFO;
    }

    @HostBinding('class.igx-chip--success')
    protected get isSuccess() {
        return this.variant === IgxChipTypeVariant.SUCCESS;
    }

    @HostBinding('class.igx-chip--warning')
    protected get isWarning() {
        return this.variant === IgxChipTypeVariant.WARNING;
    }

    @HostBinding('class.igx-chip--danger')
    protected get isDanger() {
        return this.variant === IgxChipTypeVariant.DANGER;
    }

    /**
     * Property that contains a reference to the `IgxDragDirective` the `IgxChipComponent` uses for dragging behavior.
     *
     * @example
     * ```html
     * <igx-chip [id]="chip.id" [draggable]="true"></igx-chip>
     * ```
     * ```typescript
     * onMoveStart(event: IBaseChipEventArgs){
     *     let dragDirective = event.owner.dragDirective;
     * }
     * ```
     */
    @ViewChild('chipArea', { read: IgxDragDirective, static: true })
    public dragDirective: IgxDragDirective;

    /**
     * @hidden
     * @internal
     */
    @ViewChild('chipArea', { read: ElementRef, static: true })
    public chipArea: ElementRef;

    /**
     * @hidden
     * @internal
     */
    @ViewChild('defaultRemoveIcon', { read: TemplateRef, static: true })
    public defaultRemoveIcon: TemplateRef<any>;

    /**
     * @hidden
     * @internal
     */
    @ViewChild('defaultSelectIcon', { read: TemplateRef, static: true })
    public defaultSelectIcon: TemplateRef<any>;

    /**
     * @hidden
     * @internal
     */
    public get removeButtonTemplate() {
        if (!this.disabled) {
            return this.removeIcon || this.defaultRemoveIcon;
        }
    }

    /**
     * @hidden
     * @internal
     */
    public get selectIconTemplate() {
        return this.selectIcon || this.defaultSelectIcon;
    }

    /**
     * @hidden
     * @internal
     */
    public get ghostStyles() {
        return { '--ig-size': `${this.chipSize}` };
    }

    /** @hidden @internal */
    public get nativeElement() {
        return this.ref.nativeElement;
    }

    /**
     * @hidden
     * @internal
     */
    public hideBaseElement = false;

    /**
     * @hidden
     * @internal
     */
    public destroy$ = new Subject<void>();

    protected get chipSize(): ɵSize {
        return this.computedStyles?.getPropertyValue('--ig-size') || ɵSize.Medium;
    }
    protected _tabIndex: number | null = null;
    protected _selected = false;
    protected _selectedItemClass = 'igx-chip__item--selected';
    protected _movedWhileRemoving = false;
    protected computedStyles;
    private _resourceStrings = getCurrentResourceStrings(ChipResourceStringsEN);

    /**
     * @hidden
     * @internal
     */
    @HostListener('keydown', ['$event'])
    public keyEvent(event: KeyboardEvent) {
        this.onChipKeyDown(event);
    }

    /**
     * @hidden
     * @internal
     */
    public selectClass(condition: boolean): any {
        const SELECT_CLASS = 'igx-chip__select';

        return {
            [SELECT_CLASS]: condition,
            [`${SELECT_CLASS}--hidden`]: !condition
        };
    }

    public onSelectTransitionDone(event) {
        if (event.target.tagName) {
            // Trigger onSelectionDone on when `width` property is changed and the target is valid element(not comment).
            this.selectedChanged.emit({
                owner: this,
                originalEvent: event
            });
        }
    }

    /**
     * @hidden
     * @internal
     */
    public onChipKeyDown(event: KeyboardEvent) {
        const keyDownArgs: IChipKeyDownEventArgs = {
            originalEvent: event,
            owner: this,
            cancel: false
        };

        this.keyDown.emit(keyDownArgs);
        if (keyDownArgs.cancel) {
            return;
        }

        if ((event.key === 'Delete' || event.key === 'Del') && this.removable) {
            this.remove.emit({
                originalEvent: event,
                owner: this
            });
        }

        if ((event.key === ' ' || event.key === 'Spacebar') && this.selectable && !this.disabled) {
            this.changeSelection(!this.selected, event);
        }

        if (event.key !== 'Tab') {
            event.preventDefault();
        }
    }

    /**
     * @hidden
     * @internal
     */
    public onRemoveBtnKeyDown(event: KeyboardEvent) {
        if (event.key === ' ' || event.key === 'Spacebar' || event.key === 'Enter') {
            this.remove.emit({
                originalEvent: event,
                owner: this
            });

            event.preventDefault();
            event.stopPropagation();
        }
    }

    public onRemoveMouseDown(event: PointerEvent | MouseEvent) {
        event.stopPropagation();
    }

    /**
     * @hidden
     * @internal
     */
    public onRemoveClick(event: MouseEvent | TouchEvent) {
        this.remove.emit({
            originalEvent: event,
            owner: this
        });
    }

    /**
     * @hidden
     * @internal
     */
    public onRemoveTouchMove() {
        // We don't remove chip if user starting touch interacting on the remove button moves the chip
        this._movedWhileRemoving = true;
    }

    /**
     * @hidden
     * @internal
     */
    public onRemoveTouchEnd(event: TouchEvent) {
        if (!this._movedWhileRemoving) {
            this.onRemoveClick(event);
        }
        this._movedWhileRemoving = false;
    }

    /**
     * @hidden
     * @internal
     */
    // -----------------------------
    // Start chip igxDrag behavior
    public onChipDragStart(event: IDragStartEventArgs) {
        this.moveStart.emit({
            originalEvent: event,
            owner: this
        });
        event.cancel = !this.draggable || this.disabled;
    }

    /**
     * @hidden
     * @internal
     */
    public onChipDragEnd() {
        if (this.animateOnRelease) {
            this.dragDirective.transitionToOrigin();
        }
    }

    /**
     * @hidden
     * @internal
     */
    public onChipMoveEnd(event: IDragBaseEventArgs) {
        // moveEnd is triggered after return animation has finished. This happen when we drag and release the chip.
        this.moveEnd.emit({
            originalEvent: event,
            owner: this
        });

        if (this.selected) {
            this.chipArea.nativeElement.focus();
        }
    }

    /**
     * @hidden
     * @internal
     */
    public onChipGhostCreate() {
        this.hideBaseElement = this.hideBaseOnDrag;
    }

    /**
     * @hidden
     * @internal
     */
    public onChipGhostDestroy() {
        this.hideBaseElement = false;
    }

    /**
     * @hidden
     * @internal
     */
    public onChipDragClicked(event: IDragBaseEventArgs) {
        const clickEventArgs: IChipClickEventArgs = {
            originalEvent: event,
            owner: this,
            cancel: false
        };
        this.chipClick.emit(clickEventArgs);

        if (!clickEventArgs.cancel && this.selectable && !this.disabled) {
            this.changeSelection(!this.selected, event);
        }
    }
    // End chip igxDrag behavior

    /**
     * @hidden
     * @internal
     */
    // -----------------------------
    // Start chip igxDrop behavior
    public onChipDragEnterHandler(event: IDropBaseEventArgs) {
        if (this.dragDirective === event.drag) {
            return;
        }

        const eventArgs: IChipEnterDragAreaEventArgs = {
            owner: this,
            dragChip: event.drag.data?.chip,
            originalEvent: event
        };
        this.dragEnter.emit(eventArgs);
    }

    /**
     * @hidden
     * @internal
     */
    public onChipDragLeaveHandler(event: IDropBaseEventArgs) {
        if (this.dragDirective === event.drag) {
            return;
        }

        const eventArgs: IChipEnterDragAreaEventArgs = {
            owner: this,
            dragChip: event.drag.data?.chip,
            originalEvent: event
        };
        this.dragLeave.emit(eventArgs);
    }

    /**
     * @hidden
     * @internal
     */
    public onChipDrop(event: IDropDroppedEventArgs) {
        // Cancel the default drop logic
        event.cancel = true;
        if (this.dragDirective === event.drag) {
            return;
        }

        const eventArgs: IChipEnterDragAreaEventArgs = {
            owner: this,
            dragChip: event.drag.data?.chip,
            originalEvent: event
        };
        this.dragDrop.emit(eventArgs);
    }

    /**
     * @hidden
     * @internal
     */
    public onChipOverHandler(event: IDropBaseEventArgs) {
        if (this.dragDirective === event.drag) {
            return;
        }

        const eventArgs: IChipEnterDragAreaEventArgs = {
            owner: this,
            dragChip: event.drag.data?.chip,
            originalEvent: event
        };
        this.dragOver.emit(eventArgs);
    }
    // End chip igxDrop behavior

    protected changeSelection(newValue: boolean, srcEvent = null) {
        const onSelectArgs: IChipSelectEventArgs = {
            originalEvent: srcEvent,
            owner: this,
            selected: false,
            cancel: false
        };

        if (newValue && !this._selected) {
            onSelectArgs.selected = true;
            this.selectedChanging.emit(onSelectArgs);

            if (!onSelectArgs.cancel) {
                this.renderer.addClass(this.chipArea.nativeElement, this._selectedItemClass);
                this._selected = newValue;
                this.selectedChange.emit(this._selected);
                this.selectedChanged.emit({
                    owner: this,
                    originalEvent: srcEvent
                });
            }
        } else if (!newValue && this._selected) {
            this.selectedChanging.emit(onSelectArgs);

            if (!onSelectArgs.cancel) {
                this.renderer.removeClass(this.chipArea.nativeElement, this._selectedItemClass);
                this._selected = newValue;
                this.selectedChange.emit(this._selected);
                this.selectedChanged.emit({
                    owner: this,
                    originalEvent: srcEvent
                });
            }
        }
    }

    public ngOnInit(): void {
        if (!this.config) {
            this.config = this.defaultConfig;
        }
        this.computedStyles = this.document.defaultView.getComputedStyle(this.nativeElement);
        if (this.config.selected !== undefined && this.config.selected !== this._selected) {
            this.changeSelection(this.config.selected);
        }
        if (this.config.color && this.chipArea?.nativeElement) {
            this.chipArea.nativeElement.style.backgroundColor = this.config.color;
        }
    }

    public ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }
}
