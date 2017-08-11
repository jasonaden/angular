/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */
import { EventEmitter } from '../event_emitter';
import { getSymbolIterator } from '../util';
/**
 * An unmodifiable list of items that Angular keeps up to date when the state
 * of the application changes.
 *
 * The type of object that {\@link ViewChildren}, {\@link ContentChildren}, and {\@link QueryList}
 * provide.
 *
 * Implements an iterable interface, therefore it can be used in both ES6
 * javascript `for (var i of items)` loops as well as in Angular templates with
 * `*ngFor="let i of myList"`.
 *
 * Changes can be observed by subscribing to the changes `Observable`.
 *
 * NOTE: In the future this class will implement an `Observable` interface.
 *
 * ### Example ([live demo](http://plnkr.co/edit/RX8sJnQYl9FWuSCWme5z?p=preview))
 * ```typescript
 * \@Component({...})
 * class Container {
 *   \@ViewChildren(Item) items:QueryList<Item>;
 * }
 * ```
 * \@stable
 */
export class QueryList {
    constructor() {
        this._dirty = true;
        this._results = [];
        this._emitter = new EventEmitter();
    }
    /**
     * @return {?}
     */
    get changes() { return this._emitter; }
    /**
     * @return {?}
     */
    get length() { return this._results.length; }
    /**
     * @return {?}
     */
    get first() { return this._results[0]; }
    /**
     * @return {?}
     */
    get last() { return this._results[this.length - 1]; }
    /**
     * See
     * [Array.map](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/map)
     * @template U
     * @param {?} fn
     * @return {?}
     */
    map(fn) { return this._results.map(fn); }
    /**
     * See
     * [Array.filter](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/filter)
     * @param {?} fn
     * @return {?}
     */
    filter(fn) {
        return this._results.filter(fn);
    }
    /**
     * See
     * [Array.find](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/find)
     * @param {?} fn
     * @return {?}
     */
    find(fn) {
        return this._results.find(fn);
    }
    /**
     * See
     * [Array.reduce](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/reduce)
     * @template U
     * @param {?} fn
     * @param {?} init
     * @return {?}
     */
    reduce(fn, init) {
        return this._results.reduce(fn, init);
    }
    /**
     * See
     * [Array.forEach](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/forEach)
     * @param {?} fn
     * @return {?}
     */
    forEach(fn) { this._results.forEach(fn); }
    /**
     * See
     * [Array.some](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/some)
     * @param {?} fn
     * @return {?}
     */
    some(fn) {
        return this._results.some(fn);
    }
    /**
     * @return {?}
     */
    toArray() { return this._results.slice(); }
    /**
     * @return {?}
     */
    [getSymbolIterator()]() { return ((this._results))[getSymbolIterator()](); }
    /**
     * @return {?}
     */
    toString() { return this._results.toString(); }
    /**
     * @param {?} res
     * @return {?}
     */
    reset(res) {
        this._results = flatten(res);
        this._dirty = false;
    }
    /**
     * @return {?}
     */
    notifyOnChanges() { this._emitter.emit(this); }
    /**
     * internal
     * @return {?}
     */
    setDirty() { this._dirty = true; }
    /**
     * internal
     * @return {?}
     */
    get dirty() { return this._dirty; }
}
function QueryList_tsickle_Closure_declarations() {
    /** @type {?} */
    QueryList.prototype._dirty;
    /** @type {?} */
    QueryList.prototype._results;
    /** @type {?} */
    QueryList.prototype._emitter;
}
/**
 * @template T
 * @param {?} list
 * @return {?}
 */
function flatten(list) {
    return list.reduce((flat, item) => {
        const /** @type {?} */ flatItem = Array.isArray(item) ? flatten(item) : item;
        return ((flat)).concat(flatItem);
    }, []);
}
//# sourceMappingURL=query_list.js.map