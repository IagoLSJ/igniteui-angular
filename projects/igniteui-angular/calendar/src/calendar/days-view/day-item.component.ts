import { Component, Input, Output, EventEmitter, HostBinding, ChangeDetectionStrategy } from '@angular/core';
import { CalendarSelection } from '../calendar';
import { areSameMonth, CalendarDay, isNextMonth, isPreviousMonth } from 'igniteui-angular/core';
import { IDayItemConfig } from './day-item.config';
import { DayItemHelpers } from './day-item.helpers';

/**
 * @hidden
 */
@Component({
    selector: 'igx-day-item',
    templateUrl: 'day-item.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: true
})
export class IgxDayItemComponent {
    @Input()
    public date: CalendarDay;

    @Input()
    public viewDate: Date;

    @Input()
    public selection: CalendarSelection;

    @Input()
    public get selected(): boolean {
        return this._selected;
    }

    public set selected(value: boolean) {
        this._selected = value;
    }

    @Input()
    public config: IDayItemConfig = {};

    private get effectiveDisabledDates(): IDayItemConfig['disabledDates'] {
        return this.config?.disabledDates;
    }

    private get effectiveSpecialDates(): IDayItemConfig['specialDates'] {
        return this.config?.specialDates;
    }

    private get effectiveHideLeadingDays(): boolean {
        return this.config?.hideLeadingDays ?? false;
    }

    private get effectiveHideTrailingDays(): boolean {
        return this.config?.hideTrailingDays ?? false;
    }

    private get effectiveIsLastInRange(): boolean {
        return this.config?.isLastInRange ?? false;
    }

    private get effectiveIsFirstInRange(): boolean {
        return this.config?.isFirstInRange ?? false;
    }

    private get effectiveIsWithinRange(): boolean {
        return this.config?.isWithinRange ?? false;
    }

    private get effectiveIsWithinPreviewRange(): boolean {
        return this.config?.isWithinPreviewRange ?? false;
    }

    private get effectiveIsActive(): boolean {
        return this.config?.isActive ?? false;
    }

    private get hideLeading(): boolean {
        return DayItemHelpers.getHideLeading(this.effectiveHideLeadingDays, this.isPreviousMonth);
    }

    private get hideTrailing(): boolean {
        return DayItemHelpers.getHideTrailing(this.effectiveHideTrailingDays, this.isNextMonth);
    }

    @Output()
    public dateSelection = new EventEmitter<CalendarDay>();

    @Output()
    public mouseEnter = new EventEmitter<void>();

    @Output()
    public mouseLeave = new EventEmitter<void>();

    @Output()
    public mouseDown = new EventEmitter<void>();

    public get isCurrentMonth(): boolean {
        return areSameMonth(this.date, this.viewDate);
    }

    public get isPreviousMonth(): boolean {
        return isPreviousMonth(this.date, this.viewDate);
    }

    public get isNextMonth(): boolean {
        return isNextMonth(this.date, this.viewDate);
    }

    @HostBinding('class.igx-days-view__date--active')
    public get isActive(): boolean {
        return this.effectiveIsActive;
    }

    @HostBinding('class.igx-days-view__date--last')
    public get isLastInRange(): boolean {
        return this.effectiveIsLastInRange;
    }

    @HostBinding('class.igx-days-view__date--first')
    public get isFirstInRange(): boolean {
        return this.effectiveIsFirstInRange;
    }

    @HostBinding('class.igx-days-view__date--selected')
    public get isSelectedCSS(): boolean {
        return DayItemHelpers.isSelectedCSS(
            this.selected,
            this.isDisabled,
            this.isInactive,
            this.effectiveIsWithinPreviewRange,
            this.effectiveIsWithinRange,
            this.selection
        );
    }

    @HostBinding('class.igx-days-view__date--inactive')
    public get isInactive(): boolean {
        return !this.isCurrentMonth;
    }

    @HostBinding('class.igx-days-view__date--hidden')
    public get isHidden(): boolean {
        return (this.hideLeading || this.hideTrailing) && this.isInactive;
    }

    @HostBinding('class.igx-days-view__date--current')
    public get isToday(): boolean {
        return !this.isInactive && this.date.equalTo(CalendarDay.today);
    }

    @HostBinding('class.igx-days-view__date--weekend')
    public get isWeekend(): boolean {
        return this.date.weekend;
    }

    public get isDisabled(): boolean {
        return DayItemHelpers.isDisabled(this.date, this.effectiveDisabledDates);
    }

    public get isFocusable(): boolean {
        return this.isCurrentMonth && !this.isHidden && !this.isDisabled;
    }

    protected onMouseEnter() {
        this.mouseEnter.emit();
    }

    protected onMouseLeave() {
        this.mouseLeave.emit();
    }

    protected onMouseDown(event: MouseEvent) {
        event.preventDefault();
        this.mouseDown.emit();
    }

    @HostBinding('class.igx-days-view__date--range')
    public get isWithinRangeCSS(): boolean {
        return !this.isSingleSelection && this.effectiveIsWithinRange;
    }

    @HostBinding('class.igx-days-view__date--range-preview')
    public get isWithinPreviewRangeCSS(): boolean {
        return !this.isSingleSelection && this.effectiveIsWithinPreviewRange;
    }

    @HostBinding('class.igx-days-view__date--special')
    public get isSpecial(): boolean {
        return DayItemHelpers.isSpecial(this.date, this.effectiveSpecialDates, this.isInactive);
    }

    @HostBinding('class.igx-days-view__date--disabled')
    public get isDisabledCSS(): boolean {
        return this.isHidden || this.isDisabled;
    }

    @HostBinding('class.igx-days-view__date--single')
    public get isSingleSelection(): boolean {
        return DayItemHelpers.isSingleSelection(this.selection);
    }

    private _selected = false;
}
