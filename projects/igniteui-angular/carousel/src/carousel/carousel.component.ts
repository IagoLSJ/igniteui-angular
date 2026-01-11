import { NgClass, NgTemplateOutlet } from '@angular/common';
import { AfterContentInit, Component, ContentChild, ContentChildren, ElementRef, EventEmitter, HostBinding, HostListener, Injectable, Input, IterableChangeRecord, IterableDiffer, IterableDiffers, OnDestroy, Output, QueryList, Renderer2, TemplateRef, ViewChild, ViewChildren, DOCUMENT, inject } from '@angular/core';
import { HammerGestureConfig, HAMMER_GESTURE_CONFIG } from '@angular/platform-browser';
import { merge, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { CarouselResourceStringsEN, ICarouselResourceStrings, ɵIgxDirectionality } from 'igniteui-angular/core';
import { first, IBaseEventArgs, last, PlatformUtil } from 'igniteui-angular/core';
import { CarouselAnimationDirection, IgxCarouselComponentBase } from './carousel-base';
import { IgxCarouselIndicatorDirective, IgxCarouselNextButtonDirective, IgxCarouselPrevButtonDirective } from './carousel.directives';
import { IgxSlideComponent } from './slide.component';
import { IgxIconComponent } from 'igniteui-angular/icon';
import { IgxButtonDirective } from 'igniteui-angular/directives';
import { getCurrentResourceStrings } from 'igniteui-angular/core';
import { HammerGesturesManager } from 'igniteui-angular/core';
import { CarouselAnimationType, CarouselIndicatorsOrientation } from './enums';
import { ICarouselConfig } from './carousel.config';
import { CarouselIndicatorTemplate, CarouselButtonTemplate, IPanEvent, ITapEvent, ICarouselIndicatorTemplateContext, ICarouselButtonTemplateContext } from './carousel.types';
import { getNextIndex, getPrevIndex, getIndicatorsClass } from './carousel.helpers';

let NEXT_ID = 0;


@Injectable()
export class CarouselHammerConfig extends HammerGestureConfig {
    public override overrides = {
        pan: { direction: HammerGesturesManager.Hammer?.DIRECTION_HORIZONTAL }
    };
}
/**
 * **Ignite UI for Angular Carousel** -
 * [Documentation](https://www.infragistics.com/products/ignite-ui-angular/angular/components/carousel.html)
 *
 * The Ignite UI Carousel is used to browse or navigate through a collection of slides. Slides can contain custom
 * content such as images or cards and be used for things such as on-boarding tutorials or page-based interfaces.
 * It can be used as a separate fullscreen element or inside another component.
 *
 * Example:
 * ```html
 * <igx-carousel>
 *   <igx-slide>
 *     <h3>First Slide Header</h3>
 *     <p>First slide Content</p>
 *   <igx-slide>
 *   <igx-slide>
 *     <h3>Second Slide Header</h3>
 *     <p>Second Slide Content</p>
 * </igx-carousel>
 * ```
 */
@Component({
    providers: [
        {
            provide: HAMMER_GESTURE_CONFIG,
            useClass: CarouselHammerConfig
        }
    ],
    selector: 'igx-carousel',
    templateUrl: 'carousel.component.html',
    styles: [`
    :host {
        display: block;
        outline-style: none;
    }`],
    imports: [IgxButtonDirective, IgxIconComponent, NgClass, NgTemplateOutlet]
})
export class IgxCarouselComponent extends IgxCarouselComponentBase implements OnDestroy, AfterContentInit {
    private element = inject(ElementRef<HTMLElement>);
    private renderer = inject(Renderer2);
    private iterableDiffers = inject(IterableDiffers);
    private platformUtil = inject(PlatformUtil);
    private dir = inject(ɵIgxDirectionality);
    private document = inject(DOCUMENT);


    /**
     * Sets the `id` of the carousel.
     * If not set, the `id` of the first carousel component will be `"igx-carousel-0"`.
     * ```html
     * <igx-carousel id="my-first-carousel"></igx-carousel>
     * ```
     *
     * @memberof IgxCarouselComponent
     */
    @HostBinding('attr.id')
    @Input()
    public id = `igx-carousel-${NEXT_ID++}`;
    /**
     * Returns the `role` attribute of the carousel.
     * ```typescript
     * let carouselRole =  this.carousel.role;
     * ```
     *
     * @memberof IgxCarouselComponent
     */
    @HostBinding('attr.role') public role = 'region';

    /** @hidden */
    @HostBinding('attr.aria-roledescription')
    public roleDescription = 'carousel';

    /** @hidden */
    @HostBinding('attr.aria-labelledby')
    public get labelId() {
        return this.showIndicatorsLabel ? `${this.id}-label` : null;
    }

    /** @hidden */
    @HostBinding('class.igx-carousel--vertical')
	public get isVertical(): boolean {
		const configValue = this._vertical ?? this._config?.vertical;
		if (configValue !== undefined) {
			this.vertical = configValue;
			return configValue;
		}
		return this.vertical ?? false;
	}

    /**
     * Returns the class of the carousel component.
     * ```typescript
     * let class =  this.carousel.cssClass;
     * ```
     *
     * @memberof IgxCarouselComponent
     */
    @HostBinding('class.igx-carousel')
    public cssClass = 'igx-carousel';

    /**
     * Gets the `touch-action` style of the `list item`.
     * ```typescript
     * let touchAction = this.listItem.touchAction;
     * ```
     */
    @HostBinding('style.touch-action')
    public get touchAction() {
        return this.gesturesSupport ? 'pan-y' : 'auto';
    }

    /**
     * Configuration object for carousel component
     * 
     * @example
     * ```html
     * <igx-carousel [config]="{ loop: false, navigation: true }"></igx-carousel>
     * ```
     */
    @Input()
    public set config(value: ICarouselConfig) {
        if (value) {
            this._config = { ...value };
            if (value.loop !== undefined) {
                this._loop = value.loop;
            }
            if (value.pause !== undefined) {
                this._pause = value.pause;
            }
            if (value.navigation !== undefined) {
                this._navigation = value.navigation;
            }
            if (value.indicators !== undefined) {
                this._indicatorsConfig = value.indicators;
            }
            if (value.vertical !== undefined) {
                this._vertical = value.vertical;
                this.vertical = value.vertical;
            }
            if (value.gesturesSupport !== undefined) {
                this._gesturesSupport = value.gesturesSupport;
            }
            if (value.maximumIndicatorsCount !== undefined) {
                this._maximumIndicatorsCount = value.maximumIndicatorsCount;
            }
            if (value.indicatorsOrientation !== undefined) {
                this._indicatorsOrientation = value.indicatorsOrientation;
            }
            if (value.animationType !== undefined) {
                this._animationType = value.animationType;
                this.animationType = value.animationType;
            }
        }
    }

    public get config(): Readonly<ICarouselConfig> {
        return this._config;
    }

    public get loop(): boolean {
        return this._loop ?? this._config?.loop ?? true;
    }

    /**
     * @hidden
     * @internal
     */
    public set loop(value: boolean) {
        this._loop = value;
        if (!this._config) {
            this._config = {};
        }
        this._config.loop = value;
    }

    public get pause(): boolean {
        return this._pause ?? this._config?.pause ?? true;
    }

    /**
     * @hidden
     * @internal
     */
    public set pause(value: boolean) {
        this._pause = value;
        if (!this._config) {
            this._config = {};
        }
        this._config.pause = value;
    }

    public get navigation(): boolean {
        return this._navigation ?? this._config?.navigation ?? true;
    }

    /**
     * @hidden
     * @internal
     */
    public set navigation(value: boolean) {
        this._navigation = value;
        if (!this._config) {
            this._config = {};
        }
        this._config.navigation = value;
    }

    public get indicators(): boolean {
        return this._indicatorsConfig ?? this._config?.indicators ?? true;
    }

    /**
     * @hidden
     * @internal
     */
    public set indicators(value: boolean) {
        this._indicatorsConfig = value;
        if (!this._config) {
            this._config = {};
        }
        this._config.indicators = value;
    }


    public get gesturesSupport(): boolean {
        return this._gesturesSupport ?? this._config?.gesturesSupport ?? true;
    }

    /**
     * @hidden
     * @internal
     */
    public set gesturesSupport(value: boolean) {
        this._gesturesSupport = value;
        if (!this._config) {
            this._config = {};
        }
        this._config.gesturesSupport = value;
    }

    public get maximumIndicatorsCount(): number {
        return this._maximumIndicatorsCount ?? this._config?.maximumIndicatorsCount ?? 10;
    }

    /**
     * @hidden
     * @internal
     */
    public set maximumIndicatorsCount(value: number) {
        this._maximumIndicatorsCount = value;
        if (!this._config) {
            this._config = {};
        }
        this._config.maximumIndicatorsCount = value;
    }

    public get indicatorsOrientation(): CarouselIndicatorsOrientation {
        return this._indicatorsOrientation ?? this._config?.indicatorsOrientation ?? CarouselIndicatorsOrientation.end;
    }

    /**
     * @hidden
     * @internal
     */
    public set indicatorsOrientation(value: CarouselIndicatorsOrientation) {
        this._indicatorsOrientation = value;
        if (!this._config) {
            this._config = {};
        }
        this._config.indicatorsOrientation = value;
    }


    /**
     * The custom template, if any, that should be used when rendering carousel indicators
     *
     * ```typescript
     * // Set in typescript
     * const myCustomTemplate: TemplateRef<ICarouselIndicatorTemplateContext> = myComponent.customTemplate;
     * myComponent.carousel.indicatorTemplate = myCustomTemplate;
     * ```
     * ```html
     * <!-- Set in markup -->
     *  <igx-carousel #carousel>
     *      ...
     *      <ng-template igxCarouselIndicator let-slide>
     *         <igx-icon *ngIf="slide.active">brightness_7</igx-icon>
     *         <igx-icon *ngIf="!slide.active">brightness_5</igx-icon>
     *      </ng-template>
     *  </igx-carousel>
     * ```
     */
    @ContentChild(IgxCarouselIndicatorDirective, { read: TemplateRef, static: false })
    public indicatorTemplate: CarouselIndicatorTemplate | null = null;

    /**
     * The custom template, if any, that should be used when rendering carousel next button
     *
     * ```typescript
     * // Set in typescript
     * const myCustomTemplate: TemplateRef<ICarouselButtonTemplateContext> = myComponent.customTemplate;
     * myComponent.carousel.nextButtonTemplate = myCustomTemplate;
     * ```
     * ```html
     * <!-- Set in markup -->
     *  <igx-carousel #carousel>
     *      ...
     *      <ng-template igxCarouselNextButton let-disabled>
     *          <button type="button" igxButton="fab" igxRipple="white" [disabled]="disabled">
     *              <igx-icon name="add"></igx-icon>
     *          </button>
     *      </ng-template>
     *  </igx-carousel>
     * ```
     */
    @ContentChild(IgxCarouselNextButtonDirective, { read: TemplateRef, static: false })
    public nextButtonTemplate: CarouselButtonTemplate | null = null;

    /**
     * The custom template, if any, that should be used when rendering carousel previous button
     *
     * ```typescript
     * // Set in typescript
     * const myCustomTemplate: TemplateRef<ICarouselButtonTemplateContext> = myComponent.customTemplate;
     * myComponent.carousel.prevButtonTemplate = myCustomTemplate;
     * ```
     * ```html
     * <!-- Set in markup -->
     *  <igx-carousel #carousel>
     *      ...
     *      <ng-template igxCarouselPrevButton let-disabled>
     *          <button type="button" igxButton="fab" igxRipple="white" [disabled]="disabled">
     *              <igx-icon name="remove"></igx-icon>
     *          </button>
     *      </ng-template>
     *  </igx-carousel>
     * ```
     */
    @ContentChild(IgxCarouselPrevButtonDirective, { read: TemplateRef, static: false })
    public prevButtonTemplate: CarouselButtonTemplate | null = null;

    /**
     * The collection of `slides` currently in the carousel.
     * ```typescript
     * let slides: QueryList<IgxSlideComponent> = this.carousel.slides;
     * ```
     *
     * @memberOf IgxCarouselComponent
     */
    @ContentChildren(IgxSlideComponent)
    public slides: QueryList<IgxSlideComponent>;

    /**
     * An event that is emitted after a slide transition has happened.
     * Provides references to the `IgxCarouselComponent` and `IgxSlideComponent` as event arguments.
     * ```html
     * <igx-carousel (slideChanged)="slideChanged($event)"></igx-carousel>
     * ```
     *
     * @memberOf IgxCarouselComponent
     */
    @Output() public slideChanged = new EventEmitter<ISlideEventArgs>();

    /**
     * An event that is emitted after a slide has been added to the carousel.
     * Provides references to the `IgxCarouselComponent` and `IgxSlideComponent` as event arguments.
     * ```html
     * <igx-carousel (slideAdded)="slideAdded($event)"></igx-carousel>
     * ```
     *
     * @memberOf IgxCarouselComponent
     */
    @Output() public slideAdded = new EventEmitter<ISlideEventArgs>();

    /**
     * An event that is emitted after a slide has been removed from the carousel.
     * Provides references to the `IgxCarouselComponent` and `IgxSlideComponent` as event arguments.
     * ```html
     * <igx-carousel (slideRemoved)="slideRemoved($event)"></igx-carousel>
     * ```
     *
     * @memberOf IgxCarouselComponent
     */
    @Output() public slideRemoved = new EventEmitter<ISlideEventArgs>();

    /**
     * An event that is emitted after the carousel has been paused.
     * Provides a reference to the `IgxCarouselComponent` as an event argument.
     * ```html
     * <igx-carousel (carouselPaused)="carouselPaused($event)"></igx-carousel>
     * ```
     *
     * @memberOf IgxCarouselComponent
     */
    @Output() public carouselPaused = new EventEmitter<IgxCarouselComponent>();

    /**
     * An event that is emitted after the carousel has resumed transitioning between `slides`.
     * Provides a reference to the `IgxCarouselComponent` as an event argument.
     * ```html
     * <igx-carousel (carouselPlaying)="carouselPlaying($event)"></igx-carousel>
     * ```
     *
     * @memberOf IgxCarouselComponent
     */
    @Output() public carouselPlaying = new EventEmitter<IgxCarouselComponent>();

    @ViewChild('defaultIndicator', { read: TemplateRef, static: true })
    private defaultIndicator: CarouselIndicatorTemplate;

    @ViewChild('defaultNextButton', { read: TemplateRef, static: true })
    private defaultNextButton: CarouselButtonTemplate;

    @ViewChild('defaultPrevButton', { read: TemplateRef, static: true })
    private defaultPrevButton: CarouselButtonTemplate;

    @ViewChildren('indicators', { read: ElementRef })
    private _indicators: QueryList<ElementRef<HTMLDivElement>>;

    /**
     * @hidden
     * @internal
     */
    public stoppedByInteraction: boolean;
    protected override currentItem: IgxSlideComponent;
    protected override previousItem: IgxSlideComponent;
    private _interval: number;
    private _resourceStrings = getCurrentResourceStrings(CarouselResourceStringsEN);
    private lastInterval: ReturnType<typeof setInterval> | null = null;
    private playing: boolean;
    private destroyed: boolean;
    private destroy$ = new Subject<void>();
    private differ: IterableDiffer<IgxSlideComponent> | null = null;
    private incomingSlide: IgxSlideComponent | null = null;
    private _hasKeyboardFocusOnIndicators = false;
    private _config: ICarouselConfig = {};
    private _loop: boolean | undefined;
    private _pause: boolean | undefined;
    private _navigation: boolean | undefined;
    private _indicatorsConfig: boolean | undefined;
    private _vertical: boolean | undefined;
    private _gesturesSupport: boolean | undefined;
    private _maximumIndicatorsCount: number | undefined;
    private _indicatorsOrientation: CarouselIndicatorsOrientation | undefined;
    private _animationType: CarouselAnimationType | undefined;

    /**
     * An accessor that sets the resource strings.
     * By default it uses EN resources.
     */
    @Input()
    public set resourceStrings(value: ICarouselResourceStrings) {
        this._resourceStrings = Object.assign({}, this._resourceStrings, value);
    }

    /**
     * An accessor that returns the resource strings.
     */
    public get resourceStrings(): ICarouselResourceStrings {
        return this._resourceStrings;
    }

    /** @hidden */
    public get getIndicatorTemplate(): CarouselIndicatorTemplate {
        if (this.indicatorTemplate) {
            return this.indicatorTemplate;
        }
        return this.defaultIndicator;
    }

    /** @hidden */
    public get getNextButtonTemplate(): CarouselButtonTemplate {
        if (this.nextButtonTemplate) {
            return this.nextButtonTemplate;
        }

        return this.defaultNextButton
    }

    /** @hidden */
    public get getPrevButtonTemplate(): CarouselButtonTemplate {
        if (this.prevButtonTemplate) {
            return this.prevButtonTemplate;
        }

        return this.defaultPrevButton
    }

    /** @hidden */
    public get indicatorsClass() {
        return {
            ['igx-carousel-indicators--focused']: this._hasKeyboardFocusOnIndicators,
            [`igx-carousel-indicators--${getIndicatorsClass(this.indicatorsOrientation)}`]: true
        };
    }

    /** @hidden */
    public get showIndicators(): boolean {
        return this.indicators && this.total <= this.maximumIndicatorsCount && this.total > 0;
    }

    /** @hidden */
    public get showIndicatorsLabel(): boolean {
        return this.indicators && this.total > this.maximumIndicatorsCount;
    }

    /** @hidden */
    public get getCarouselLabel() {
        return `${this.current + 1} ${this.resourceStrings.igx_carousel_of} ${this.total}`;
    }

    /**
     * Returns the total number of `slides` in the carousel.
     * ```typescript
     * let slideCount =  this.carousel.total;
     * ```
     *
     * @memberOf IgxCarouselComponent
     */
    public get total(): number {
        return this.slides?.length;
    }

    /**
     * The index of the slide being currently shown.
     * ```typescript
     * let currentSlideNumber =  this.carousel.current;
     * ```
     *
     * @memberOf IgxCarouselComponent
     */
    public get current(): number {
        return !this.currentItem ? 0 : this.currentItem.index;
    }

    /**
     * Returns a boolean indicating if the carousel is playing.
     * ```typescript
     * let isPlaying =  this.carousel.isPlaying;
     * ```
     *
     * @memberOf IgxCarouselComponent
     */
    public get isPlaying(): boolean {
        return this.playing;
    }

    /**
     * Returns а boolean indicating if the carousel is destroyed.
     * ```typescript
     * let isDestroyed =  this.carousel.isDestroyed;
     * ```
     *
     * @memberOf IgxCarouselComponent
     */
    public get isDestroyed(): boolean {
        return this.destroyed;
    }
    /**
     * Returns a reference to the carousel element in the DOM.
     * ```typescript
     * let nativeElement =  this.carousel.nativeElement;
     * ```
     *
     * @memberof IgxCarouselComponent
     */
    public get nativeElement(): HTMLElement {
        return this.element.nativeElement;
    }

    /**
     * Returns the time `interval` in milliseconds before the slide changes.
     * ```typescript
     * let timeInterval = this.carousel.interval;
     * ```
     *
     * @memberof IgxCarouselComponent
     */
    @Input()
    public get interval(): number {
        return this._interval;
    }

    /**
     * Sets the time `interval` in milliseconds before the slide changes.
     * If not set, the carousel will not change `slides` automatically.
     * ```html
     * <igx-carousel [interval]="1000"></igx-carousel>
     * ```
     *
     * @memberof IgxCarouselComponent
     */
    public set interval(value: number) {
        this._interval = +value;
        this.restartInterval();
    }

    constructor() {
        super();
        this.differ = this.iterableDiffers.find([]).create(null);
    }

    /** @hidden */
    @HostListener('tap', ['$event'])
    public onTap(event: Event) {
        const tapEvent = event as unknown as ITapEvent;
        // play pause only when tap on slide
        if (tapEvent.target && this.hasClass(tapEvent.target, 'igx-slide')) {
            if (this.isPlaying) {
                if (this.pause) {
                    this.stoppedByInteraction = true;
                }
                this.stop();
            } else if (this.stoppedByInteraction) {
                this.play();
            }
        }
    }

    /** @hidden */
    @HostListener('mouseenter')
    public onMouseEnter() {
        if (this.pause && this.isPlaying) {
            this.stoppedByInteraction = true;
        }
        this.stop();
    }

    /** @hidden */
    @HostListener('mouseleave')
    public onMouseLeave() {
        if (this.stoppedByInteraction) {
            this.play();
        }
    }

    /** @hidden */
    @HostListener('panleft', ['$event'])
    public onPanLeft(event: Event) {
        if (!this.vertical) {
            this.pan(event as unknown as IPanEvent);
        }
    }

    /** @hidden */
    @HostListener('panright', ['$event'])
    public onPanRight(event: Event) {
        if (!this.vertical) {
            this.pan(event as unknown as IPanEvent);
        }
    }

    /** @hidden */
    @HostListener('panup', ['$event'])
    public onPanUp(event: Event) {
        if (this.vertical) {
            this.pan(event as unknown as IPanEvent);
        }
    }

    /** @hidden */
    @HostListener('pandown', ['$event'])
    public onPanDown(event: Event) {
        if (this.vertical) {
            this.pan(event as unknown as IPanEvent);
        }
    }

    /**
     * @hidden
     */
    @HostListener('panend', ['$event'])
    public onPanEnd(event: Event) {
        const panEvent = event as unknown as IPanEvent;
        if (!this.gesturesSupport) {
            return;
        }
        panEvent.preventDefault();

        const slideSize = this.getSlideSize(this.currentItem);
        const panOffset = (slideSize / 1000);
        const eventDelta = this.vertical ? panEvent.deltaY : panEvent.deltaX;
        const delta = Math.abs(eventDelta) + panOffset < slideSize ? Math.abs(eventDelta) : slideSize - panOffset;
        const velocity = panEvent.velocity !== undefined ? Math.abs(panEvent.velocity) : 0;
        this.resetSlideStyles(this.currentItem);
        if (this.incomingSlide) {
            this.resetSlideStyles(this.incomingSlide);
            if (slideSize / 2 < delta || velocity > 1) {
                this.incomingSlide.direction = eventDelta < 0 ? CarouselAnimationDirection.NEXT : CarouselAnimationDirection.PREV;
                this.incomingSlide.previous = false;

                this.animationPosition = this.animationType === CarouselAnimationType.fade ?
                    delta / slideSize : (slideSize - delta) / slideSize;

                if (velocity > 1) {
                    this.newDuration = this.defaultAnimationDuration / velocity;
                }
                this.incomingSlide.active = true;
            } else {
                this.currentItem.direction = eventDelta > 0 ? CarouselAnimationDirection.NEXT : CarouselAnimationDirection.PREV;
                this.previousItem = this.incomingSlide;
                this.previousItem.previous = true;
                this.animationPosition = this.animationType === CarouselAnimationType.fade ?
                    Math.abs((slideSize - delta) / slideSize) : delta / slideSize;
                this.playAnimations();
            }
        }

        if (this.stoppedByInteraction) {
            this.play();
        }
    }

    /** @hidden */
    public ngAfterContentInit() {
        this.slides.changes
            .pipe(takeUntil(this.destroy$))
            .subscribe((change: QueryList<IgxSlideComponent>) => this.initSlides(change));

        this.initSlides(this.slides);
    }

    /** @hidden */
    public override ngOnDestroy() {
        super.ngOnDestroy();
        this.destroy$.next();
        this.destroy$.complete();
        this.destroyed = true;
        if (this.lastInterval) {
            clearInterval(this.lastInterval);
        }
    }

    /** @hidden */
    public handleKeydownPrev(event: KeyboardEvent): void {
        if (this.platformUtil.isActivationKey(event)) {
            event.preventDefault();
            this.prev();
        }
    }

    /** @hidden */
    public handleKeydownNext(event: KeyboardEvent): void {
        if (this.platformUtil.isActivationKey(event)) {
            event.preventDefault();
            this.next();
        }
    }

    /** @hidden */
    public handleKeyUp(event: KeyboardEvent): void {
        if (event.key === this.platformUtil.KEYMAP.TAB) {
            this._hasKeyboardFocusOnIndicators = true;
        }
    }

    /** @hidden */
    public handleFocusOut(event: FocusEvent): void {
        const target = event.relatedTarget as HTMLElement;

        if (!target || !this.hasClass(target, 'igx-carousel-indicators__indicator')) {
            this._hasKeyboardFocusOnIndicators = false;
        }
    }

    /** @hidden */
    public handleClick(): void {
        this._hasKeyboardFocusOnIndicators = false;
    }

    /** @hidden */
    public handleKeydown(event: KeyboardEvent): void {
        const { key } = event;
        const slides = this.slides.toArray();

        switch (key) {
            case this.platformUtil.KEYMAP.ARROW_LEFT:
                this.dir.rtl ? this.next() : this.prev();
                break;
            case this.platformUtil.KEYMAP.ARROW_RIGHT:
                this.dir.rtl ? this.prev() : this.next();
                break;
            case this.platformUtil.KEYMAP.HOME:
                event.preventDefault();
                this.select(this.dir.rtl ? last(slides) : first(slides));
                break;
            case this.platformUtil.KEYMAP.END:
                event.preventDefault();
                this.select(this.dir.rtl ? first(slides) : last(slides));
                break;
        }

        const indicatorElement = this.indicatorsElements[this.current]?.nativeElement;
        if (indicatorElement) {
            this.focusElement(indicatorElement);
        }
    }

    /**
     * Returns the slide corresponding to the provided `index` or null.
     * ```typescript
     * let slide1 =  this.carousel.get(1);
     * ```
     *
     * @memberOf IgxCarouselComponent
     */
    public get(index: number): IgxSlideComponent {
        return this.slides.find((slide) => slide.index === index);
    }

    /**
     * Adds a new slide to the carousel.
     * ```typescript
     * this.carousel.add(newSlide);
     * ```
     *
     * @memberOf IgxCarouselComponent
     */
    public add(slide: IgxSlideComponent) {
        const newSlides = this.slides.toArray();
        newSlides.push(slide);
        this.slides.reset(newSlides);
        this.slides.notifyOnChanges();
    }

    /**
     * Removes a slide from the carousel.
     * ```typescript
     * this.carousel.remove(slide);
     * ```
     *
     * @memberOf IgxCarouselComponent
     */
    public remove(slide: IgxSlideComponent) {
        if (slide && slide === this.get(slide.index)) { // check if the requested slide for delete is present in the carousel
            const newSlides = this.slides.toArray();
            newSlides.splice(slide.index, 1);
            this.slides.reset(newSlides);
            this.slides.notifyOnChanges();
        }
    }

    /**
     * Switches to the passed-in slide with a given `direction`.
     * ```typescript
     * const slide = this.carousel.get(2);
     * this.carousel.select(slide, CarouselAnimationDirection.NEXT);
     * ```
     *
     * @memberOf IgxCarouselComponent
     */
    public select(slide: IgxSlideComponent, direction?: CarouselAnimationDirection): void;
    /**
     * Switches to slide by index with a given `direction`.
     * ```typescript
     * this.carousel.select(2, CarouselAnimationDirection.NEXT);
     * ```
     *
     * @memberOf IgxCarouselComponent
     */
    public select(index: number, direction?: CarouselAnimationDirection): void;
    public select(slideOrIndex: IgxSlideComponent | number, direction: CarouselAnimationDirection = CarouselAnimationDirection.NONE): void {
        const slide = typeof slideOrIndex === 'number'
            ? this.get(slideOrIndex)
            : slideOrIndex;

        if (slide && slide !== this.currentItem) {
            slide.direction = direction;
            slide.active = true;
        }
    }

    /**
     * Transitions to the next slide in the carousel.
     * ```typescript
     * this.carousel.next();
     * ```
     *
     * @memberOf IgxCarouselComponent
     */
    public next() {
        const index = this.getNextIndex();

        if (index === 0 && !this.loop) {
            this.stop();
            return;
        }
        return this.select(this.get(index), CarouselAnimationDirection.NEXT);
    }

    /**
     * Transitions to the previous slide in the carousel.
     * ```typescript
     * this.carousel.prev();
     * ```
     *
     * @memberOf IgxCarouselComponent
     */
    public prev() {
        const index = this.getPrevIndex();

        if (!this.loop && index === this.total - 1) {
            this.stop();
            return;
        }
        return this.select(this.get(index), CarouselAnimationDirection.PREV);
    }

    /**
     * Resumes playing of the carousel if in paused state.
     * No operation otherwise.
     * ```typescript
     * this.carousel.play();
     * }
     * ```
     *
     * @memberOf IgxCarouselComponent
     */
    public play() {
        if (!this.playing) {
            this.playing = true;
            this.carouselPlaying.emit(this);
            this.restartInterval();
            this.stoppedByInteraction = false;
        }
    }

    /**
     * Stops slide transitions if the `pause` option is set to `true`.
     * No operation otherwise.
     * ```typescript
     *  this.carousel.stop();
     * }
     * ```
     *
     * @memberOf IgxCarouselComponent
     */
    public stop() {
        if (this.pause) {
            this.playing = false;
            this.carouselPaused.emit(this);
            this.resetInterval();
        }
    }

    protected getPreviousElement(): HTMLElement {
        return this.previousItem.nativeElement;
    }

    protected getCurrentElement(): HTMLElement {
        return this.currentItem.nativeElement;
    }

    private resetInterval() {
        if (this.lastInterval) {
            clearInterval(this.lastInterval);
            this.lastInterval = null;
        }
    }

    private restartInterval() {
        this.resetInterval();

        if (!isNaN(this.interval) && this.interval > 0 && this.platformUtil.isBrowser) {
            this.lastInterval = setInterval(() => {
                const tick = +this.interval;
                if (this.playing && this.total && !isNaN(tick) && tick > 0) {
                    this.next();
                } else {
                    this.stop();
                }
            }, this.interval) as ReturnType<typeof setInterval>;
        }
    }

    /** @hidden */
    public get nextButtonDisabled() {
        return !this.loop && this.current === (this.total - 1);
    }

    /** @hidden */
    public get prevButtonDisabled() {
        return !this.loop && this.current === 0;
    }

    private get indicatorsElements() {
        return this._indicators.toArray();
    }

    private getNextIndex(): number {
        return getNextIndex(this.current, this.total);
    }

    private getPrevIndex(): number {
        return getPrevIndex(this.current, this.total);
    }

    private resetSlideStyles(slide: IgxSlideComponent) {
        const element = slide.nativeElement;
        this.renderer.setStyle(element, 'transform', '');
        this.renderer.setStyle(element, 'opacity', '');
    }

    private hasClass(element: HTMLElement, className: string): boolean {
        return element && element.classList && element.classList.contains(className);
    }

    private focusElement(element: HTMLElement): void {
        if (element && typeof element.focus === 'function') {
            element.focus();
        }
    }

    private getSlideSize(slide: IgxSlideComponent): number {
        const element = slide.nativeElement;
        if (!element) {
            return 0;
        }
        return this.vertical ? element.offsetHeight : element.offsetWidth;
    }

    private pan(event: IPanEvent) {
        const slideSize = this.getSlideSize(this.currentItem);
        const panOffset = (slideSize / 1000);
        const delta = this.vertical ? event.deltaY : event.deltaX;
        const index = delta < 0 ? this.getNextIndex() : this.getPrevIndex();
        const offset = delta < 0 ? slideSize + delta : -slideSize + delta;

        if (!this.gesturesSupport || event.isFinal || Math.abs(delta) + panOffset >= slideSize) {
            return;
        }

        if (!this.loop && ((this.current === 0 && delta > 0) || (this.current === this.total - 1 && delta < 0))) {
            this.incomingSlide = null;
            return;
        }

        event.preventDefault();
        if (this.isPlaying) {
            this.stoppedByInteraction = true;
            this.stop();
        }

        if (this.previousItem && this.previousItem.previous) {
            this.previousItem.previous = false;
        }
        this.finishAnimations();

        if (this.incomingSlide) {
            if (index !== this.incomingSlide.index) {
                this.resetSlideStyles(this.incomingSlide);
                this.incomingSlide.previous = false;
                this.incomingSlide = this.get(index);
            }
        } else {
            this.incomingSlide = this.get(index);
        }
        this.incomingSlide.previous = true;

        if (this.animationType === CarouselAnimationType.fade) {
            this.renderer.setStyle(this.currentItem.nativeElement, 'opacity', `${Math.abs(offset) / slideSize}`);
        } else {
            const currentTransform = this.vertical
                ? `translateY(${delta}px)`
                : `translateX(${delta}px)`;
            const incomingTransform = this.vertical
                ? `translateY(${offset}px)`
                : `translateX(${offset}px)`;
            this.renderer.setStyle(this.currentItem.nativeElement, 'transform', currentTransform);
            if (this.incomingSlide) {
                this.renderer.setStyle(this.incomingSlide.nativeElement, 'transform', incomingTransform);
            }
        }
    }

    private unsubscriber(slide: IgxSlideComponent) {
        return merge(this.destroy$, slide.isDestroyed);
    }

    private onSlideActivated(slide: IgxSlideComponent) {
        if (slide.active && slide !== this.currentItem) {
            if (slide.direction === CarouselAnimationDirection.NONE) {
                const newIndex = slide.index;
                slide.direction = newIndex > this.current ? CarouselAnimationDirection.NEXT : CarouselAnimationDirection.PREV;
            }

            if (this.currentItem) {
                if (this.previousItem && this.previousItem.previous) {
                    this.previousItem.previous = false;
                }
                this.currentItem.direction = slide.direction;
                this.currentItem.active = false;

                this.previousItem = this.currentItem;
                this.currentItem = slide;
                this.triggerAnimations();
            } else {
                this.currentItem = slide;
            }
            this.slideChanged.emit({ carousel: this, slide });
            this.restartInterval();
            this.cdr.markForCheck();
        }
    }


    private finishAnimations() {
        if (this.animationStarted(this.leaveAnimationPlayer)) {
            this.leaveAnimationPlayer.finish();
        }

        if (this.animationStarted(this.enterAnimationPlayer)) {
            this.enterAnimationPlayer.finish();
        }
    }

    private initSlides(change: QueryList<IgxSlideComponent>) {
        const diff = this.differ.diff(change.toArray());
        if (diff) {
            this.slides.reduce((_acc: number, c: IgxSlideComponent, ind: number) => {
                c.index = ind;
                return ind;
            }, 0);
            diff.forEachAddedItem((record: IterableChangeRecord<IgxSlideComponent>) => {
                const slide = record.item;
                slide.total = this.total;
                this.slideAdded.emit({ carousel: this, slide });
                if (slide.active) {
                    this.currentItem = slide;
                }
                slide.activeChange.pipe(takeUntil(this.unsubscriber(slide))).subscribe(() => this.onSlideActivated(slide));
            });

            diff.forEachRemovedItem((record: IterableChangeRecord<IgxSlideComponent>) => {
                const slide = record.item;
                this.slideRemoved.emit({ carousel: this, slide });
                if (slide.active) {
                    slide.active = false;
                    this.currentItem = this.get(slide.index < this.total ? slide.index : this.total - 1);
                }
            });

            this.updateSlidesSelection();
        }
    }

    private updateSlidesSelection() {
        if (this.platformUtil.isBrowser) {
            requestAnimationFrame(() => {
                if (this.currentItem) {
                    this.currentItem.active = true;
                    const activeSlides = this.slides.filter(slide => slide.active && slide.index !== this.currentItem.index);
                    activeSlides.forEach(slide => slide.active = false);
                } else if (this.total) {
                    this.slides.first.active = true;
                }
                this.play();
            });
        }
    }
}

export interface ISlideEventArgs extends IBaseEventArgs {
    carousel: IgxCarouselComponent;
    slide: IgxSlideComponent;
}
