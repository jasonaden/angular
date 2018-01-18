# The RxJS Library

Reactive programming is an asynchronous programming paradigm concerned with data streams and the propagation of change ([Wikipedia](https://en.wikipedia.org/wiki/Reactive_programming)). RxJS (Reactive Extensions for JavaScript) is a library for reactive programming using Observables that makes it easier to compose asynchronous or callback-based code ([RxJS Docs](http://reactivex.io/rxjs/)).

RxJS provides an implementation of the Observable type, which is needed until Observable becomes part of the language and until browsers support it. But the most important parts of the library are utility functions for creating and working with Observables. These utility functions can be used for:

* Converting existing code for async operations into Observables
* Iterating through the values in a stream
* Mapping values to different types
* Filtering streams
* Composing multiple streams

## Observable creation functions

RxJS offers a number of functions that can be used to create new Observables. These functions can simplify the process of creating Observables from things such as events, timers, promises, and so on. For example:

*  Create an Observable from a Promise 

```
import { fromPromise } from 'rxjs/observable/fromPromise';
import { interval } from 'rxjs/observable/interval';

// Create an Observable out of a promise
const data = fromPromise(fetch('/api/endpoint'));
// Subscribe to begin listening for async result
data.subscribe({
 next(response) { console.log(response); },
 error(err) { console.error('Error: ' + err); },
 complete() { console.log('Completed'); }
});
```

* Create an Observable from a counter

```
// Create an Observable that will publish a value on an interval
const secondsCounter = interval(1000);
// Subscribe to begin publishing values
secondsCounter.subscribe(n =>
  console.log(`It's been ${n} seconds since subscribing!`));
```

* Create an Observable from an event

```
import { fromEvent } from 'rxjs/observable/fromEvent';
const el = document.getElementById('my-element');

// Create an Observable that will publish mouse movements
const mouseMoves = fromEvent(el, 'mousemove');

// Subscribe to start listening for mouse-move events
const subscription = mouseMoves.subscribe(evt => {
  // Log coords of mouse movements
  console.log(`Coords: ${evt.clientX} X ${evt.clientY}`);

  // When the mouse is over the upper-left of the screen,
  // unsubscribe to stop listening for mouse movements
  if (evt.clientX < 40 && evt.clientY < 40) {
    subscription.unsubscribe();
  }
});
```

* Create an Observable that creates an AJAX Request 

```
// Create an Observable that will create an AJAX request
const apiData = ajax('/api/data');
// Subscribe to create the request
apiData.subscribe(res => console.log(res.status, res.response));
```

## Operators

Operators are functions that build on the Observables foundation to enable sophisticated manipulation of collections. For example, RxJS defines operators for operations such as `map()`, `filter()`, `concat()`, and `flatMap()`.

An operator takes configuration options, and returns another function which takes a source Observable. When executing this returned function, the operator observes the source Observable’s emitted values, transforms them, and returns a new Observable of those transformed values. Here is a simple example:

```
import { map } from 'rxjs/operators';

const nums = Observable.of(1, 2, 3);
const squareValues = map(val => val * val);
const squaredNums = squareValues(nums);

squaredNums.subscribe(x => console.log(x));

// Logs
// 1
// 4
// 9
```

You can use _pipes_ to link operators together. Pipes let you combine multiple functions into a single function. The `pipe()` function takes as its arguments the functions you want to combine, and returns a new function that, when executed, runs the composed functions in sequence. 

A set of operators applied to an Observable is a recipe &mdash; that is, a set of instructions for producing the values you’re interested in. By itself, the recipe doesn’t do anything. You need to call `subscribe()` to produce a result through the recipe.

Here’s an example:

```
import { pipe } from 'rxjs/util/pipe';
import { filter } from 'rxjs/operators/filter';
import { map } from 'rxjs/operators/map';

const nums = Observable.of(1, 2, 3, 4, 5);

// Create a function that accepts an Observable.
const squareOddVals = pipe(
  filter(n => n % 2),
  map(n => n * n)
);

// Create an Observable that will run the filter and map functions
const squareOdd = squareOddVals(nums)

// Suscribe to run the combined functions
squareOdd.subscribe(x => console.log(x));
```

The `pipe()` function is also a method on the RxJS Observable, so you use this shorter form to define the same operation:

```
import { filter } from 'rxjs/operators/filter';
import { map } from 'rxjs/operators/map';

const squareOdd = Observable.of(1, 2, 3, 4, 5)
  .pipe(
    filter(n => n % 2),
    map(n => n * n)
  );

// Subscribe to get values
squareOdd.subscribe(x => console.log(x));
```
### Common operators

RxJS provides many operators (over 150 of them), but only a handful are used frequently. Here is a list of common operators; for usage examples, see  [RxJS 5 Operators By Example](https://github.com/btroncone/learn-rxjs/blob/master/operators/complete.md) in RxJS documentation. 

<div class="l-sub-section">
  Note that, for Angular apps, we prefer combining operators with pipes, rather than chaining. Chaining is used in many RxJS examples.
</div>

| Area | Operators |  
| :------------| :----------| 
| Creation |  `from`, `fromPromise`,`fromEvent`, `of` | 
| Combination | `combineLatest`, `concat`, `merge`, `startWith` , `withLatestFrom`, `zip` | 
| Filtering | `debounceTime`, `distinctUntilChanged`, `filter`, `take`, `takeUntil` | 
| Transformation | `bufferTime`, `concatMap`, `map`, `mergeMap`, `scan`, `switchMap` |  
| Utility | `tap` | 
| Multicasting | `share` |  

## Error Handling

In addition to the `error()` handler that you provide on subscription, RxJS provides the `catchError` operator that lets you handle known errors in the Observable recipe. 

For instance, suppose you have an Observable that makes an API request and maps to the response from the server. If the server returns an error or the value doesn’t exist, an error is produced. If you catch this error and supply a default value, your stream continues to process values rather than erroring out.

Here's an example of using the `catchError` operator to do this:

```
import { ajax } from 'rxjs/observable/dom/ajax';
import { map, catchError } from 'rxjs/operators';
// Return "response" from the API. If an error happens,
// return an empty array.
const apiData = ajax('/api/data').pipe(
  map(res => {
    if (!res.response) throw new Error('Value expected!');
    return res.response;
  }),
  catchError(err => of([]))
);

apiData.subscribe({
  next(x) { console.log('data: ', x); },
  error(err) { console.log('errors already caught... will not run'); }
});
```

### Retry Failed Observable

Where the `catchError` operator provides a simple path of recovery, the `retry` operator lets you retry a failed request. 

Use the `retry` operator before the `catchError` operator. It resubscribes to the original source Observable, which can then re-run the full sequence of actions that resulted in the error. If this includes an HTTP request, it will retry that HTTP request.

The following converts the previous example to retry the request before catching the error:

```
import { ajax } from 'rxjs/observable/dom/ajax';
import { map, retry, catchError } from 'rxjs/operators';

const apiData = ajax('/api/data').pipe(
  retry(3), // Retry up to 3 times before failing
  map(res => {
    if (!res.response) throw new Error('Value expected!');
    return res.response;
  }),
  catchError(err => of([]))
);

apiData.subscribe({
  next(x) { console.log('data: ', x); },
  error(err) { console.log('errors already caught... will not run'); }
});
```
<div class="l-sub-section">

   Do not retry **authentication** requests, since these should only be initiated by user action. We don't want to lock out user accounts with repeated login requests that the user has not initiated.

</div>

## Naming conventions for Observables

Because Angular applications are mostly written in TypeScript, you will typically know when a variable is an Observable. While the Angular framework generally does not employ a naming convention for Observables, in online examples and applications, you will often see Observables named with a trailing “$” sign.

This can be useful when scanning through code and looking for Observable values. Also, if you want a property to store the most recent value from an Observable, it can be convenient to simply use the same name with or without the “$”.

For example:

```
import { Component } from '@angular/core';
import {Observable } from 'rxjs/Observable';

@Component({
  selector: 'app-stopwatch',
  templateUrl: './stopwatch.component.html'
})
export class StopwatchComponent {

  stopwatchValue: number;
  stopwatchValue$: Observable<number>;

  start() {
    this.stopwatchValue$.subscribe(num =>
      this.stopwatchValue = num;
    );
  }
}
```
