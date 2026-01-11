import { ElementRef } from '@angular/core';
import {
    DateRangeDescriptor,
    PickerCalendarOrientation,
    IgxOverlayOutletDirective,
    DatePartDeltas
} from 'igniteui-angular/core';
import { IFormattingViews, IFormattingOptions } from 'igniteui-angular/calendar';
import { IDatePickerResourceStrings } from 'igniteui-angular/core';

/**
 * Configuration for date picker settings
 */
export interface IDatePickerConfig {
    hideOutsideDays?: boolean;
    displayMonthsCount?: number;
    orientation?: PickerCalendarOrientation;
    showWeekNumbers?: boolean;
    activeDate?: Date;
    formatter?: (val: Date) => string;
    todayButtonLabel?: string;
    cancelButtonLabel?: string;
    spinLoop?: boolean;
    spinDelta?: Pick<DatePartDeltas, 'date' | 'month' | 'year'>;
    id?: string;
    formatViews?: IFormattingViews;
    disabledDates?: DateRangeDescriptor[];
    specialDates?: DateRangeDescriptor[];
    calendarFormat?: IFormattingOptions;
    value?: Date | string;
    minValue?: Date | string;
    maxValue?: Date | string;
    resourceStrings?: IDatePickerResourceStrings;
    readOnly?: boolean;
}
