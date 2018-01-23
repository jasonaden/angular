# Practical Usage

Here are some examples of domains in which Observables are particularly useful.

## Type-ahead suggestions

An example of how Observables can simplify a potentially complex task is in implementing type-ahead. Typically, a type-ahead has to do a series of tasks:

* Listen for data from an input
* Trim the value (remove whitespace) and make sure it’s a minimum length
* Debounce (so as not to send off API requests for every keystroke, but instead wait for a break in keystrokes)
* Don’t send a request if the value stays the same (rapidly hit a character, then backspace, for instance)
* Cancel ongoing AJAX requests if their results will be invalidated by the updated results

Writing this in full JavaScript can be quite involved. With Observables, you can use a simple series of RxJS operators:

```
const typeahead = fromEvent(searchBox, 'input').pipe(
 map(e => e.target.value),
 filter(text => text.length > 2),
 debounceTime(10),
 distinctUntilChanged(),
 switchMap(() => ajax('/api/endpoint'))
);

typeahead.subscribe(data => {
 // Handle the data from the API
});
```

## Exponential backoff

Exponential backoff is a technique where you retry an API after failure, making the time in between retries longer after each consecutive failure, with a maximum number of retries after which the request is considered to have failed. This can be quite complex to implement with Promises and other methods of tracking AJAX calls. With Observables, it is very easy:

```
function backoff(maxTries, ms) {
 return pipe(
   retryWhen(attempts => Observable
     .range(1, maxTries)
     .pipe(
       zip(attempts, (i) => i),
       map(i => i * i),
       mergeMap(i =>  Observable.timer(i * ms))
     )
   )
 );
}

ajax('/api/endpoint')
  .let(backoff(3, 250))
  .subscribe(data => handleData(data));
```

## Managing Subscriptions

TBD. Original content [here](https://docs.google.com/document/d/1gGP5sqWNCHAWWV_GLdZQ1XyMO4K-CHksUxux0BFtVxk/edit#heading=h.3333ma4ei9ne).

## Async Pipe

TBD. Original content [here](https://docs.google.com/document/d/1gGP5sqWNCHAWWV_GLdZQ1XyMO4K-CHksUxux0BFtVxk/edit#heading=h.urzvx62pmtlv).

## Sharing observable reference

TBD. Original content [here](https://docs.google.com/document/d/1gGP5sqWNCHAWWV_GLdZQ1XyMO4K-CHksUxux0BFtVxk/edit#heading=h.h3yt29eshbdx).

## Sharing data with a stream

TBD. Original content [here](https://docs.google.com/document/d/1gGP5sqWNCHAWWV_GLdZQ1XyMO4K-CHksUxux0BFtVxk/edit#heading=h.qnk78yf7mowb).
