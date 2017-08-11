"use strict";
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var http_1 = require("@angular/http");
var ReplaySubject_1 = require("rxjs/ReplaySubject");
var Subject_1 = require("rxjs/Subject");
var take_1 = require("rxjs/operator/take");
/**
 *
 * Mock Connection to represent a {@link Connection} for tests.
 *
 * @experimental
 */
var MockConnection = (function () {
    function MockConnection(req) {
        this.response = take_1.take.call(new ReplaySubject_1.ReplaySubject(1), 1);
        this.readyState = http_1.ReadyState.Open;
        this.request = req;
    }
    /**
     * Sends a mock response to the connection. This response is the value that is emitted to the
     * {@link EventEmitter} returned by {@link Http}.
     *
     * ### Example
     *
     * ```
     * var connection;
     * backend.connections.subscribe(c => connection = c);
     * http.request('data.json').subscribe(res => console.log(res.text()));
     * connection.mockRespond(new Response(new ResponseOptions({ body: 'fake response' }))); //logs
     * 'fake response'
     * ```
     *
     */
    MockConnection.prototype.mockRespond = function (res) {
        if (this.readyState === http_1.ReadyState.Done || this.readyState === http_1.ReadyState.Cancelled) {
            throw new Error('Connection has already been resolved');
        }
        this.readyState = http_1.ReadyState.Done;
        this.response.next(res);
        this.response.complete();
    };
    /**
     * Not yet implemented!
     *
     * Sends the provided {@link Response} to the `downloadObserver` of the `Request`
     * associated with this connection.
     */
    MockConnection.prototype.mockDownload = function (res) {
        // this.request.downloadObserver.onNext(res);
        // if (res.bytesLoaded === res.totalBytes) {
        //   this.request.downloadObserver.onCompleted();
        // }
    };
    // TODO(jeffbcross): consider using Response type
    /**
     * Emits the provided error object as an error to the {@link Response} {@link EventEmitter}
     * returned
     * from {@link Http}.
     *
     * ### Example
     *
     * ```
     * var connection;
     * backend.connections.subscribe(c => connection = c);
     * http.request('data.json').subscribe(res => res, err => console.log(err)));
     * connection.mockError(new Error('error'));
     * ```
     *
     */
    MockConnection.prototype.mockError = function (err) {
        // Matches ResourceLoader semantics
        this.readyState = http_1.ReadyState.Done;
        this.response.error(err);
    };
    return MockConnection;
}());
exports.MockConnection = MockConnection;
/**
 * A mock backend for testing the {@link Http} service.
 *
 * This class can be injected in tests, and should be used to override providers
 * to other backends, such as {@link XHRBackend}.
 *
 * ### Example
 *
 * ```
 * import {Injectable, Injector} from '@angular/core';
 * import {async, fakeAsync, tick} from '@angular/core/testing';
 * import {BaseRequestOptions, ConnectionBackend, Http, RequestOptions} from '@angular/http';
 * import {Response, ResponseOptions} from '@angular/http';
 * import {MockBackend, MockConnection} from '@angular/http/testing';
 *
 * const HERO_ONE = 'HeroNrOne';
 * const HERO_TWO = 'WillBeAlwaysTheSecond';
 *
 * @Injectable()
 * class HeroService {
 *   constructor(private http: Http) {}
 *
 *   getHeroes(): Promise<String[]> {
 *     return this.http.get('myservices.de/api/heroes')
 *         .toPromise()
 *         .then(response => response.json().data)
 *         .catch(e => this.handleError(e));
 *   }
 *
 *   private handleError(error: any): Promise<any> {
 *     console.error('An error occurred', error);
 *     return Promise.reject(error.message || error);
 *   }
 * }
 *
 * describe('MockBackend HeroService Example', () => {
 *   beforeEach(() => {
 *     this.injector = Injector.create([
 *       {provide: ConnectionBackend, useClass: MockBackend},
 *       {provide: RequestOptions, useClass: BaseRequestOptions},
 *       Http,
 *       HeroService,
 *     ]);
 *     this.heroService = this.injector.get(HeroService);
 *     this.backend = this.injector.get(ConnectionBackend) as MockBackend;
 *     this.backend.connections.subscribe((connection: any) => this.lastConnection = connection);
 *   });
 *
 *   it('getHeroes() should query current service url', () => {
 *     this.heroService.getHeroes();
 *     expect(this.lastConnection).toBeDefined('no http service connection at all?');
 *     expect(this.lastConnection.request.url).toMatch(/api\/heroes$/, 'url invalid');
 *   });
 *
 *   it('getHeroes() should return some heroes', fakeAsync(() => {
 *        let result: String[];
 *        this.heroService.getHeroes().then((heroes: String[]) => result = heroes);
 *        this.lastConnection.mockRespond(new Response(new ResponseOptions({
 *          body: JSON.stringify({data: [HERO_ONE, HERO_TWO]}),
 *        })));
 *        tick();
 *        expect(result.length).toEqual(2, 'should contain given amount of heroes');
 *        expect(result[0]).toEqual(HERO_ONE, ' HERO_ONE should be the first hero');
 *        expect(result[1]).toEqual(HERO_TWO, ' HERO_TWO should be the second hero');
 *      }));
 *
 *   it('getHeroes() while server is down', fakeAsync(() => {
 *        let result: String[];
 *        let catchedError: any;
 *        this.heroService.getHeroes()
 *            .then((heroes: String[]) => result = heroes)
 *            .catch((error: any) => catchedError = error);
 *        this.lastConnection.mockRespond(new Response(new ResponseOptions({
 *          status: 404,
 *          statusText: 'URL not Found',
 *        })));
 *        tick();
 *        expect(result).toBeUndefined();
 *        expect(catchedError).toBeDefined();
 *      }));
 * });
 * ```
 *
 * This method only exists in the mock implementation, not in real Backends.
 *
 * @experimental
 */
var MockBackend = (function () {
    function MockBackend() {
        var _this = this;
        this.connectionsArray = [];
        this.connections = new Subject_1.Subject();
        this.connections.subscribe(function (connection) { return _this.connectionsArray.push(connection); });
        this.pendingConnections = new Subject_1.Subject();
    }
    /**
     * Checks all connections, and raises an exception if any connection has not received a response.
     *
     * This method only exists in the mock implementation, not in real Backends.
     */
    MockBackend.prototype.verifyNoPendingRequests = function () {
        var pending = 0;
        this.pendingConnections.subscribe(function (c) { return pending++; });
        if (pending > 0)
            throw new Error(pending + " pending connections to be resolved");
    };
    /**
     * Can be used in conjunction with `verifyNoPendingRequests` to resolve any not-yet-resolve
     * connections, if it's expected that there are connections that have not yet received a response.
     *
     * This method only exists in the mock implementation, not in real Backends.
     */
    MockBackend.prototype.resolveAllConnections = function () { this.connections.subscribe(function (c) { return c.readyState = 4; }); };
    /**
     * Creates a new {@link MockConnection}. This is equivalent to calling `new
     * MockConnection()`, except that it also will emit the new `Connection` to the `connections`
     * emitter of this `MockBackend` instance. This method will usually only be used by tests
     * against the framework itself, not by end-users.
     */
    MockBackend.prototype.createConnection = function (req) {
        if (!req || !(req instanceof http_1.Request)) {
            throw new Error("createConnection requires an instance of Request, got " + req);
        }
        var connection = new MockConnection(req);
        this.connections.next(connection);
        return connection;
    };
    return MockBackend;
}());
MockBackend = __decorate([
    core_1.Injectable(),
    __metadata("design:paramtypes", [])
], MockBackend);
exports.MockBackend = MockBackend;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibW9ja19iYWNrZW5kLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vcGFja2FnZXMvaHR0cC90ZXN0aW5nL3NyYy9tb2NrX2JhY2tlbmQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBOzs7Ozs7R0FNRzs7Ozs7Ozs7Ozs7QUFFSCxzQ0FBeUM7QUFDekMsc0NBQTJGO0FBQzNGLG9EQUFpRDtBQUNqRCx3Q0FBcUM7QUFDckMsMkNBQXdDO0FBR3hDOzs7OztHQUtHO0FBQ0g7SUFvQkUsd0JBQVksR0FBWTtRQUN0QixJQUFJLENBQUMsUUFBUSxHQUFRLFdBQUksQ0FBQyxJQUFJLENBQUMsSUFBSSw2QkFBYSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDO1FBQ3hELElBQUksQ0FBQyxVQUFVLEdBQUcsaUJBQVUsQ0FBQyxJQUFJLENBQUM7UUFDbEMsSUFBSSxDQUFDLE9BQU8sR0FBRyxHQUFHLENBQUM7SUFDckIsQ0FBQztJQUVEOzs7Ozs7Ozs7Ozs7OztPQWNHO0lBQ0gsb0NBQVcsR0FBWCxVQUFZLEdBQWE7UUFDdkIsRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLFVBQVUsS0FBSyxpQkFBVSxDQUFDLElBQUksSUFBSSxJQUFJLENBQUMsVUFBVSxLQUFLLGlCQUFVLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQztZQUNwRixNQUFNLElBQUksS0FBSyxDQUFDLHNDQUFzQyxDQUFDLENBQUM7UUFDMUQsQ0FBQztRQUNELElBQUksQ0FBQyxVQUFVLEdBQUcsaUJBQVUsQ0FBQyxJQUFJLENBQUM7UUFDbEMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUM7UUFDeEIsSUFBSSxDQUFDLFFBQVEsQ0FBQyxRQUFRLEVBQUUsQ0FBQztJQUMzQixDQUFDO0lBRUQ7Ozs7O09BS0c7SUFDSCxxQ0FBWSxHQUFaLFVBQWEsR0FBYTtRQUN4Qiw2Q0FBNkM7UUFDN0MsNENBQTRDO1FBQzVDLGlEQUFpRDtRQUNqRCxJQUFJO0lBQ04sQ0FBQztJQUVELGlEQUFpRDtJQUNqRDs7Ozs7Ozs7Ozs7Ozs7T0FjRztJQUNILGtDQUFTLEdBQVQsVUFBVSxHQUFXO1FBQ25CLG1DQUFtQztRQUNuQyxJQUFJLENBQUMsVUFBVSxHQUFHLGlCQUFVLENBQUMsSUFBSSxDQUFDO1FBQ2xDLElBQUksQ0FBQyxRQUFRLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDO0lBQzNCLENBQUM7SUFDSCxxQkFBQztBQUFELENBQUMsQUFwRkQsSUFvRkM7QUFwRlksd0NBQWM7QUFzRjNCOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztHQXNGRztBQUVILElBQWEsV0FBVztJQXVEdEI7UUFBQSxpQkFNQztRQUxDLElBQUksQ0FBQyxnQkFBZ0IsR0FBRyxFQUFFLENBQUM7UUFDM0IsSUFBSSxDQUFDLFdBQVcsR0FBRyxJQUFJLGlCQUFPLEVBQUUsQ0FBQztRQUNqQyxJQUFJLENBQUMsV0FBVyxDQUFDLFNBQVMsQ0FDdEIsVUFBQyxVQUEwQixJQUFLLE9BQUEsS0FBSSxDQUFDLGdCQUFnQixDQUFDLElBQUksQ0FBQyxVQUFVLENBQUMsRUFBdEMsQ0FBc0MsQ0FBQyxDQUFDO1FBQzVFLElBQUksQ0FBQyxrQkFBa0IsR0FBRyxJQUFJLGlCQUFPLEVBQUUsQ0FBQztJQUMxQyxDQUFDO0lBRUQ7Ozs7T0FJRztJQUNILDZDQUF1QixHQUF2QjtRQUNFLElBQUksT0FBTyxHQUFHLENBQUMsQ0FBQztRQUNoQixJQUFJLENBQUMsa0JBQWtCLENBQUMsU0FBUyxDQUFDLFVBQUMsQ0FBaUIsSUFBSyxPQUFBLE9BQU8sRUFBRSxFQUFULENBQVMsQ0FBQyxDQUFDO1FBQ3BFLEVBQUUsQ0FBQyxDQUFDLE9BQU8sR0FBRyxDQUFDLENBQUM7WUFBQyxNQUFNLElBQUksS0FBSyxDQUFJLE9BQU8sd0NBQXFDLENBQUMsQ0FBQztJQUNwRixDQUFDO0lBRUQ7Ozs7O09BS0c7SUFDSCwyQ0FBcUIsR0FBckIsY0FBMEIsSUFBSSxDQUFDLFdBQVcsQ0FBQyxTQUFTLENBQUMsVUFBQyxDQUFpQixJQUFLLE9BQUEsQ0FBQyxDQUFDLFVBQVUsR0FBRyxDQUFDLEVBQWhCLENBQWdCLENBQUMsQ0FBQyxDQUFDLENBQUM7SUFFaEc7Ozs7O09BS0c7SUFDSCxzQ0FBZ0IsR0FBaEIsVUFBaUIsR0FBWTtRQUMzQixFQUFFLENBQUMsQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDLENBQUMsR0FBRyxZQUFZLGNBQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUN0QyxNQUFNLElBQUksS0FBSyxDQUFDLDJEQUF5RCxHQUFLLENBQUMsQ0FBQztRQUNsRixDQUFDO1FBQ0QsSUFBTSxVQUFVLEdBQUcsSUFBSSxjQUFjLENBQUMsR0FBRyxDQUFDLENBQUM7UUFDM0MsSUFBSSxDQUFDLFdBQVcsQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDLENBQUM7UUFDbEMsTUFBTSxDQUFDLFVBQVUsQ0FBQztJQUNwQixDQUFDO0lBQ0gsa0JBQUM7QUFBRCxDQUFDLEFBaEdELElBZ0dDO0FBaEdZLFdBQVc7SUFEdkIsaUJBQVUsRUFBRTs7R0FDQSxXQUFXLENBZ0d2QjtBQWhHWSxrQ0FBVyJ9