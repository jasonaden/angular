/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */

import {Subscribable, Observable} from 'rxjs/Observable';
import { Observer, PartialObserver } from 'rxjs/Observer';
import {TeardownLogic, ISubscription } from 'rxjs/Subscription';
import {Subscriber} from "rxjs/Subscriber";

function noop() {}

/**
 * Use by directives and components to emit custom Events.
 *
 * ### Examples
 *
 * In the following example, `Zippy` alternatively emits `open` and `close` events when its
 * title gets clicked:
 *
 * ```
 * @Component({
 *   selector: 'zippy',
 *   template: `
 *   <div class="zippy">
 *     <div (click)="toggle()">Toggle</div>
 *     <div [hidden]="!visible">
 *       <ng-content></ng-content>
 *     </div>
 *  </div>`})
 * export class Zippy {
 *   visible: boolean = true;
 *   @Output() open: EventEmitter<any> = new EventEmitter();
 *   @Output() close: EventEmitter<any> = new EventEmitter();
 *
 *   toggle() {
 *     this.visible = !this.visible;
 *     if (this.visible) {
 *       this.open.emit(null);
 *     } else {
 *       this.close.emit(null);
 *     }
 *   }
 * }
 * ```
 *
 * The events payload can be accessed by the parameter `$event` on the components output event
 * handler:
 *
 * ```
 * <zippy (open)="onOpen($event)" (close)="onClose($event)"></zippy>
 * ```
 *
 * Uses Rx.Observable but provides an adapter to make it work as specified here:
 * https://github.com/jhusain/observable-spec
 *
 * Once a reference implementation of the spec is available, switch to it.
 * @stable
 */
export class EventEmitter<T> implements Subscribable<T> {

  private nextObserver: null | ((value: T) => void);
  private errorObserver: null | ((value: T) => void);
  private completeObserver: null | (() => void);
  private subscribeFn: null | ((observer: Observer<T>) => TeardownLogic);
  private teardown: TeardownLogic | null;

  constructor(subscribe?: (observer: Observer<T>) => TeardownLogic) {
    if (subscribe) {
      this.subscribeFn = subscribe;
    }
  }

  emit(value: T) { this.next(value); }
  next(value: T) { this.nextObserver && this.nextObserver(value); }
  error(err: any) {this.errorObserver && this.errorObserver(err); }
  complete() {this.completeObserver && this.completeObserver(); }

  subscribe(observerOrNext?: PartialObserver<T> | ((value: T) => void), error?: (error: any) => void, complete?: () => void): ISubscription {
    if (this.nextObserver) new Error('Only one subscription is supported.');

    let partial = observerOrNext && typeof observerOrNext == 'object' && observerOrNext;
    this.nextObserver = partial && partial.next || observerOrNext as ((value: T) => void) || noop;
    this.errorObserver = partial && partial.error || error || noop;
    this.completeObserver = partial && partial.complete|| complete || noop;

    if (this.subscribeFn) {
      this.teardown = this.subscribeFn(this) || noop;
    }

    let subscription = {
      closed: false,
      unsubscribe: () => {
        subscription.closed = true;
        this.teardown && (typeof this.teardown == 'object' ? this.teardown.unsubscribe() : this.teardown());
        this.teardown = this.nextObserver = this.errorObserver = this.completeObserver = null;
      }
    };
    return subscription as any;
  }
}
