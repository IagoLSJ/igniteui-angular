import { TemplateRef } from '@angular/core';
import { Subject } from 'rxjs';
import { SliderHandle } from '../slider.common';

/**
 * Configuration for thumb slider component
 */
export interface IThumbSliderConfig {
    value?: any;
    continuous?: boolean;
    thumbLabelVisibilityDuration?: number;
    disabled?: boolean;
    onPan?: Subject<number>;
    stepDistance?: number;
    step?: number;
    templateRef?: TemplateRef<any>;
    context?: any;
    type?: SliderHandle;
    deactiveState?: boolean;
    min?: number;
    max?: number;
    labels?: any[];
}
