# Observables Compared to Other Techniques

You can often use Observables instead of Promises to deliver values asynchronously. Similarly, Observables can take the place of event handlers. Finally, since Observables deliver multiple values, you can use them where you might otherwise build and operate on Arrays.

Observables behave somewhat differently from the alternative techniques in each of these situations, but offer some significant advantages. Here are detailed comparisons of the differences.

## Observable compared to Promise

Observables are often compared to Promises. Here are some key differences:

* Observables are declarative; computation does not start until subscription. Promises execute immediately on creation. This makes Observables useful for defining recipes that can be run whenever you need the result.

* Observables provide many values. Promises provide one. This makes Observables useful for getting multiple values over time.

* Observables differentiate between chaining and subscription. Promises only have `.then()` clauses. This makes Observables useful for creating complex transformation recipes to be used by other part of the system, without causing the work to be executed.

* Observables `subscribe()` is responsible for handling errors. Promises push errors to the child Promises. This makes Observables useful for centralized and predictable error handling.

 
### Creation

* **Observables** are declarative. The declared computation is not executed until a consumer subcribes.
```new Observable((observer) => { subscriber_fn });```

* **Promises** execute immediately, and just once. The computation of the result is initiated at promise creation time.
``` new Promise((resolve, reject) => { executer_fn });``` 
  * There is no way to restart work.
  * All `then` clauses (subscriptions) share the same computation. 

### Subscription 

* **Observables** initiate computation when you call `subscribe()`. The call executes the defined behavior once, and it can be called again. 
<pre>observable.subscribe(() => {
      // observer handles notifications
    });</pre>
  * Each subscription has its own computation.
  * Resubscription causes recomputation of values. 

* **Promises** initiate computation of the result at creation time.
<pre>promise.then((value) => {
      // handle result here
    });</pre>
  * There is no way to restart work.
  * All `then` clauses (subscriptions) share the same computation. 
     
### Chaining 
 
* **Observables** differentiate between transformation function such as a map and subscription. Only subscription activates the subscriber function to start computing the values.
<pre>observable.map((v) => 2*v);</pre>

* **Promises** do not differentiate between the last `.then` claues (equivalent to subscription) and intermediate .then clauses (equivalent to map).
<pre>promise.then((v) => 2*v);</pre>

### Cancellation

* **Observable** subscriptions are cancellable.
<pre>const sub = obs.subscribe(...);
sub.unsubscribe();</pre>
Unsubscribing removes the listener from receiving further values, and notifies the subscriber function to cancel work. 

* **Promise** is not cancellable.

### Error handling

* **Observable** execution errors are delivered to the subscriber's error handler and the subscriber automatically unsubscribes from the observable.
<pre>obs.subscribe(() => {
  throw Error('my error');
})</pre>
 
* **Promise** push errors to the child Promises.
<pre>promise.then(() => {
      throw Error('my error');
    })</pre>

### Cheat sheet

Here are some code samples that illustrate how the same kind of operation is defined using Observables and Promises.

<table>
  <th>
    <td>Observable</td>
    <td>Promise</td>
  </th>
  <tr>
    <td>Creation</td>
    <td>
      <pre>new Observable((observer) => {
  observer.next(123);
});</pre>
    </td>
    <td>
      <pre>new Promise((resolve, reject) => {
  resolve(123);
});</pre>
    </td>
  </tr>
  <tr>
    <td>Transform</td>
    <td><pre>obs.map((value) => value * 2 );</pre></td>
    <td><pre>promise.then((value) => value * 2);</pre></td>
  </tr>
  <tr>
    <td>Subscribe</td>
    <td>
      <pre>sub = obs.subscribe((value) => {
  console.log(value)
});</pre>
    </td>
    <td>
      <pre>promise.then((value) => {
  console.log(value);
});</pre>
    </td>
  </tr>
  <tr>
    <td>Unsubscribe</td>
    <td><pre>sub.unsubscribe();</pre></td>
    <td>Implied by promise resolution</td>
  </tr>
</table>

## Observable compared to Events API

Observables are very similar to event handlers that use the Events API. Both techniques define notification handlers, and use them to process multiple values delivered over time. Subscribing to an Observable is equivalent to adding an event listener. One significant difference is that you can configure an Observable to transform the event before it is passed to the handler.

Using Observables to handle events and asynchronous operations can have the advantage of greater consistency in contexts such as HTTP requests.

Here are some code samples that illustrate how the same kind of operation is defined using Observables and the Events API.

<table>
  <th>
    <td>Observable</td>
    <td>Events API</td>
  </th>
  <tr>
    <td>Creation & Cancellation</td>
    <td>
<pre>// Setup
let clicks$ = fromEvent(buttonEl, ‘click’);
// Begin listening
let subscription = clicks$
  .subscribe(e => console.log(‘Clicked’, e))
// Stop listening
subscription.unsubscribe();</pre>
   </td>
   <td>
<pre>function handler(e) {
  console.log(‘Clicked’, e);
}

// Setup & begin listening
button.addEventListener(‘click’, handler);
// Stop listening
button.removeEventListener(‘click’, handler);
</pre>
    </td>
    <td>Subscription</td>
    <td>
<pre>observable.subscribe(() => {
  // notification handlers here
});</pre>
    </td>
    <td>
<pre>element.addEventListener(eventName, (event) => {
  // notification handler here
});</pre>
    </td>
  </tr>
  <tr>
    <td>Configuration</td>
    <td>Listen for keystrokes, but provide a stream representing the value in the input.
<pre>fromEvent(inputEl, 'keydown').pipe(
  map(e => e.target.value)
);</pre>
    </td>
    <td>Does not support configuration.
<pre>element.addEventListener(eventName, (event) => {
  // Cannot change the passed Event into another
  // value before it gets to the handler
});</pre>
    </td>
  </tr>
</table>


## Observable compared to Array

An Observables produces values over time, while an Array is created as a static set of values. In a sense, Observables are asynchronous where Arrays are synchronous. In the following examples, ➞ implies asynchronous value delivery.

<table>
  <th>
    <td>Observable</td>
    <td>Array</td>
  </th>
  <tr>
    <td>Given</td>
    <td>
      <pre>obs: ➞1➞2➞3➞5➞7</pre>
      <pre>obsB: ➞'a'➞'b'➞'c'</pre>
    </td>
    <td>
      <pre>arr: [1, 2, 3, 5, 7]</pre>
      <pre>arrB: ['a', 'b', 'c']</pre>
    </td>
  </tr>
  <tr>
    <td><pre>concat()</pre></td>
    <td>
      <pre>obs.concat(obsB)</pre>
      <pre>➞1➞2➞3➞5➞7➞'a'➞'b'➞'c'</pre>
    </td>
    <td>
      <pre>arr.concat(arrB)</pre>
      <pre>[1,2,3,5,7,'a','b','c']</pre>
    </td>
  </tr>
  <tr>
    <td><pre>filter()</pre></td>
    <td>
      <pre>obs.filter((v) => v>3)</pre>
      <pre>➞5➞7</pre>
    </td>
    <td>
      <pre>arr.filter((v) => v>3)</pre>
      <pre>[5, 7]</pre>
    </td>
  </tr>
  <tr>
    <td><pre>find()</pre></td>
    <td>
      <pre>obs.find((v) => v>3)</pre>
      <pre>➞5</pre>
    </td>
    <td>
      <pre>arr.find((v) => v>10)</pre>
      <pre>5</pre>
    </td>
  </tr>
  <tr>
    <td><pre>findIndex()</pre></td>
    <td>
      <pre>obs.findIndex((v) => v>3)</pre>
      <pre>➞3</pre>
    </td>
    <td>
      <pre>arr.findIndex((v) => v>3)</pre>
      <pre>3</pre>
    </td>
  </tr>
  <tr>
    <td><pre>forEach()</pre></td>
    <td>
      <pre>obs.forEach((v) => {
  console.log(v);
})
1
2
3
4
5</pre>
    </td>
    <td>
      <pre>arr.forEach((v) => {
  console.log(v);
})
1
2
3
4
5</pre>
    </td>
  </tr>
  <tr>
    <td><pre>map()</pre></td>
    <td>
      <pre>obs.map((v) => -v)</pre>
      <pre>➞-1➞-2➞-3➞-5➞-7</pre>
    </td>
    <td>
      <pre>arr.map((v) => -v)</pre>
      <pre>[-1, -2, -3, -5, -7]</pre>
    </td>
  </tr>
  <tr>
    <td><pre>reduce()</pre></td>
    <td>
      <pre>obs.reduce((s,v)=> s+v, 0)</pre>
      <pre>➞1➞3➞6➞11➞18</pre>
    </td>
    <td>
      <pre>arr.reduce((s,v) => s+v, 0)</pre>
      <pre>18</pre>
    </td>
  </tr>
</table>



