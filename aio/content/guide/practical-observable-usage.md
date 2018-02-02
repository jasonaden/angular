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

<code-example path="practical-observable-usage/src/typeahead.ts" title="Typeahead"></code-example>

## Exponential backoff

Exponential backoff is a technique where you retry an API after failure, making the time in between retries longer after each consecutive failure, with a maximum number of retries after which the request is considered to have failed. This can be quite complex to implement with Promises and other methods of tracking AJAX calls. With Observables, it is very easy:

<code-example path="practical-observable-usage/src/backoff.ts" title="Exponential backoff"></code-example>
