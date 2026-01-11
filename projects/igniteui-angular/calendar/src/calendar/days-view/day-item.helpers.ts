import { CalendarDay, DateRangeDescriptor, isDateInRanges } from 'igniteui-angular/core';
import { CalendarSelection } from '../calendar';

export class DayItemHelpers {
    public static isDisabled(date: CalendarDay, disabledDates?: DateRangeDescriptor[]): boolean {
        if (!disabledDates) {
            return false;
        }
        return isDateInRanges(date, disabledDates);
    }

    public static isSpecial(date: CalendarDay, specialDates?: DateRangeDescriptor[], isInactive?: boolean): boolean {
        if (!specialDates || isInactive) {
            return false;
        }
        return isDateInRanges(date, specialDates);
    }

    public static isSelectedCSS(
        selected: boolean,
        isDisabled: boolean,
        isInactive: boolean,
        isWithinPreviewRange: boolean,
        isWithinRange: boolean,
        selection: CalendarSelection
    ): boolean {
        const selectable =
            !isInactive || isWithinPreviewRange ||
            (isWithinRange && selection === CalendarSelection.RANGE);
        return !isDisabled && selectable && selected;
    }

    public static isSingleSelection(selection: CalendarSelection): boolean {
        return selection !== CalendarSelection.RANGE;
    }

    public static getHideLeading(hideLeadingDays: boolean, isPreviousMonth: boolean): boolean {
        return hideLeadingDays && isPreviousMonth;
    }

    public static getHideTrailing(hideTrailingDays: boolean, isNextMonth: boolean): boolean {
        return hideTrailingDays && isNextMonth;
    }
}
