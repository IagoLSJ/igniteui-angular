import { Component, Input, HostListener, ElementRef, HostBinding, Output, EventEmitter, OnInit, OnDestroy, TemplateRef, inject } from '@angular/core';
import { takeUntil } from 'rxjs/operators';
import { SliderHandle } from '../slider.common';
import { Subject } from 'rxjs';
import { NgClass } from '@angular/common';
import { ɵIgxDirectionality } from 'igniteui-angular/core';
import { IThumbSliderConfig } from './thumb-slider.config';

/**
 * @hidden
 */
@Component({
    selector: 'igx-thumb',
    templateUrl: 'thumb-slider.component.html',
    imports: [NgClass]
})
export class IgxSliderThumbComponent implements OnInit, OnDestroy {
    private _elementRef = inject(ElementRef);
    private _dir = inject(ɵIgxDirectionality);

    @Input()
    public set config(value: IThumbSliderConfig) {
        if (value) {
            this._config = { ...value };
            if (value.value !== undefined) {
                this._value = value.value;
            }
            if (value.continuous !== undefined) {
                this._continuous = value.continuous;
            }
            if (value.thumbLabelVisibilityDuration !== undefined) {
                this._thumbLabelVisibilityDuration = value.thumbLabelVisibilityDuration;
            }
            if (value.disabled !== undefined) {
                this._disabled = value.disabled;
            }
            if (value.onPan !== undefined) {
                this._onPan = value.onPan;
            }
            if (value.stepDistance !== undefined) {
                this._stepDistance = value.stepDistance;
            }
            if (value.step !== undefined) {
                this._step = value.step;
            }
            if (value.templateRef !== undefined) {
                this._templateRef = value.templateRef;
            }
            if (value.context !== undefined) {
                this._context = value.context;
            }
            if (value.type !== undefined) {
                this._type = value.type;
            }
            if (value.deactiveState !== undefined) {
                this._deactiveState = value.deactiveState;
            }
            if (value.min !== undefined) {
                this._min = value.min;
            }
            if (value.max !== undefined) {
                this._max = value.max;
            }
            if (value.labels !== undefined) {
                this._labels = value.labels;
            }
        }
    }

    public get config(): Readonly<IThumbSliderConfig> {
        return this._config;
    }

    public get value(): any {
        return this._value ?? this._config?.value;
    }

    public get continuous(): boolean {
        return this._continuous ?? this._config?.continuous ?? false;
    }

    public get thumbLabelVisibilityDuration(): number {
        return this._thumbLabelVisibilityDuration ?? this._config?.thumbLabelVisibilityDuration;
    }

    public get disabled(): boolean {
        return this._disabled ?? this._config?.disabled ?? false;
    }

    public get onPan(): Subject<number> {
        return this._onPan ?? this._config?.onPan;
    }

    public get stepDistance(): number {
        return this._stepDistance ?? this._config?.stepDistance;
    }

    public get step(): number {
        return this._step ?? this._config?.step;
    }

    public get templateRef(): TemplateRef<any> {
        return this._templateRef ?? this._config?.templateRef;
    }

    public get context(): any {
        return this._context ?? this._config?.context;
    }

    public get type(): SliderHandle {
        return this._type ?? this._config?.type;
    }

    public get deactiveState(): boolean {
        return this._deactiveState ?? this._config?.deactiveState ?? false;
    }

    public get min(): number {
        return this._min ?? this._config?.min;
    }

    public get max(): number {
        return this._max ?? this._config?.max;
    }

    public get labels(): any[] {
        return this._labels ?? this._config?.labels;
    }

    private _config: IThumbSliderConfig = {};
    private _value: any;
    private _continuous: boolean;
    private _thumbLabelVisibilityDuration: number;
    private _disabled: boolean;
    private _onPan: Subject<number>;
    private _stepDistance: number;
    private _step: number;
    private _templateRef: TemplateRef<any>;
    private _context: any;
    private _type: SliderHandle;
    private _deactiveState: boolean;
    private _min: number;
    private _max: number;
    private _labels: any[];

    @Output()
    public thumbValueChange = new EventEmitter<number>();

    @Output()
    public thumbChange = new EventEmitter<any>();

    @Output()
    public thumbBlur = new EventEmitter<void>();

    @Output()
    public hoverChange = new EventEmitter<boolean>();

    @HostBinding('attr.tabindex')
    public tabindex = 0;

    @HostBinding('attr.role')
    public role = 'slider';

    @HostBinding('attr.aria-valuenow')
    public get ariaValueNow() {
        return this.value;
    }

    @HostBinding('attr.aria-valuemin')
    public get ariaValueMin() {
        return this.min;
    }

    @HostBinding('attr.aria-valuemax')
    public get ariaValueMax() {
        return this.max;
    }

    @HostBinding('attr.aria-valuetext')
    public get ariaValueText() {
        if (this.labels && this.labels[this.value] !== undefined) {
            return this.labels[this.value];
        }
        return this.value;
    }

    @HostBinding('attr.aria-label')
    public get ariaLabelAttr() {
        return `Slider thumb ${this.type}`;
    }

    @HostBinding('attr.aria-orientation')
    public ariaOrientation = 'horizontal';

    @HostBinding(`attr.aria-disabled`)
    public get ariaDisabled() {
        return this.disabled;
    }

    @HostBinding('attr.z-index')
    public zIndex = 0;

    @HostBinding('class.igx-slider-thumb-to--focused')
    public focused = false;

    @HostBinding('class.igx-slider-thumb-from')
    public get thumbFromClass() {
        return this.type === SliderHandle.FROM;
    }

    @HostBinding('class.igx-slider-thumb-to')
    public get thumbToClass() {
        return this.type === SliderHandle.TO;
    }

    @HostBinding('class.igx-slider-thumb-from--active')
    public get thumbFromActiveClass() {
        return this.type === SliderHandle.FROM && this._isActive;
    }

    @HostBinding('class.igx-slider-thumb-to--active')
    public get thumbToActiveClass() {
        return this.type === SliderHandle.TO && this._isActive;
    }

    @HostBinding('class.igx-slider-thumb-from--disabled')
    public get thumbFromDisabledClass() {
        return this.type === SliderHandle.FROM && this.disabled;
    }

    @HostBinding('class.igx-slider-thumb-to--disabled')
    public get thumbToDisabledClass() {
        return this.type === SliderHandle.TO && this.disabled;
    }

    @HostBinding('class.igx-slider-thumb-from--pressed')
    public get thumbFromPressedClass() {
        return this.type === SliderHandle.FROM && this.isActive && this._isPressed;
    }

    @HostBinding('class.igx-slider-thumb-to--pressed')
    public get thumbToPressedClass() {
        return this.type === SliderHandle.TO && this.isActive && this._isPressed;
    }

    public get getDotClass() {
        return {
            'igx-slider-thumb-from__dot': this.type === SliderHandle.FROM,
            'igx-slider-thumb-to__dot': this.type === SliderHandle.TO
        };
    }

    public isActive = false;

    public get nativeElement() {
        return this._elementRef.nativeElement;
    }

    public get destroy(): Subject<boolean> {
        return this._destroy$;
    }

    private _isActive = false;
    private _isPressed = false;
    private _destroy$ = new Subject<boolean>();

    private get thumbPositionX() {
        const thumbBounderies = this.nativeElement.getBoundingClientRect();
        const thumbCenter = (thumbBounderies.right - thumbBounderies.left) / 2;
        return thumbBounderies.left + thumbCenter;
    }

    @HostListener('pointerenter')
    public onPointerEnter() {
        this.focused = false;
        this.hoverChange.emit(true);
    }

    @HostListener('pointerleave')
    public onPointerLeave() {
        this.hoverChange.emit(false);
    }

    @HostListener('keyup', ['$event'])
    public onKeyUp(event: KeyboardEvent) {
        event.stopPropagation();
        this.focused = true;
    }

    @HostListener('keydown', ['$event'])
    public onKeyDown(event: KeyboardEvent) {
        if (this.disabled) {
            return;
        }

        let increment = 0;
        const stepWithDir = (rtl: boolean) => rtl ? this.step * -1 : this.step;
        if (event.key.endsWith('Left')) {
            increment = stepWithDir(!this._dir.rtl);
        } else if (event.key.endsWith('Right')) {
            increment = stepWithDir(this._dir.rtl);
        } else {
            return;
        }

        this.thumbChange.emit();
        this.thumbValueChange.emit(increment);
    }

    @HostListener('blur')
    public onBlur() {
        this.isActive = false;
        this.zIndex = 0;
        this.focused = false;
        this.thumbBlur.emit();
    }

    @HostListener('focus')
    public onFocusListener() {
        this.isActive = true;
        this.zIndex = 1;
    }

    /**
     * @hidden
     */
    public ngOnInit() {
        this.onPan
            .pipe(takeUntil(this._destroy$))
            .subscribe(mouseX =>
                this.updateThumbValue(mouseX)
            );
    }

    /**
     * @hidden
     */
    public ngOnDestroy() {
        this._destroy$.next(true);
        this._destroy$.complete();
    }

    /**
     * Show thumb label and ripple.
     */
    public showThumbIndicators() {
        this.toggleThumbIndicators(true);
    }

    /**
     * Hide thumb label and ripple.
     */
    public hideThumbIndicators() {
        this.toggleThumbIndicators(false);
    }

    private updateThumbValue(mouseX: number) {
        const updateValue = this.calculateTrackUpdate(mouseX);
        if (this.isActive && updateValue !== 0) {
            this.thumbValueChange.emit(updateValue);
        }
    }

    private calculateTrackUpdate(mouseX: number): number {
        const scaleX = this._dir.rtl ? this.thumbPositionX - mouseX : mouseX - this.thumbPositionX;
        const stepDistanceCenter = this.stepDistance / 2;

        // If the thumb scale range (slider update) is less thàn a half step,
        // the position stays the same.
        const scaleXPositive = Math.abs(scaleX);
        if (scaleXPositive < stepDistanceCenter) {
            return 0;
        }

        return this.stepToProceed(scaleX, this.stepDistance);
    }

    private stepToProceed(scaleX, stepDist) {
        return Math.round(scaleX / stepDist) * this.step;
    }

    private toggleThumbIndicators(visible: boolean) {
        this._isPressed = visible;

        if (this.continuous || this.deactiveState) {
            this._isActive = false;
        } else {
            this._isActive = visible;
        }

    }
}
