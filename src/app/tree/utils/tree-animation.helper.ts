import { useAnimation } from '@angular/animations';
import { growVerIn, growVerOut } from 'igniteui-angular/animations';

export class TreeAnimationHelper {
    public static getAnimationSettings(animationDuration: number) {
        return {
            openAnimation: useAnimation(growVerIn, {
                params: {
                    duration: `${animationDuration}ms`
                }
            }),
            closeAnimation: useAnimation(growVerOut, {
                params: {
                    duration: `${animationDuration}ms`
                }
            })
        };
    }
}
