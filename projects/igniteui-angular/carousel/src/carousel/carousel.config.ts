import { CarouselAnimationType, CarouselIndicatorsOrientation } from './enums';

/**
 * Configuration for carousel component
 */
export interface ICarouselConfig {
    loop?: boolean;
    pause?: boolean;
    navigation?: boolean;
    indicators?: boolean;
    vertical?: boolean;
    gesturesSupport?: boolean;
    maximumIndicatorsCount?: number;
    indicatorsOrientation?: CarouselIndicatorsOrientation;
    animationType?: CarouselAnimationType;
}
