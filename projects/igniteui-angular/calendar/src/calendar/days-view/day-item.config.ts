import { DateRangeDescriptor } from 'igniteui-angular/core';

export interface IDayItemConfig {
    disabledDates?: DateRangeDescriptor[];
    specialDates?: DateRangeDescriptor[];
    hideOutsideDays?: boolean;
    hideLeadingDays?: boolean;
    hideTrailingDays?: boolean;
    isLastInRange?: boolean;
    isFirstInRange?: boolean;
    isWithinRange?: boolean;
    isWithinPreviewRange?: boolean;
    isActive?: boolean;
}
