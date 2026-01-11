import { Component, Input, TemplateRef, HostBinding } from '@angular/core';
import { TicksOrientation, TickLabelsOrientation } from '../slider.common';
import { NgClass, NgTemplateOutlet } from '@angular/common';
import { ITicksConfig, ITickLabelContext } from './ticks.config';

/**
 * @hidden
 */
@Component({
    selector: 'igx-ticks',
    templateUrl: 'ticks.component.html',
    imports: [NgClass, NgTemplateOutlet]
})
export class IgxTicksComponent {
    /**
     * Configuration object for ticks component
     */
    @Input()
    public set config(value: ITicksConfig) {
        if (value) {
            this._config = { ...value };
            if (value.primaryTicks !== undefined) {
                this._primaryTicks = value.primaryTicks;
            }
            if (value.secondaryTicks !== undefined) {
                this._secondaryTicks = value.secondaryTicks;
            }
            if (value.primaryTickLabels !== undefined) {
                this._primaryTickLabels = value.primaryTickLabels;
            }
            if (value.secondaryTickLabels !== undefined) {
                this._secondaryTickLabels = value.secondaryTickLabels;
            }
            if (value.ticksOrientation !== undefined) {
                this._ticksOrientation = value.ticksOrientation as TicksOrientation;
            }
            if (value.tickLabelsOrientation !== undefined) {
                this._tickLabelsOrientation = value.tickLabelsOrientation;
            }
            if (value.maxValue !== undefined) {
                this._maxValue = value.maxValue;
            }
            if (value.minValue !== undefined) {
                this._minValue = value.minValue;
            }
            if (value.labelsViewEnabled !== undefined) {
                this._labelsViewEnabled = value.labelsViewEnabled;
            }
            if (value.labels !== undefined) {
                this._labels = value.labels;
            }
            if (value.tickLabelTemplateRef !== undefined) {
                this._tickLabelTemplateRef = value.tickLabelTemplateRef;
            }
        }
    }

    public get config(): Readonly<ITicksConfig> {
        return this._config;
    }

    public get primaryTicks(): number {
        return this._primaryTicks ?? this._config?.primaryTicks;
    }

    public get secondaryTicks(): number {
        return this._secondaryTicks ?? this._config?.secondaryTicks;
    }

    public get primaryTickLabels(): boolean {
        return this._primaryTickLabels ?? this._config?.primaryTickLabels ?? false;
    }

    public get secondaryTickLabels(): boolean {
        return this._secondaryTickLabels ?? this._config?.secondaryTickLabels ?? false;
    }

    public get ticksOrientation(): TicksOrientation {
        return this._ticksOrientation ?? (this._config?.ticksOrientation as TicksOrientation);
    }

    public get tickLabelsOrientation(): TickLabelsOrientation {
        return this._tickLabelsOrientation ?? this._config?.tickLabelsOrientation;
    }

    public get maxValue(): number {
        return this._maxValue ?? this._config?.maxValue;
    }

    public get minValue(): number {
        return this._minValue ?? this._config?.minValue;
    }

    public get labelsViewEnabled(): boolean {
        return this._labelsViewEnabled ?? this._config?.labelsViewEnabled ?? false;
    }

    public get labels(): Array<number | string | boolean | null | undefined> {
        return this._labels ?? this._config?.labels;
    }

    public get tickLabelTemplateRef(): TemplateRef<ITickLabelContext> {
        return this._tickLabelTemplateRef ?? this._config?.tickLabelTemplateRef;
    }

    private _config: ITicksConfig = {};
    private _primaryTicks: number;
    private _secondaryTicks: number;
    private _primaryTickLabels: boolean;
    private _secondaryTickLabels: boolean;
    private _ticksOrientation: TicksOrientation;
    private _tickLabelsOrientation: TickLabelsOrientation;
    private _maxValue: number;
    private _minValue: number;
    private _labelsViewEnabled: boolean;
    private _labels: Array<number | string | boolean | null | undefined>;
    private _tickLabelTemplateRef: TemplateRef<ITickLabelContext>;

    /**
     * @hidden
     */
    @HostBinding('class.igx-slider__ticks')
    public ticksClass = true;

    /**
     * @hidden
     */
    @HostBinding('class.igx-slider__ticks--top')
    public get ticksTopClass() {
        return this.ticksOrientation === TicksOrientation.Top;
    }

    /**
     * @hidden
     */
    @HostBinding('class.igx-slider__ticks--tall')
    public get hasPrimaryClass() {
        return this.primaryTicks > 0;
    }

    /**
     * @hidden
     */
    @HostBinding('class.igx-slider__tick-labels--top-bottom')
    public get labelsTopToBottomClass() {
        return this.tickLabelsOrientation === TickLabelsOrientation.TopToBottom;
    }

    /**
     * @hidden
     */
    @HostBinding('class.igx-slider__tick-labels--bottom-top')
    public get labelsBottomToTopClass() {
        return this.tickLabelsOrientation === TickLabelsOrientation.BottomToTop;
    }

    /**
     * Returns the template context corresponding to
     * {@link IgxTickLabelTemplateDirective}
     *
     * ```typescript
     * return {
     *  $implicit //returns the value per each tick label.
     *  isPrimery //returns if the tick is primary.
     *  labels // returns the {@link labels} collection.
     *  index // returns the index per each tick of the whole sequence.
     * }
     * ```
     *
     * @param idx the index per each tick label.
     */
    public context(idx: number): ITickLabelContext {
        return {
            $implicit: this.tickLabel(idx),
            isPrimary: this.isPrimary(idx),
            labels: this.labels,
            index: idx
        };
    }

    /**
     * @hidden
     */
    public get ticksLength() {
        return this.primaryTicks > 0 ?
            ((this.primaryTicks - 1) * this.secondaryTicks) + this.primaryTicks :
            this.secondaryTicks > 0 ? this.secondaryTicks : 0;
    }

    public hiddenTickLabels(idx: number) {
        return this.isPrimary(idx) ? this.primaryTickLabels : this.secondaryTickLabels;
    }

    /**
     * @hidden
     */
    public isPrimary(idx: number) {
        return this.primaryTicks <= 0 ? false :
            idx % (this.secondaryTicks + 1) === 0;
    }

    /**
     * @hidden
     */
    public tickLabel(idx: number) {
        if (this.labelsViewEnabled) {
            return this.labels[idx];
        }

        const labelStep = (Math.max(this.minValue, this.maxValue) - Math.min(this.minValue, this.maxValue)) / (this.ticksLength - 1);
        const labelVal = labelStep * idx;

        return (this.minValue + labelVal).toFixed(2);
    }
}
