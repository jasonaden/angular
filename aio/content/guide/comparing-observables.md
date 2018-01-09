# Observables Compared to Promises, Arrays, and Events

## Observable vs Promise

Observables are often compared to Promises. They both deliver values asynchronously, so what’s the difference? Unlike Promise, Observable delivers many values over time and is cancellable. Some of the other differences are described in the following table.

<table>
  <th>
    <td>Observable</td>
    <td>Promise</td>
  </th>
  <tr>
    <td>Creation</td>
    <td>
<pre>new Observable((observer) => {
  // name: Subscribe Function
  // called lazily when subscribed to
  // compute result here
  // invoked once per subscription
});</pre></td>
    <td>
<pre>new Promise((resolve, reject) => {
  // name: Executor Function
  // called eagerly
  // compute result here
  // invoked exactly once
});</pre>
    </td>
  </tr>
  <tr>
    <td>Count</td>
    <td>Many values delivered over time</td>
    <td>Single value delivered</td>
  </tr>
  <tr>
    <td>Hot vs Cold</td>
    <td>
      <p>Are cold. The computation of values is only started as a result of subscription.</p>
      <p>Because it is cold:</p>
      <ul>
        <li>re-subscription causes re-computation of values.</li>
        <li>Every subscription has its own computation.</li>
      </ul>
    </td>
    <td>
      <p>Are hot. The computation of the result is initiated at promise creation time.</p>
      <p>Because it is hot:</p>
      <ul>
        <li>There is no way to restart work.</li>
        <li>All `then`s (subscriptions) share the same computation</li>
      </ul>
    </td>
  </tr>
  <tr>
    <td>Subscription</td>
    <td>
<pre>observable.subscribe(() => {
      // will get notified of value here
    });</pre>
    </td>
    <td>
<pre>promise.then((value) => {
      // will get notified of value here
    });</pre>
    </td>
  </tr>
  <tr>
    <td>chaining</td>
    <td>
      <pre>observable.map((v) => 2*v);</pre>
      <p>Observables differentiate between transformation function such as a map and subscription. Only subscription activate the subscribe Function to start computing the values.</p>
    </td>
    <td>
      <pre>promise.then((v) => 2*v);</pre>
      <p>Promises do not differentiate between the last .then (ie subscription) and intermediate .then (ie map)</p>
    </td>
  </tr>
  <tr>
    <td>Cancellation</td>
    <td>
      <pre>const sub = obs.subscribe(...);
sub.unsubscribe();</pre>
      <p>Unsubscribing removes the listener from receiving further values, and notifies the subscriber function to cancel work.</p>
    </td>
    <td>
      <p>not supported</p>
    </td>
  </tr>
  <tr>
    <td>Errors</td>
    <td>
      <pre>obs.subscribe(() => {
  throw Error('my error');
})</pre>
    <p>The error is delivered to the Subscribe Function and automatically unsubscribes from the observable.</p>
    </td>
    <td>
      <pre>promise.then(() => {
      throw Error('my error');
    })</pre>
    </td>
  </tr>
</table>

The key takeaways are:

* Observables provide many values (vs Promises provide one)
  * Useful for getting values over time
* Observables differentiate between chaining and subscription (vs Promises only have `.then()`)
  * Useful for creating complex transformation recipes to be used by other part of the system, without causing the work to be executed.
* Observables are cold -- computation does not start until subscription (vs Promises are hot -- computation is eager)
  * Useful executing the recipes, only when someone cares about the result.
* Observables Subscribe Function is responsible for handling errors. (vs Errors are pushed to the child promises)
  * Useful for centralized and predictable error handling.

Cheat sheet:

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


## Observable vs Array

One can think of Observables as values over time vs Array as values now. From a certain point of view Observables are asynchronous version and Array is the synchronous version of values.

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

NOTE: ➞ implies asynchronous value delivery

## Observable vs Event Handlers

Observables can take the place of event handlers. If you were to replace all event handlers with Observables there are a few advantages to be gained. Not the least of which is consistency across async APIs (if you’re using Observables in other contexts such as HTTP requests).

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
  </tr>
  <tr>
    <td>Count</td>
    <td>Many values delivered over time</td>
    <td>Many values delivered over time</td>
  </tr>
  <tr>
    <td>Subscription</td>
    <td>
<pre>observable.subscribe(() => {
  // will get notified of value here
});</pre>
    </td>
    <td>
<pre>element.addEventListener(eventName, (event) => {
  // will get notified of value here
});</pre>
    </td>
  </tr>
  <tr>
    <td>Configuration</td>
    <td>
<pre>fromEvent(inputEl, ‘keydown).pipe(
  map(e => e.target.value)
);</pre>
      <p>Configured to listen for keystrokes, but provide a stream representing the value in the input.</p>
    </td>
    <td>
<pre>element.addEventListener(eventName, (event) => {
  // Cannot change the Event into another
  // value before it gets to the handler
});</pre>
      <p>Not supported</p>
    </td>
  </tr>
</table>

