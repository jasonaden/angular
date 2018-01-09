# The RxJS Library

Reactive programming is an asynchronous programming paradigm concerned with data streams and the propagation of change ([Wikipedia](https://en.wikipedia.org/wiki/Reactive_programming)). RxJS (Reactive Extensions for JavaScript) is a library for reactive programming using Observables that makes it easier to compose asynchronous or callback-based code ([RxJS Docs](http://reactivex.io/rxjs/)).

RxJS provides an implementation of the Observable type, which is needed until Observable becomes part of the language and until browsers support it. But the most important parts of the library are utility functions for creating and working with Observables. These utility functions can be used for:

* Convert existing async APIs (Promises, event handlers, etc) into Observables
* Iterating through the values in a stream
* Mapping values to a different type of value
* Filtering streams
* Composition of multiple streams

## Observable Creation Functions

RxJS offers a number of functions that can be used to create new Observables. These functions can simplify the process of creating Observables from things such as events, timers, promises, etc. For example:

### Observable from a Promise

```
import { fromPromise } from 'rxjs/observable/fromPromise;
import { interval } from 'rxjs/observable/interval';


// Create an Observable out of a promise
const data = fromPromise(fetch('/api/endpoint'));

data.subscribe({
 next(response) { console.log(response); },
 error(err) { console.error('Error: ' + err); },
 complete() { console.log('Completed'); }
});
```

### Observable from a Counter

```
// Observable that will publish a value on an interval
const secondsCounter = interval(1000);

secondsCounter.subscribe(n =>
  console.log(`It's been ${n} seconds since subscribing!`));
```

### Observable from an Event

```
import { fromEvent } from 'rxjs/observable/fromEvent';

const el = document.getElementById('my-element');

// Create an Observable that will publish mouse movements
const mouseMoves = fromEvent(el, 'mousemove');

const subscription = mouseMoves.subscribe(evt => {
  // Log coords of mouse movements
  console.log(`Coords: ${evt.clientX} X ${evt.clientY}`);

  // When the mouse is over the upper-left of the screen,
  // unsubscribe (stop listening for mouse movements)
  if (evt.clientX < 40 && evt.clientY < 40) {
    subscription.unsubscribe();
  }
});
```

### Observable AJAX Request

```
// Will make AJAX request once subscribed to
const apiData = ajax('/api/data');

apiData.subscribe(res => console.log(res.status, res.response));
```

## Operators

An operator is a pure function that takes configuration options, returning a function that takes a source Observable. When executing this returned function, the operator observes the source Observable’s emitted values, transforms them, and returns a new Observable of those transformed values. This is probably most easily demonstrated with a simple example:

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

Operators can be linked together using the pipe() function. Pipe is a functional programming concept allowing you to combine multiple functions into a single function. Pipe takes as its arguments the functions you want to combine together. It returns a new function that, when executed, will run the composed functions in sequence. Here’s an example:

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

// Create an Observable that, when subscribed
// to, will run the filter and map functions
const squareOdd = squareOddVals(nums)

// Must subscribe to get values
squareOdd.subscribe(x => console.log(x));
```

The `pipe()` function is also a method on the RxJS Observable, so the above could be shortened as follows:

```
import { filter } from 'rxjs/operators/filter';
import { map } from 'rxjs/operators/map';

const squareOdd = Observable.of(1, 2, 3, 4, 5)
  .pipe(
    filter(n => n % 2),
    map(n => n * n)
  );

// Must subscribe to get values
squareOdd.subscribe(x => console.log(x));
```

A set of operators applied to an Observable could be called a “recipe”. Basically a set of instructions for producing the values you’re interested in. But by itself the recipe doesn’t do anything. You need to call `subscribe()` to produce a result through the recipe.

## Error Handling

While the `subscribe()` method on an Observable allows for handling of errors, often times you want to handle known errors in the Observable recipe. For instance, you have an Observable that makes an API request and maps to the response from the server. But if the server returns an error or the value doesn’t exist, error is produced. You might want to catch this error and supply a default value so your stream continues to process values rather than erroring out.

RxJS provides the `catchError` operator, which can be used like this:

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

## Retry Failed Observable

The `catchError` operator provides a simple path of recovery, but we can go further. What if you also wanted to retry a failed request? With Observables, this is as easy as adding a new operator, aptly named retry.

Once importing the retry operator, you can use it before the `catchError` operator. This will cause the original source Observable to be re-subscribed to, meaning it will re-run the full sequence of actions that resulted in the error. If this includes an HTTP request, it will retry that HTTP request.

Converting the above example to use retry:

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

As a general rule, you don't use the retry operator on all types of requests. Requests such as authentication wouldn't be retried as those requests should be initiated by user action. We don't want to lock out user accounts with repeated login requests uninitiated by our users.

## Naming Convention

Because Angular applications are mostly written in TypeScript, you will generally know when a variable is an Observable. While the Angular framework generally does not employ a naming convention for Observables, in online examples and applications, you will often see Observables named with a trailing “$” sign.

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
