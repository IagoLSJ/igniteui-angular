import { Directive, ElementRef, inject, AfterViewInit, OnDestroy } from '@angular/core';
import { StepperCoordinatorService, StepperNavigationAction } from './stepper-coordinator.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { DestroyRef } from '@angular/core';

interface IgcStepperWebComponent {
    navigateTo(index: number): void;
    next(): void;
    prev(): void;
}

@Directive({
    selector: 'igc-stepper[stepperCoordinator]',
    standalone: true
})
export class IgcStepperCoordinatorDirective implements AfterViewInit, OnDestroy {
    private coordinator = inject(StepperCoordinatorService);
    private destroyRef = inject(DestroyRef);
    
    private get stepper(): IgcStepperWebComponent {
        return (this.elementRef?.nativeElement as unknown as IgcStepperWebComponent);
    }

    constructor(private elementRef: ElementRef) {}

    public ngAfterViewInit(): void {
        this.coordinator.navigation$
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe(event => {
                const stepper = this.stepper;
                if (!stepper) return;

                switch (event.action) {
                    case StepperNavigationAction.Next:
                        stepper.next();
                        break;
                    case StepperNavigationAction.Prev:
                        stepper.prev();
                        break;
                    case StepperNavigationAction.NavigateTo:
                        if (event.index !== undefined) {
                            stepper.navigateTo(event.index);
                        }
                        break;
                }
            });
    }

    public ngOnDestroy(): void {
    }
}
