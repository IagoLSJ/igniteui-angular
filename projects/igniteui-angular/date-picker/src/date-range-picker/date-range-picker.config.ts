import { DateRangeDescriptor, DateRange, PickerCalendarOrientation, CustomDateRange } from 'igniteui-angular/core';

/**
 * Configuration for calendar display settings
 */
export interface IDateRangePickerCalendarConfig {
    displayMonthsCount?: number;
    orientation?: PickerCalendarOrientation;
    hideOutsideDays?: boolean;
    showWeekNumbers?: boolean;
    specialDates?: DateRangeDescriptor[];
    disabledDates?: DateRangeDescriptor[];
    activeDate?: Date;
}

/**
 * Configuration for dialog buttons
 */
export interface IDateRangePickerButtonConfig {
    doneButtonText?: string;
    cancelButtonText?: string;
}

/**
 * Configuration for predefined and custom ranges
 */
export interface IDateRangePickerRangeConfig {
    usePredefinedRanges?: boolean;
    customRanges?: CustomDateRange[];
}

/**
 * Configuration for date validation
 */
export interface IDateRangePickerValidationConfig {
    minValue?: Date | string;
    maxValue?: Date | string;
}
