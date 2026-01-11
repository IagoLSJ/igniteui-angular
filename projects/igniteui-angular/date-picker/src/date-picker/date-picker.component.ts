import {
    AfterViewChecked,
    AfterViewInit,
    AfterContentChecked,
    ChangeDetectorRef,
    Component,
    ContentChild,
    ElementRef,
    EventEmitter,
    HostBinding,
    HostListener,
    Injector,
    Input,
    OnDestroy,
    OnInit,
    Output,
    PipeTransform,
    Renderer2,
    ViewChild,
    ViewContainerRef,
    booleanAttribute,
    inject
} from '@angular/core';
import {
    AbstractControl,
    ControlValueAccessor,
    NgControl,
    NG_VALIDATORS,
    NG_VALUE_ACCESSOR,
    ValidationErrors,
    Validator
} from '@angular/forms';
import {
    IgxCalendarComponent, IgxCalendarHeaderTemplateDirective, IgxCalendarHeaderTitleTemplateDirective, IgxCalendarSubheaderTemplateDirective,
     IFormattingViews, IFormattingOptions
} from 'igniteui-angular/calendar';
import {
    IgxLabelDirective, IgxInputState, IgxInputGroupComponent, IgxPrefixDirective, IgxInputDirective, IgxSuffixDirective,
    IgxReadOnlyInputDirective
} from 'igniteui-angular/input-group';
import { fromEvent, Subscription, noop, MonoTypeOperatorFunction } from 'rxjs';
import { filter, takeUntil } from 'rxjs/operators';

import { IgxDateTimeEditorDirective, IgxTextSelectionDirective } from 'igniteui-angular/directives';
import {
    AbsoluteScrollStrategy,
    AutoPositionStrategy,
    IgxOverlayService,
    OverlayCancelableEventArgs,
    OverlayEventArgs,
    OverlaySettings,
    IgxPickerActionsDirective,
    DatePickerResourceStringsEN,
    IDatePickerResourceStrings,
    DateRangeDescriptor,
    DateRangeType,
    IBaseCancelableBrowserEventArgs,
    isDate,
    PlatformUtil,
    getCurrentResourceStrings,
    PickerCalendarOrientation,
    DateTimeUtil,
    DatePartDeltas,
    DatePart,
    isDateInRanges,
    IgxOverlayOutletDirective
} from 'igniteui-angular/core';
import { IDatePickerValidationFailedEventArgs } from './date-picker.common';
import { IgxIconComponent } from 'igniteui-angular/icon';
import { fadeIn, fadeOut } from 'igniteui-angular/animations';
import { PickerBaseDirective } from './picker-base.directive';
import { IgxCalendarContainerComponent } from './calendar-container/calendar-container.component';
import { IDatePickerConfig } from './date-picker.config';

let NEXT_ID = 0;

/**
 * Date Picker displays a popup calendar that lets users select a single date.
 *
 * @igxModule IgxDatePickerModule
 * @igxTheme igx-calendar-theme, igx-icon-theme
 * @igxGroup Scheduling
 * @igxKeywords datepicker, calendar, schedule, date
 * @example
 * ```html
 * <igx-date-picker [(ngModel)]="selectedDate"></igx-date-picker>
 * ```
 */
@Component({
    providers: [
        { provide: NG_VALUE_ACCESSOR, useExisting: IgxDatePickerComponent, multi: true },
        { provide: NG_VALIDATORS, useExisting: IgxDatePickerComponent, multi: true }
    ],
    selector: 'igx-date-picker',
    templateUrl: 'date-picker.component.html',
    styles: [':host { display: block; }'],
    imports: [
        IgxInputGroupComponent,
        IgxPrefixDirective,
        IgxIconComponent,
        IgxInputDirective,
        IgxReadOnlyInputDirective,
        IgxDateTimeEditorDirective,
        IgxTextSelectionDirective,
        IgxSuffixDirective
    ]
})
export class IgxDatePickerComponent extends PickerBaseDirective implements ControlValueAccessor, Validator,
    OnInit, AfterViewInit, OnDestroy, AfterViewChecked, AfterContentChecked {
    private _overlayService = inject<IgxOverlayService>(IgxOverlayService);
    private _injector = inject(Injector);
    private _renderer = inject(Renderer2);
    private platform = inject(PlatformUtil);
    private cdr = inject(ChangeDetectorRef);

    @Input()
    public config!: IDatePickerConfig;

    public get hideOutsideDays(): boolean {
        return this.config?.hideOutsideDays ?? false;
    }

    public get displayMonthsCount(): number {
        return this.config?.displayMonthsCount ?? 1;
    }

    public get orientation(): PickerCalendarOrientation {
        return this.config?.orientation ?? PickerCalendarOrientation.Horizontal;
    }

    public get showWeekNumbers(): boolean {
        return this.config?.showWeekNumbers ?? false;
    }

    public get activeDate(): Date {
        const today = new Date(new Date().setHours(0, 0, 0, 0));
        const dateValue = DateTimeUtil.isValidDate(this._dateValue) ? new Date(this._dateValue.setHours(0, 0, 0, 0)) : null;
        return this.config?.activeDate ?? this._activeDate ?? dateValue ?? this._calendar?.activeDate ?? today;
    }

    public set activeDate(value: Date) {
        if (this.config) {
            this.config.activeDate = value;
        }
        this._activeDate = value;
    }

    public get formatter(): (val: Date) => string {
        return this.config?.formatter;
    }

    public get todayButtonLabel(): string {
        return this.config?.todayButtonLabel;
    }

    public get cancelButtonLabel(): string {
        return this.config?.cancelButtonLabel;
    }

    public get spinLoop(): boolean {
        return this.config?.spinLoop ?? true;
    }

    public get spinDelta(): Pick<DatePartDeltas, 'date' | 'month' | 'year'> {
        return this.config?.spinDelta;
    }


    @HostBinding('attr.id')
    public get id(): string {
        if (this.config?.id) {
            this._id = this.config.id;
        }
        return this._id;
    }

    public get formatViews(): IFormattingViews {
        return this.config?.formatViews;
    }

    public get disabledDates(): DateRangeDescriptor[] {
        return this.config?.disabledDates ?? this._disabledDates;
    }

    public set disabledDates(value: DateRangeDescriptor[]) {
        if (this.config) {
            this.config.disabledDates = value;
        }
        this._disabledDates = value;
        this._onValidatorChange();
    }

    public get specialDates(): DateRangeDescriptor[] {
        return this.config?.specialDates ?? this._specialDates;
    }

    public set specialDates(value: DateRangeDescriptor[]) {
        if (this.config) {
            this.config.specialDates = value;
        }
        this._specialDates = value;
    }

    public get calendarFormat(): IFormattingOptions {
        return this.config?.calendarFormat;
    }

    public get value(): Date | string {
        return this.config?.value ?? this._value;
    }

    public set value(date: Date | string) {
        if (this.config) {
            this.config.value = date;
        }
        this._value = date;
        this.setDateValue(date);
        if (this.dateTimeEditor.value !== date) {
            this.dateTimeEditor.value = this._dateValue;
        }
        this.valueChange.emit(this.dateValue);
        this._onChangeCallback(this.dateValue);
    }

    public get minValue(): Date | string {
        return this.config?.minValue ?? this._minValue;
    }

    public set minValue(value: Date | string) {
        if (this.config) {
            this.config.minValue = value;
        }
        this._minValue = value;
        this._onValidatorChange();
    }

    public get maxValue(): Date | string {
        return this.config?.maxValue ?? this._maxValue;
    }

    public set maxValue(value: Date | string) {
        if (this.config) {
            this.config.maxValue = value;
        }
        this._maxValue = value;
        this._onValidatorChange();
    }

    public get resourceStrings(): IDatePickerResourceStrings {
        return this.config?.resourceStrings;
    }

    public get readOnly(): boolean {
        return this.config?.readOnly ?? false;
    }

    /**
     * Emitted when the picker's value changes.
     *
     * @remarks
     * Used for `two-way` bindings.
     *
     * @example
     * ```html
     * <igx-date-picker [(value)]="date"></igx-date-picker>
     * ```
     */
    @Output()
    public valueChange = new EventEmitter<Date>();

    /**
     * Emitted when the user types/spins invalid date in the date-picker editor.
     *
     *  @example
     * ```html
     * <igx-date-picker (validationFailed)="onValidationFailed($event)"></igx-date-picker>
     * ```
     */
    @Output()
    public validationFailed = new EventEmitter<IDatePickerValidationFailedEventArgs>();

    /** @hidden @internal */
    @ContentChild(IgxLabelDirective)
    public label: IgxLabelDirective;

    @ContentChild(IgxCalendarHeaderTitleTemplateDirective)
    private headerTitleTemplate: IgxCalendarHeaderTitleTemplateDirective;

    @ContentChild(IgxCalendarHeaderTemplateDirective)
    private headerTemplate: IgxCalendarHeaderTemplateDirective;

    @ViewChild(IgxDateTimeEditorDirective, { static: true })
    private dateTimeEditor: IgxDateTimeEditorDirective;

    @ViewChild(IgxInputGroupComponent, { read: ViewContainerRef })
    private viewContainerRef: ViewContainerRef;

    @ViewChild(IgxLabelDirective)
    private labelDirective: IgxLabelDirective;

    @ViewChild(IgxInputDirective)
    private inputDirective: IgxInputDirective;

    @ContentChild(IgxCalendarSubheaderTemplateDirective)
    private subheaderTemplate: IgxCalendarSubheaderTemplateDirective;

    @ContentChild(IgxPickerActionsDirective)
    private pickerActions: IgxPickerActionsDirective;

    private get dialogOverlaySettings(): OverlaySettings {
        return Object.assign({}, this._dialogOverlaySettings, this.overlaySettings);
    }

    private get dropDownOverlaySettings(): OverlaySettings {
        return Object.assign({}, this._dropDownOverlaySettings, this.overlaySettings);
    }

    private get inputGroupElement(): HTMLElement {
        return this.inputGroup?.element.nativeElement;
    }

    private get dateValue(): Date {
        return this._dateValue;
    }

    private get pickerFormatViews(): IFormattingViews {
        return Object.assign({}, this._defFormatViews, this.formatViews || {});
    }

    private get pickerCalendarFormat(): IFormattingOptions {
        return Object.assign({}, this._calendarFormat, this.calendarFormat || {});
    }

    /** @hidden @internal */
    public displayValue: PipeTransform = { transform: (date: Date) => this.formatter ? this.formatter(date) : date.toString() };

    private _resourceStrings = getCurrentResourceStrings(DatePickerResourceStringsEN);
    private _dateValue: Date;
    private _overlayId: string;
    private _value: Date | string;
    private _ngControl: NgControl = null;
    private _statusChanges$: Subscription;
    private _calendar: IgxCalendarComponent;
    private _calendarContainer?: HTMLElement;
    private _specialDates: DateRangeDescriptor[] = null;
    private _disabledDates: DateRangeDescriptor[] = null;
    private _activeDate: Date = null;
    private _id: string = `igx-date-picker-${NEXT_ID++}`;
    private _overlaySubFilter:
        [MonoTypeOperatorFunction<OverlayEventArgs>,
            MonoTypeOperatorFunction<OverlayEventArgs | OverlayCancelableEventArgs>] = [
            filter(x => x.id === this._overlayId),
            takeUntil(this._destroy$)
        ];
    private _dropDownOverlaySettings: OverlaySettings = {
        target: this.inputGroupElement,
        closeOnOutsideClick: true,
        modal: false,
        closeOnEscape: true,
        scrollStrategy: new AbsoluteScrollStrategy(),
        positionStrategy: new AutoPositionStrategy({
            openAnimation: fadeIn,
            closeAnimation: fadeOut
        })
    };
    private _dialogOverlaySettings: OverlaySettings = {
        closeOnOutsideClick: true,
        modal: true,
        closeOnEscape: true
    };
    private _calendarFormat: IFormattingOptions = {
        day: 'numeric',
        month: 'short',
        weekday: 'short',
        year: 'numeric'
    };
    private _defFormatViews: IFormattingViews = {
        day: false,
        month: true,
        year: false
    };
    private _onChangeCallback: (_: Date) => void = noop;
    private _onTouchedCallback: () => void = noop;
    private _onValidatorChange: () => void = noop;

    constructor() {
        super();
        this.locale = this.locale || this._localeId;
    }

    /** @hidden @internal */
    public get required(): boolean {
        if (this._ngControl && this._ngControl.control && this._ngControl.control.validator) {
            // Run the validation with empty object to check if required is enabled.
            const error = this._ngControl.control.validator({} as AbstractControl);
            return error && error.required;
        }

        return false;
    }

    /** @hidden @internal */
    public get pickerResourceStrings(): IDatePickerResourceStrings {
        return Object.assign({}, this._resourceStrings, this.resourceStrings || {});
    }

    protected override get toggleContainer(): HTMLElement | undefined {
        return this._calendarContainer;
    }

    /** @hidden @internal */
    @HostListener('keydown', ['$event'])
    public onKeyDown(event: KeyboardEvent) {
        switch (event.key) {
            case this.platform.KEYMAP.ARROW_UP:
                if (event.altKey) {
                    this.close();
                }
                break;
            case this.platform.KEYMAP.ARROW_DOWN:
                if (event.altKey) {
                    this.open();
                }
                break;
            case this.platform.KEYMAP.SPACE:
                event.preventDefault();
                this.open();
                break;
        }
    }

    /**
     * Opens the picker's dropdown or dialog.
     *
     * @example
     * ```html
     * <igx-date-picker #picker></igx-date-picker>
     *
     * <button type="button" igxButton (click)="picker.open()">Open Dialog</button>
     * ```
     */
    public open(settings?: OverlaySettings): void {
        if (!this.collapsed || this.disabled || this.readOnly) {
            return;
        }

        const overlaySettings = Object.assign({}, this.isDropdown
            ? this.dropDownOverlaySettings
            : this.dialogOverlaySettings
            , settings);

        if (this.isDropdown && this.inputGroupElement) {
            overlaySettings.target = this.inputGroupElement;
        }
        if (this.outlet) {
            overlaySettings.outlet = this.outlet;
        }
        this._overlayId = this._overlayService
            .attach(IgxCalendarContainerComponent, this.viewContainerRef, overlaySettings);
        this._overlayService.show(this._overlayId);
    }

    /**
     * Toggles the picker's dropdown or dialog
     *
     * @example
     * ```html
     * <igx-date-picker #picker></igx-date-picker>
     *
     * <button type="button" igxButton (click)="picker.toggle()">Toggle Dialog</button>
     * ```
     */
    public toggle(settings?: OverlaySettings): void {
        if (this.collapsed) {
            this.open(settings);
        } else {
            this.close();
        }
    }

    /**
     * Closes the picker's dropdown or dialog.
     *
     * @example
     * ```html
     * <igx-date-picker #picker></igx-date-picker>
     *
     * <button type="button" igxButton (click)="picker.close()">Close Dialog</button>
     * ```
     */
    public close(): void {
        if (!this.collapsed) {
            this._overlayService.hide(this._overlayId);
        }
    }

    /**
     * Selects a date.
     *
     * @remarks Updates the value in the input field.
     *
     * @example
     * ```typescript
     * this.datePicker.select(date);
     * ```
     * @param date passed date that has to be set to the calendar.
     */
    public select(value: Date): void {
        this.value = value;
    }

    /**
     * Selects today's date and closes the picker.
     *
     * @example
     * ```html
     * <igx-date-picker #picker></igx-date-picker>
     *
     * <button type="button" igxButton (click)="picker.selectToday()">Select Today</button>
     * ```
     * */
    public selectToday(): void {
        const today = new Date();
        today.setHours(0);
        today.setMinutes(0);
        today.setSeconds(0);
        today.setMilliseconds(0);
        this.select(today);
        this.close();
    }

    /**
     * Clears the input field and the picker's value.
     *
     * @example
     * ```typescript
     * this.datePicker.clear();
     * ```
     */
    public clear(): void {
        if (!this.disabled || !this.readOnly) {
            this._calendar?.deselectDate();
            this.dateTimeEditor.clear();
        }
    }

    /**
     * Increment a specified `DatePart`.
     *
     * @param datePart The optional DatePart to increment. Defaults to Date.
     * @param delta The optional delta to increment by. Overrides `spinDelta`.
     * @example
     * ```typescript
     * this.datePicker.increment(DatePart.Date);
     * ```
     */
    public increment(datePart?: DatePart, delta?: number): void {
        this.dateTimeEditor.increment(datePart, delta);
    }

    /**
     * Decrement a specified `DatePart`
     *
     * @param datePart The optional DatePart to decrement. Defaults to Date.
     * @param delta The optional delta to decrement by. Overrides `spinDelta`.
     * @example
     * ```typescript
     * this.datePicker.decrement(DatePart.Date);
     * ```
     */
    public decrement(datePart?: DatePart, delta?: number): void {
        this.dateTimeEditor.decrement(datePart, delta);
    }

    //#region Control Value Accessor
    /** @hidden @internal */
    public writeValue(value: Date | string) {
        this._value = value;
        this.setDateValue(value);
        if (this.dateTimeEditor.value !== value) {
            this.dateTimeEditor.value = this._dateValue;
        }
    }

    /** @hidden @internal */
    public registerOnChange(fn: any) {
        this._onChangeCallback = fn;
    }

    /** @hidden @internal */
    public registerOnTouched(fn: any) {
        this._onTouchedCallback = fn;
    }

    /** @hidden @internal */
    public setDisabledState?(isDisabled: boolean): void {
        this.disabled = isDisabled;
    }
    //#endregion

    //#region Validator
    /** @hidden @internal */
    public registerOnValidatorChange(fn: any) {
        this._onValidatorChange = fn;
    }

    /** @hidden @internal */
    public validate(control: AbstractControl): ValidationErrors | null {
        if (!control.value) {
            return null;
        }
        // InvalidDate handling
        if (isDate(control.value) && !DateTimeUtil.isValidDate(control.value)) {
            return { value: true };
        }

        const errors = {};
        const value = DateTimeUtil.isValidDate(control.value) ? control.value : DateTimeUtil.parseIsoDate(control.value);
        if (value && this.disabledDates && isDateInRanges(value, this.disabledDates)) {
            Object.assign(errors, { dateIsDisabled: true });
        }
        Object.assign(errors, DateTimeUtil.validateMinMax(value, this.minValue, this.maxValue, false));

        return Object.keys(errors).length > 0 ? errors : null;
    }
    //#endregion

    /** @hidden @internal */
    public ngOnInit(): void {
        this._ngControl = this._injector.get<NgControl>(NgControl, null);

        this.locale = this.locale || this._localeId;
    }

    /** @hidden @internal */
    public override ngAfterViewInit() {
        super.ngAfterViewInit();
        this.subscribeToClick();
        this.subscribeToOverlayEvents();
        this.subscribeToDateEditorEvents();

        this._dropDownOverlaySettings.excludeFromOutsideClick = [this.inputGroup.element.nativeElement];

        fromEvent(this.inputDirective.nativeElement, 'blur')
            .pipe(takeUntil(this._destroy$))
            .subscribe(() => {
                if (this.collapsed) {
                    this._onTouchedCallback();
                    this.updateValidity();
                }
            });

        if (this._ngControl) {
            this._statusChanges$ =
                this._ngControl.statusChanges.subscribe(this.onStatusChanged.bind(this));
            if (this._ngControl.control.validator) {
                this.inputGroup.isRequired = this.required;
                this.cdr.detectChanges();
            }
        }
    }

    /** @hidden @internal */
    public ngAfterViewChecked() {
        if (this.labelDirective) {
            this._renderer.setAttribute(this.inputDirective.nativeElement, 'aria-labelledby', this.labelDirective.id);
        }
    }

    /** @hidden @internal */
    public override ngOnDestroy(): void {
        super.ngOnDestroy();
        if (this._statusChanges$) {
            this._statusChanges$.unsubscribe();
        }
        if (this._overlayId) {
            this._overlayService.detach(this._overlayId);
            delete this._overlayId;
        }
    }

    /** @hidden @internal */
    public getEditElement(): HTMLInputElement {
        return this.inputDirective.nativeElement;
    }

    private subscribeToClick() {
        fromEvent(this.getEditElement(), 'click')
            .pipe(takeUntil(this._destroy$))
            .subscribe(() => {
                if (!this.isDropdown) {
                    this.toggle();
                }
            });
    }

    private setDateValue(value: Date | string) {
        if (isDate(value) && isNaN(value.getTime())) {
            this._dateValue = value;
            return;
        }
        this._dateValue = DateTimeUtil.isValidDate(value) ? value : DateTimeUtil.parseIsoDate(value);
        if (this._calendar) {
            this._calendar.selectDate(this._dateValue);
            this._calendar.activeDate = this.activeDate;
            this._calendar.viewDate = this.activeDate;
            this.cdr.detectChanges();
        }
    }

    private updateValidity() {
        // B.P. 18 May 2021: IgxDatePicker does not reset its state upon resetForm #9526
        if (this._ngControl && !this.disabled && this.isTouchedOrDirty) {
            if (this.hasValidators && this.inputGroup.isFocused) {
                this.inputDirective.valid = this._ngControl.valid ? IgxInputState.VALID : IgxInputState.INVALID;
            } else {
                this.inputDirective.valid = this._ngControl.valid ? IgxInputState.INITIAL : IgxInputState.INVALID;
            }
        } else {
            this.inputDirective.valid = IgxInputState.INITIAL;
        }
    }

    private get isTouchedOrDirty(): boolean {
        return (this._ngControl.control.touched || this._ngControl.control.dirty);
    }

    private get hasValidators(): boolean {
        return (!!this._ngControl.control.validator || !!this._ngControl.control.asyncValidator);
    }

    private onStatusChanged = () => {
        this.disabled = this._ngControl.disabled;
        this.updateValidity();
        this.inputGroup.isRequired = this.required;
    };

    private handleSelection(date: Date): void {
        if (this.dateValue && DateTimeUtil.isValidDate(this.dateValue)) {
            date.setHours(this.dateValue.getHours());
            date.setMinutes(this.dateValue.getMinutes());
            date.setSeconds(this.dateValue.getSeconds());
            date.setMilliseconds(this.dateValue.getMilliseconds());
        }
        this.value = date;
        if (this._calendar) {
            this._calendar.activeDate = this.activeDate;
            this._calendar.viewDate = this.activeDate;
        }
        this.close();
    }

    private subscribeToDateEditorEvents(): void {
        this.dateTimeEditor.valueChange.pipe(
            takeUntil(this._destroy$)).subscribe(val => {
                this.value = val;
            });
        this.dateTimeEditor.validationFailed.pipe(
            takeUntil(this._destroy$)).subscribe((event) => {
                this.validationFailed.emit({
                    owner: this,
                    prevValue: event.oldValue,
                    currentValue: this.value
                });
            });
    }

    private subscribeToOverlayEvents() {
        this._overlayService.opening.pipe(...this._overlaySubFilter).subscribe((e: OverlayCancelableEventArgs) => {
            const args: IBaseCancelableBrowserEventArgs = { owner: this, event: e.event, cancel: e.cancel };
            this.opening.emit(args);
            e.cancel = args.cancel;
            if (args.cancel) {
                this._overlayService.detach(this._overlayId);
                return;
            }

            this._initializeCalendarContainer(e.componentRef.instance);
            this._calendarContainer = e.componentRef.location.nativeElement;
            this._collapsed = false;
        });

        this._overlayService.opened.pipe(...this._overlaySubFilter).subscribe(() => {
            this.opened.emit({ owner: this });

            this._calendar.wrapper?.nativeElement?.focus();
        });

        this._overlayService.closing.pipe(...this._overlaySubFilter).subscribe((e: OverlayCancelableEventArgs) => {
            const args: IBaseCancelableBrowserEventArgs = { owner: this, event: e.event, cancel: e.cancel };
            this.closing.emit(args);
            e.cancel = args.cancel;
            if (args.cancel) {
                return;
            }
            // do not focus the input if clicking outside in dropdown mode
            const outsideEvent = args.event && (args.event as KeyboardEvent).key !== this.platform.KEYMAP.ESCAPE;
            if (this.getEditElement() && !(outsideEvent && this.isDropdown)) {
                this.inputDirective.focus();
            } else {
                this._onTouchedCallback();
                this.updateValidity();
            }
        });

        this._overlayService.closed.pipe(...this._overlaySubFilter).subscribe(() => {
            this.closed.emit({ owner: this });
            this._overlayService.detach(this._overlayId);
            this._collapsed = true;
            this._overlayId = null;
            this._calendar = null;
            this._calendarContainer = undefined;
        });
    }

    private getMinMaxDates() {
        const minValue = DateTimeUtil.isValidDate(this.minValue) ? this.minValue : DateTimeUtil.parseIsoDate(this.minValue);
        const maxValue = DateTimeUtil.isValidDate(this.maxValue) ? this.maxValue : DateTimeUtil.parseIsoDate(this.maxValue);
        return { minValue, maxValue };
    }

    private setDisabledDates(): void {
        this._calendar.disabledDates = this.disabledDates ? [...this.disabledDates] : [];
        const { minValue, maxValue } = this.getMinMaxDates();
        if (minValue) {
            this._calendar.disabledDates.push({ type: DateRangeType.Before, dateRange: [minValue] });
        }
        if (maxValue) {
            this._calendar.disabledDates.push({ type: DateRangeType.After, dateRange: [maxValue] });
        }
    }

    private _initializeCalendarContainer(componentInstance: IgxCalendarContainerComponent) {
        this._calendar = componentInstance.calendar;
        this._calendar.hasHeader = !this.isDropdown && !this.hideHeader;
        this._calendar.formatOptions = this.pickerCalendarFormat;
        this._calendar.formatViews = this.pickerFormatViews;
        this._calendar.locale = this.locale;
        this._calendar.weekStart = this.weekStart;
        this._calendar.specialDates = this.specialDates;
        this._calendar.headerTitleTemplate = this.headerTitleTemplate;
        this._calendar.headerTemplate = this.headerTemplate;
        this._calendar.subheaderTemplate = this.subheaderTemplate;
        this._calendar.headerOrientation = this.headerOrientation;
        this._calendar.hideOutsideDays = this.hideOutsideDays;
        this._calendar.monthsViewNumber = this.displayMonthsCount;
        this._calendar.showWeekNumbers = this.showWeekNumbers;
        this._calendar.orientation = this.orientation;
        this._calendar.selected.pipe(takeUntil(this._destroy$)).subscribe((ev: Date) => this.handleSelection(ev));
        this.setDisabledDates();

        if (DateTimeUtil.isValidDate(this.dateValue)) {
            // calendar will throw if the picker's value is InvalidDate #9208
            this._calendar.value = this.dateValue;
        }
        this._calendar.activeDate = this.activeDate;
        this._calendar.viewDate = this.activeDate;

        componentInstance.mode = this.mode;
        componentInstance.closeButtonLabel = this.cancelButtonLabel;
        componentInstance.todayButtonLabel = this.todayButtonLabel;
        componentInstance.pickerActions = this.pickerActions;

        componentInstance.calendarClose.pipe(takeUntil(this._destroy$)).subscribe(() => this.close());
        componentInstance.todaySelection.pipe(takeUntil(this._destroy$)).subscribe(() => this.selectToday());
    }
}
