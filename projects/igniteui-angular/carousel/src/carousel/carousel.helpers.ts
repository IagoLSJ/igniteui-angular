import { CarouselIndicatorsOrientation } from './enums';

export function getNextIndex(current: number, total: number): number {
    return (current + 1) % total;
}

export function getPrevIndex(current: number, total: number): number {
    return current - 1 < 0 ? total - 1 : current - 1;
}

export function getIndicatorsClass(indicatorsOrientation: CarouselIndicatorsOrientation | undefined): string {
    if (!indicatorsOrientation) {
        return CarouselIndicatorsOrientation.end;
    }
    switch (indicatorsOrientation) {
        case CarouselIndicatorsOrientation.top:
            return CarouselIndicatorsOrientation.start;
        case CarouselIndicatorsOrientation.bottom:
            return CarouselIndicatorsOrientation.end;
        default:
            return indicatorsOrientation;
    }
}
