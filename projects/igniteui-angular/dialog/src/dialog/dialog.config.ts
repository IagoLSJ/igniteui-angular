import { IgxButtonType } from 'igniteui-angular/directives';
import { PositionSettings } from 'igniteui-angular/core';

export interface IgxDialogConfig {
    id?: string;
    isModal?: boolean;
    closeOnEscape?: boolean;
    focusTrap?: boolean;
    title?: string;
    message?: string;
    leftButtonLabel?: string;
    leftButtonType?: IgxButtonType;
    leftButtonRipple?: string;
    rightButtonLabel?: string;
    rightButtonType?: IgxButtonType;
    rightButtonRipple?: string;
    closeOnOutsideSelect?: boolean;
    positionSettings?: PositionSettings;
    isOpen?: boolean;
}