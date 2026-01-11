import { Component, ElementRef, EventEmitter, HostBinding, Input, OnDestroy, OnInit, Output, ViewChild, AfterContentInit, inject, OnChanges, SimpleChanges } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { IgxNavigationService, IToggleView } from 'igniteui-angular/core';
import { IgxButtonType, IgxButtonDirective } from 'igniteui-angular/directives';
import { IgxRippleDirective } from 'igniteui-angular/directives';
import { IgxToggleDirective } from 'igniteui-angular/directives';
import { OverlaySettings, GlobalPositionStrategy, NoOpScrollStrategy, PositionSettings } from 'igniteui-angular/core';
import { IgxFocusDirective } from 'igniteui-angular/directives';
import { IgxFocusTrapDirective } from 'igniteui-angular/directives';
import { CancelableEventArgs, IBaseEventArgs } from 'igniteui-angular/core';
import { fadeIn, fadeOut } from 'igniteui-angular/animations';
import { IgxDialogConfig } from './dialog.config';

let DIALOG_ID = 0;
/**
 * **Ignite UI for Angular Dialog Window** -
 * [Documentation](https://www.infragistics.com/products/ignite-ui-angular/angular/components/dialog.html)
 *
 * The Ignite UI Dialog Window presents a dialog window to the user which can simply display messages or display
 * more complicated visuals such as a user sign-in form.  It also provides a right and left button
 * which can be used for custom actions.
 *
 * Example:
 * ```html
 * <button type="button" igxButton (click)="form.open()">Show Dialog</button>
 * <igx-dialog #form title="Sign In" rightButtonLabel="OK">
 *   <div>
 *     <igx-input-group>
 *       <input type="text" igxInput/>
 *       <label igxLabel>Username</label>
 *     </igx-input-group>
 *   </div>
 *   <div>
 *     <igx-input-group>
 *       <input type="password" igxInput/>
 *       <label igxLabel>Password</label>
 *     </igx-input-group>
 *   </div>
 * </igx-dialog>
 * ```
 */
@Component({
    selector: 'igx-dialog',
    templateUrl: 'dialog-content.component.html',
    imports: [IgxToggleDirective, IgxFocusTrapDirective, IgxFocusDirective, IgxButtonDirective, IgxRippleDirective]
})
export class IgxDialogComponent implements IToggleView, OnInit, OnDestroy, AfterContentInit, OnChanges {
    private elementRef = inject(ElementRef);
    private navService = inject(IgxNavigationService, { optional: true });

    private static NEXT_ID = 1;
    private static readonly DIALOG_CLASS = 'igx-dialog';



    @ViewChild(IgxToggleDirective, { static: true })
    public toggleRef: IgxToggleDirective;

    @Input()
    public config!: IgxDialogConfig;

    private _defaultId: string | undefined;

    private get defaultConfig(): IgxDialogConfig {
        if (!this._defaultId) {
            this._defaultId = `igx-dialog-${DIALOG_ID++}`;
        }
        return {
            id: this._defaultId,
            isModal: true,
            closeOnEscape: true,
            focusTrap: true,
            title: '',
            message: '',
            leftButtonLabel: '',
            leftButtonType: 'flat',
            leftButtonRipple: '',
            rightButtonLabel: '',
            rightButtonType: 'flat',
            rightButtonRipple: '',
            closeOnOutsideSelect: false,
            positionSettings: {
                openAnimation: fadeIn,
                closeAnimation: fadeOut
            },
            isOpen: false
        };
    }

    private get cfg(): IgxDialogConfig {
        return this.config || this.defaultConfig;
    }

    @HostBinding('attr.id')
    public get id() {
        return this.cfg.id ?? this.defaultConfig.id!;
    }

    public get isModal() {
        return this.cfg.isModal ?? true;
    }

    public get closeOnEscape() {
        return this.cfg.closeOnEscape ?? true;
    }

    public get focusTrap() {
        return this.cfg.focusTrap ?? true;
    }

    public get title() {
        return this.cfg.title ?? '';
    }

    public get message() {
        return this.cfg.message ?? '';
    }

    public get leftButtonLabel() {
        return this.cfg.leftButtonLabel ?? '';
    }

    public get leftButtonType() {
        return this.cfg.leftButtonType ?? 'flat';
    }

    public get leftButtonRipple() {
        return this.cfg.leftButtonRipple ?? '';
    }

    public get rightButtonLabel() {
        return this.cfg.rightButtonLabel ?? '';
    }

    public get rightButtonType() {
        return this.cfg.rightButtonType ?? 'flat';
    }

    public get rightButtonRipple() {
        return this.cfg.rightButtonRipple ?? '';
    }

    public get closeOnOutsideSelect() {
        return this.cfg.closeOnOutsideSelect ?? false;
    }

    public get positionSettings(): PositionSettings {
        return this.cfg.positionSettings ?? this._positionSettings;
    }

    public set positionSettings(settings: PositionSettings) {
        if (this.config) {
            this.config.positionSettings = settings;
        }
        this._positionSettings = settings;
        this._overlayDefaultSettings.positionStrategy = new GlobalPositionStrategy(this._positionSettings);
    }

    /**
     * The default `tabindex` attribute for the component
     *
     * @hidden
     */
    @HostBinding('attr.tabindex')
    public tabindex = -1;

    /**
     * An event that is emitted before the dialog is opened.
     * ```html
     * <igx-dialog (opening)="onDialogOpenHandler($event)" (leftButtonSelect)="dialog.close()" rightButtonLabel="OK">
     * </igx-dialog>
     * ```
     */
    @Output()
    public opening = new EventEmitter<IDialogCancellableEventArgs>();

    /**
     * An event that is emitted after the dialog is opened.
     * ```html
     * <igx-dialog (opened)="onDialogOpenedHandler($event)" (leftButtonSelect)="dialog.close()" rightButtonLabel="OK">
     * </igx-dialog>
     * ```
     */
    @Output()
    public opened = new EventEmitter<IDialogEventArgs>();

    /**
     * An event that is emitted before the dialog is closed.
     * ```html
     * <igx-dialog (closing)="onDialogCloseHandler($event)" title="Confirmation" leftButtonLabel="Cancel" rightButtonLabel="OK">
     * </igx-dialog>
     * ```
     */
    @Output()
    public closing = new EventEmitter<IDialogCancellableEventArgs>();

    /**
     * An event that is emitted after the dialog is closed.
     * ```html
     * <igx-dialog (closed)="onDialogClosedHandler($event)" title="Confirmation" leftButtonLabel="Cancel" rightButtonLabel="OK">
     * </igx-dialog>
     * ```
     */
    @Output()
    public closed = new EventEmitter<IDialogEventArgs>();

    /**
     * An event that is emitted when the left button is clicked.
     * ```html
     * <igx-dialog (leftButtonSelect)="onDialogOKSelected($event)" #dialog leftButtonLabel="OK" rightButtonLabel="Cancel">
     * </igx-dialog>
     * ```
     */
    @Output()
    public leftButtonSelect = new EventEmitter<IDialogEventArgs>();

    /**
     * An event that is emitted when the right button is clicked.
     * ```html
     * <igx-dialog (rightButtonSelect)="onDialogOKSelected($event)"
     * #dialog title="Confirmation" (leftButtonSelect)="dialog.close()" rightButtonLabel="OK"
     * rightButtonRipple="#4CAF50" closeOnOutsideSelect="true">
     * </igx-dialog>
     * ```
     */
    @Output()
    public rightButtonSelect = new EventEmitter<IDialogEventArgs>();

    /**
     * @hidden
     */
    @Output() public isOpenChange = new EventEmitter<boolean>();

    /**
     * @hidden
     */
    public get element() {
        return this.elementRef.nativeElement;
    }

    /**
     * Returns the value of state. Possible state values are "open" or "close".
     * ```typescript
     * @ViewChild("MyDialog")
     * public dialog: IgxDialogComponent;
     * ngAfterViewInit() {
     *     let dialogState = this.dialog.state;
     * }
     * ```
     */
    public get state(): string {
        return this.isOpen ? 'open' : 'close';
    }

    public get isOpen() {
        return this.toggleRef ? !this.toggleRef.collapsed : false;
    }
    public set isOpen(value: boolean) {
        if (this.config) {
            this.config.isOpen = value;
        }
        if (value !== this.isOpen) {
            this.isOpenChange.emit(value);
            if (value) {
                requestAnimationFrame(() => {
                    this.open();
                });
            } else {
                this.close();
            }
        }
    }

    @HostBinding('class.igx-dialog--hidden')
    public get isCollapsed() {
        return this.toggleRef.collapsed;
    }

    public get role() {
        if (this.leftButtonLabel !== '' && this.rightButtonLabel !== '') {
            return 'dialog';
        } else if (
            this.leftButtonLabel !== '' ||
            this.rightButtonLabel !== ''
        ) {
            return 'alertdialog';
        } else {
            return 'alert';
        }
    }

    public get titleId() {
        return this._titleId;
    }

    protected destroy$ = new Subject<boolean>();

    private _positionSettings: PositionSettings = {
        openAnimation: fadeIn,
        closeAnimation: fadeOut
    };

    private _overlayDefaultSettings: OverlaySettings;
    private _titleId: string;

    constructor() {
        this._titleId = IgxDialogComponent.NEXT_ID++ + '_title';
        this.updateOverlaySettings();
    }

    public ngOnChanges(changes: SimpleChanges) {
        if (changes['config'] && this.config) {
            if (this.config.positionSettings) {
                this._positionSettings = this.config.positionSettings;
            }
            this.updateOverlaySettings();
            if (this.config.isOpen !== undefined && this.config.isOpen !== this.isOpen) {
                this.isOpen = this.config.isOpen;
            }
        }
    }

    private updateOverlaySettings() {
        this._overlayDefaultSettings = {
            positionStrategy: new GlobalPositionStrategy(this._positionSettings),
            scrollStrategy: new NoOpScrollStrategy(),
            modal: this.isModal,
            closeOnEscape: this.closeOnEscape,
            closeOnOutsideClick: this.closeOnOutsideSelect
        };
    }

    public ngAfterContentInit() {
        this.toggleRef.closing.pipe(takeUntil(this.destroy$)).subscribe((eventArgs) => this.emitCloseFromDialog(eventArgs));
        this.toggleRef.closed.pipe(takeUntil(this.destroy$)).subscribe((eventArgs) => this.emitClosedFromDialog(eventArgs));
        this.toggleRef.opened.pipe(takeUntil(this.destroy$)).subscribe((eventArgs) => this.emitOpenedFromDialog(eventArgs));
    }

    /**
     * A method that opens the dialog.
     *
     * @memberOf {@link IgxDialogComponent}
     * ```html
     * <button type="button" (click)="dialog.open() igxButton="contained">Trigger Dialog</button>
     * <igx-dialog #dialog></igx-dialog>
     * ```
     */
    public open(overlaySettings: OverlaySettings = this._overlayDefaultSettings) {
        const eventArgs: IDialogCancellableEventArgs = { dialog: this, event: null, cancel: false };
        this.opening.emit(eventArgs);
        if (!eventArgs.cancel) {
            overlaySettings = { ...{}, ... this._overlayDefaultSettings, ...overlaySettings };
            this.toggleRef.open(overlaySettings);
            this.isOpenChange.emit(true);
            if (!this.leftButtonLabel && !this.rightButtonLabel) {
                this.toggleRef.element.focus();
            }
        }

    }

    /**
     * A method that that closes the dialog.
     *
     *  @memberOf {@link IgxDialogComponent}
     * ```html
     * <button type="button" (click)="dialog.close() igxButton="contained">Trigger Dialog</button>
     * <igx-dialog #dialog></igx-dialog>
     * ```
     */
    public close() {
        // `closing` will emit from `toggleRef.closing` subscription
        this.toggleRef?.close();
    }


    /**
     * A method that opens/closes the dialog.
     *
     * @memberOf {@link IgxDialogComponent}
     * ```html
     * <button type="button" (click)="dialog.toggle() igxButton="contained">Trigger Dialog</button>
     * <igx-dialog #dialog></igx-dialog>
     * ```
     */
    public toggle() {
        if (this.isOpen) {
            this.close();
        } else {
            this.open();
        }
    }

    /**
     * @hidden
     */
    public onDialogSelected(event) {
        event.stopPropagation();
        if (
            this.isOpen &&
            this.closeOnOutsideSelect &&
            event.target.classList.contains(IgxDialogComponent.DIALOG_CLASS)
        ) {
            this.close();
        }
    }

    /**
     * @hidden
     */
    public onInternalLeftButtonSelect(event) {
        this.leftButtonSelect.emit({ dialog: this, event });
    }

    /**
     * @hidden
     */
    public onInternalRightButtonSelect(event) {
        this.rightButtonSelect.emit({ dialog: this, event });
    }

    /**
     * @hidden
     */
    public ngOnInit() {
        if (this.navService && this.id) {
            this.navService.add(this.id, this);
        }
    }
    /**
     * @hidden
     */
    public ngOnDestroy() {
        if (this.navService && this.id) {
            this.navService.remove(this.id);
        }
    }

    private emitCloseFromDialog(eventArgs) {
        const dialogEventsArgs = { dialog: this, event: eventArgs.event, cancel: eventArgs.cancel };
        this.closing.emit(dialogEventsArgs);
        eventArgs.cancel = dialogEventsArgs.cancel;
        if (!eventArgs.cancel) {
            this.isOpenChange.emit(false);
        }
    }

    private emitClosedFromDialog(eventArgs) {
        this.closed.emit({ dialog: this, event: eventArgs.event });
    }

    private emitOpenedFromDialog(eventArgs) {
        this.opened.emit({ dialog: this, event: eventArgs.event });
    }
}

export interface IDialogEventArgs extends IBaseEventArgs {
    dialog: IgxDialogComponent;
    event: Event;
}

export interface IDialogCancellableEventArgs extends IDialogEventArgs, CancelableEventArgs { }
