import { TemplateRef } from '@angular/core';
import { IChipResourceStrings } from 'igniteui-angular/core';

export type IgxChipTypeVariantConfig = 'primary' | 'info' | 'success' | 'warning' | 'danger' | null;

export interface IgxChipConfig {
    variant?: IgxChipTypeVariantConfig;
    id?: string;
    tabIndex?: number | null;
    data?: any;
    draggable?: boolean;
    animateOnRelease?: boolean;
    hideBaseOnDrag?: boolean;
    removable?: boolean;
    removeIcon?: TemplateRef<any>;
    selectable?: boolean;
    selectIcon?: TemplateRef<any>;
    class?: string;
    disabled?: boolean;
    selected?: boolean;
    color?: string;
    resourceStrings?: IChipResourceStrings;
}
