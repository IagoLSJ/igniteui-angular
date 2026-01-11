import { TemplateRef } from '@angular/core';
import { HammerInput } from 'igniteui-angular/core';
import { IgxSlideComponent } from './slide.component';

export interface ICarouselIndicatorTemplateContext {
    $implicit: IgxSlideComponent;
    slide: IgxSlideComponent;
}

export interface ICarouselButtonTemplateContext {
    $implicit: boolean;
    disabled: boolean;
}

export type CarouselIndicatorTemplate = TemplateRef<ICarouselIndicatorTemplateContext>;
export type CarouselButtonTemplate = TemplateRef<ICarouselButtonTemplateContext>;

export interface IPanEvent extends HammerInput {
    velocity?: number;
    isFinal?: boolean;
    target?: HTMLElement;
}

export interface ITapEvent {
    target?: HTMLElement;
    preventDefault?: () => void;
}
