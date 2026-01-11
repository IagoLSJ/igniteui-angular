import { TemplateRef } from '@angular/core';
import { TicksOrientation, TickLabelsOrientation } from '../slider.common';

/**
 * Template context for tick label
 */
export interface ITickLabelContext {
    $implicit: number | string | boolean | null | undefined;
    isPrimary: boolean;
    labels: Array<number | string | boolean | null | undefined>;
    index: number;
}

/**
 * Configuration for ticks component
 */
export interface ITicksConfig {
    primaryTicks?: number;
    secondaryTicks?: number;
    primaryTickLabels?: boolean;
    secondaryTickLabels?: boolean;
    ticksOrientation?: TicksOrientation | string;
    tickLabelsOrientation?: TickLabelsOrientation;
    maxValue?: number;
    minValue?: number;
    labelsViewEnabled?: boolean;
    labels?: Array<number | string | boolean | null | undefined>;
    tickLabelTemplateRef?: TemplateRef<ITickLabelContext>;
}
