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


<code-example path="rx-library/src/simple-creation.ts" region="promise" title="Create an Observable from a Promise"></code-example>

<code-example path="rx-library/src/simple-creation.ts" region="interval" title="Create an Observable from a counter"></code-example>

<code-example path="rx-library/src/simple-creation.ts" region="event" title="Create an Observable from an event"></code-example>

<code-example path="rx-library/src/simple-creation.ts" region="ajax" title="Create an Observable that creates an AJAX Request"></code-example>

## Operators

Operators are functions that build on the Observables foundation to enable sophisticated manipulation of collections. For example, RxJS defines operators for operations such as `map()`, `filter()`, `concat()`, and `flatMap()`.

An operator takes configuration options, and returns another function which takes a source Observable. When executing this returned function, the operator observes the source Observable’s emitted values, transforms them, and returns a new Observable of those transformed values. Here is a simple example:

<code-example path="rx-library/src/operators.ts" title="Map operator"></code-example>

You can use _pipes_ to link operators together. Pipes let you combine multiple functions into a single function. The `pipe()` function takes as its arguments the functions you want to combine, and returns a new function that, when executed, runs the composed functions in sequence.

A set of operators applied to an Observable is a recipe &mdash; that is, a set of instructions for producing the values you’re interested in. By itself, the recipe doesn’t do anything. You need to call `subscribe()` to produce a result through the recipe.

Here’s an example:

<code-example path="rx-library/src/operators.1.ts" title="Standalone pipe function"></code-example>

The `pipe()` function is also a method on the RxJS Observable, so you use this shorter form to define the same operation:

<code-example path="rx-library/src/operators.2.ts" title="Observable.pipe function"></code-example>

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

<code-example path="rx-library/src/error-handling.ts" title="catchError operator"></code-example>

### Retry Failed Observable

Where the `catchError` operator provides a simple path of recovery, the `retry` operator lets you retry a failed request.

Use the `retry` operator before the `catchError` operator. It resubscribes to the original source Observable, which can then re-run the full sequence of actions that resulted in the error. If this includes an HTTP request, it will retry that HTTP request.

The following converts the previous example to retry the request before catching the error:

<code-example path="rx-library/src/retry-on-error.ts" title="retry operator"></code-example>

<div class="l-sub-section">

   Do not retry **authentication** requests, since these should only be initiated by user action. We don't want to lock out user accounts with repeated login requests that the user has not initiated.

</div>

## Naming conventions for Observables

Because Angular applications are mostly written in TypeScript, you will typically know when a variable is an Observable. While the Angular framework generally does not employ a naming convention for Observables, in online examples and applications, you will often see Observables named with a trailing “$” sign.

This can be useful when scanning through code and looking for Observable values. Also, if you want a property to store the most recent value from an Observable, it can be convenient to simply use the same name with or without the “$”.

For example:

<code-example path="rx-library/src/naming-convention.ts" title="Naming Observables"></code-example>