# Observables

Observables provide support for passing messages between publishers and subscribers in your application. Observables offer significant benefits over other techniques for event handling, asynchronous programming, and handling multiple values.

Observables are declarative &mdash; that is, you define a function for publishing values, but it is not executed until a consumer subscribes to it. The subscribed consumer then receives notifications until the function completes, or they unsubscribe.

An Observable can deliver multiple values of any type &mdash; literals, messages, or events, depending on the context. The API for receiving values is the same whether the values are delivered synchronously or asynchronously. Because setup and teardown logic are both handled by the Observable, your application code only needs to worry about subscribing to consume values, and when done, unsubscribing. Whether the stream was keystrokes, an HTTP response, or an interval timer, the interface for listening to values and stopping listening is the same.

Because of these advantages, Observables are used extensively within Angular, and are recommended for app development as well.

## Basic usage and terms

As a publisher, you create an `Observable` instance that defines a *subscriber* function. This is the function that is executed when a consumer calls the `subscribe()` method. The subscriber function defines how to obtain or generate values or messages to be published.

To execute the Observable you have created and begin receiving notifications, you call its `subscribe()` method, passing an *observer*.  This is a JavaScript object that defines the handlers for the notifications you receive. The `subscribe()` call returns a `Subscription` object that has an `unsubscribe()` method, which you call to stop receiving notifications.

Here's an example that demonstrates the basic usage model by showing how an Observable could be used to provide geolocation updates.

<code-example path="observables/src/geolocation.ts" title="Observe geolocation updates"></code-example>

## Defining observers

A handler for receiving Observable notifications implements the `Observer` interface. It is an object that defines callback methods to handle the three types of notifications that an Observable can send:

| Notification type |
|:---------|:-------------------------------------------|
| next  | Required. A handler for each delivered value. Called zero or more times after execution starts.|
| error | Optional. A handler for an error notification. An error halts execution of the Observable instance.|
| complete | Optional. A handler for the execution-complete notification. Delayed values can continue to be delivered to the next handler after execution is complete.|

An observer object can define any combination of these handlers. If you don't supply a handler for a notification type, the observer ignores notifications of that type.

## Subscribing

An `Observable` instance begins publishing values only when someone subscribes to it. You subscribe by calling the `subscribe()` method of the instance, passing an observer object to receive the notifications.

<div class="l-sub-section">

   In order to show how subscribing works, we need to create a new Observable. There is an Observable constructor that you use to create customized Observable instances, but for illustration, we can use some static methods on the Observable class that create simple Observables of frequently used types:

  * `Observable.of(...items)` &mdash; Returns an Observable that synchronously delivers the values provided as arguments.
  * `Observable.from(iterable)` &mdash; Converts its argument to an Observable. This method is commonly used to convert an array to an Observable.

</div>

Here's an example of creating and subscribing to a simple Observable, with an Observer that logs the received message to the console:

<code-example
  path="observables/src/subscribing.ts"
  region="observer"
  title="Subscribe using Observer"></code-example>

Alternatively, the `subscribe()` method can accept callback function definitions in line, for `next`, `error`, and `complete` handlers. For example, the following `subscribe()` call is the same as the one that specifies the predefined observer:

<code-example path="observables/src/subscribing.ts" region="sub_fn" title="Subscribe with positional arguments"></code-example>

In either case, a `next` handler is required. The `error` and `complete` handlers are optional.

Note that a `next()` function could receive, for instance, message strings, or event objects, numeric values, or stuctures, depending on context. As a general term, we refer to data published by an Observable as a *stream*. Any type of value can be represented with an Observable, and the values are published as a stream.

## Creating Observables

Use the `Observable` constructor to create an Observable stream of any type. The constructor takes as its argument the subscriber function to run when the Observable’s `subscribe()` method executes. A subscriber function receives an `Observer` object, and can publish values to the observer's `next()` method.

For example, to create an Observable equivalent to the `Observable.of(1, 2, 3)` above, you could do something like this:

<code-example path="observables/src/creating.ts" region="subscriber" title="Create Observable with constructor"></code-example>

To take this example a little further, we can create an Observable that publishes events. In this example, the subscriber function is defined inline.

<code-example path="observables/src/creating.ts" region="fromevent" title="Create with custom fromEvent function"></code-example>

Now you can use this function to create an Observable that publishes keydown events:

<code-example path="observables/src/creating.ts" region="fromevent_use" title="Use custom fromEvent function"></code-example>

## Multicasting

One feature of Observables is they don’t do anything until a subscription happens. In the previous examples, you can see that no event handlers are wired up and no values delivered until you subscribe to the Observable. But what happens when there are two subscriptions? A typical Observable creates a new, independent execution for each subscribed observer. If you have an Observable that keeps a list of subscribers, it can broadcast its values to all of them. This is known as multicasting.

Let’s look at an example, similar to the one above that counts from 1 to 3. But in this example we’ll introduce a 1 second delay between each number being emitted:

<code-example path="observables/src/multicasting.ts" region="delay_sequence" title="Create a delayed sequence"></code-example>

Notice that if you subscribe twice, there will be two separate streams, each emitting values every second. It looks something like this:

<code-example path="observables/src/multicasting.ts" region="subscribe_twice" title="Two subscriptions"></code-example>

Sometimes, instead of starting an independent execution for each subscriber, you want each subscription to get the same values -- even if values have already started emitting. This might be the case with something like an Observable of clicks on the document object. You might not want to register multiple listeners on the document, but instead re-use the first listener and send values out to each subscriber.

This is called “multicasting”. When creating an Observable you should determine how you want that Observable to be used and whether or not you want to multicast it’s values. Changing the Observable above to be multicasted could look something like this:

<code-example path="observables/src/multicasting.ts" region="multicast_sequence" title="Create a multicast subscriber"></code-example>

<div class="l-sub-section">
   Multicasting Observables take a bit more setup, but they can be useful for certain applications. Later we will look at tools that simplify the process of multicasting, allowing you to take any Observable and make it multicasting.
</div>

## Error Handling

Because Observables produce values asynchronously, try/catch will not effectively catch errors. Therefore error handling with Observables is handled with an `error` callback on the observer. Producing an error also causes the Observable clean up subscriptions and stop producing values. An Observable can only either produce values or complete with either a complete or error callback.

<code-example>
myObservable.subscribe({
  next(num) { console.log('Next num: ' + num)},
  error(err) { console.log('Received an errror: ' + err)}
});
</code-example>

Error handling (and specifically recovering from an error) is covered in more detail in a later section.
