import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

export enum StepperNavigationAction {
    Next = 'next',
    Prev = 'prev',
    NavigateTo = 'navigateTo'
}

export interface StepperNavigationEvent {
    action: StepperNavigationAction;
    index?: number;
}

@Injectable()
export class StepperCoordinatorService {
    private navigationSubject = new Subject<StepperNavigationEvent>();
    public navigation$ = this.navigationSubject.asObservable();

    public requestNext(): void {
        this.navigationSubject.next({ action: StepperNavigationAction.Next });
    }

    public requestPrev(): void {
        this.navigationSubject.next({ action: StepperNavigationAction.Prev });
    }

    public requestNavigateTo(index: number): void {
        this.navigationSubject.next({ action: StepperNavigationAction.NavigateTo, index });
    }
}
