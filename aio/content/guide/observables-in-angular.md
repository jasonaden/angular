# Observables in Angular

Angular makes use of Observables as an interface to handle a variety of common asynchronous operations. For example:

* The `EventEmitter` class extends `Observable`.
* The HTTP module uses Observables to handle AJAX requests and responses.
* The Router and Forms modules use Observables to listen for and respond to user-input events.

## Event Emitter

Angular provides an `EventEmitter` class that is used when publishing values from a Component through the `@Output()` decorator. `EventEmitter` extends `Observable`, adding an `emit()` method so it can send arbitrary values. When you call `emit()`, it passes the emitted value to the `next()` method of any subscribed observer.

A good example of usage can be found on the [EventEmitter](https://angular.io/api/core/EventEmitter) docs page. Here is the example component that listens for open and close events:

`<zippy (open)="onOpen($event)" (close)="onClose($event)"></zippy>`

Here is the component definition:

```
@Component({
  selector: 'zippy',
  template: `
  <div class="zippy">
    <div (click)="toggle()">Toggle</div>
    <div [hidden]="!visible">
      <ng-content></ng-content>
    </div>
  </div>`})

export class Zippy {
  visible: boolean = true;
  @Output() open = new EventEmitter<any>();
  @Output() close = new EventEmitter<any>();

  toggle() {
    this.visible = !this.visible;
    if (this.visible) {
      this.open.emit(null);
    } else {
      this.close.emit(null);
    }
  }
}
```

## HTTP
Angular’s `HttpClient` returns Observables from HTTP method calls. For instance, `http.get(‘/api’)` returns an Observable. This provides several advantages over Promise-based HTTP APIs:

* Observables do not mutate the server response (as can occur through chained `.then()` calls on Promises). Instead, you can use a series of operators to transform values as needed.
* HTTP requests are cancellable through the `unsubscribe()` method.
* Requests can be configured to get progress event updates.
* Failed requests can be retried easily.

## Async Pipe

The [AsyncPipe](https://angular.io/api/common/AsyncPipe) subscribes to an Observable or Promise and returns the latest value it has emitted. When a new value is emitted, the pipe marks the component to be checked for changes.

The following example binds the `time` Observable to the component's view. The Observable continuously updates the view with the current time.

```
@Component({
  selector: 'async-observable-pipe',
  template: `<div><code>observable|async</code>:
			 Time: {{ time | async }}</div>` })

export class AsyncObservablePipeComponent {
  time = new Observable(observer =>
    setInterval(() => observer.next(new Date().toString()), 1000)
  );
}
```

## Router

[`Router.events`](https://angular.io/api/router/Router#events) provides events as Observables. You can use the `filter()` operator from RxJS to look for events of interest, and subscribe to them in order to make decisions based on the sequence of events in the navigation process. Here's an example:

```
import { Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-routable',
  templateUrl: './routable.component.html',
  styleUrls: ['./routable.component.css']
})
export class RoutableComponent implements OnInit {

  navStart: Observable<NavigationStart>;

  constructor(private router: Router) {
    // Create a new Observable the publishes only the NavigationStart event
    this.navStart = router.events.pipe(
      filter(evt => evt instanceof NavigationStart)
    ) as Observable<NavigationStart>;
  }

  ngOnInit() {
    this.navStart.subscribe(evt => console.log('Navigation Started!'));
  }
}
```

The [ActivatedRoute](https://angular.io/api/router/ActivatedRoute) is an injected router service that makes use of Observables to get information about a route path and parameters. For example, `ActivateRoute.url` contains an Observable that reports the route path or paths. Here's an example:

```
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-routable',
  templateUrl: './routable.component.html',
  styleUrls: ['./routable.component.css']
})
export class RoutableComponent implements OnInit {
  constructor(private activatedRoute: ActivatedRoute) {}

  ngOnInit() {
    this.activatedRoute.url
      .subscribe(url => console.log('The URL changed to: ' + url));
  }
}
```

## Reactive Forms

Reactive forms have properties that use Observables to monitor form control values. The [`FormControl`](https://angular.io/api/forms/FormControl) properties `valueChanges` and `statusChanges` contain Observables that raise change events. Subscribing to an observable form-control property is a way of triggering application logic within the component class. For example:

```
@Component({
  selector: 'my-component',
  template: 'MyComponent Template'
})
export class MyComponent {
  nameChangeLog: string[] = [];

  ngOnInit() {
    this.logNameChange();
  }
  logNameChange() {
    const nameControl = this.heroForm.get('name');
    nameControl.valueChanges.forEach(
      (value: string) => this.nameChangeLog.push(value)
    );
  }
}
```
