"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
var compiler_1 = require("@angular/compiler");
var core_1 = require("@angular/core");
var ResourceLoaderImpl = (function (_super) {
    __extends(ResourceLoaderImpl, _super);
    function ResourceLoaderImpl() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    ResourceLoaderImpl.prototype.get = function (url) {
        var resolve;
        var reject;
        var promise = new Promise(function (res, rej) {
            resolve = res;
            reject = rej;
        });
        var xhr = new XMLHttpRequest();
        xhr.open('GET', url, true);
        xhr.responseType = 'text';
        xhr.onload = function () {
            // responseText is the old-school way of retrieving response (supported by IE8 & 9)
            // response/responseType properties were introduced in ResourceLoader Level2 spec (supported
            // by IE10)
            var response = xhr.response || xhr.responseText;
            // normalize IE9 bug (http://bugs.jquery.com/ticket/1450)
            var status = xhr.status === 1223 ? 204 : xhr.status;
            // fix status code when it is 0 (0 status is undocumented).
            // Occurs when accessing file resources or on Android 4.1 stock browser
            // while retrieving files from application cache.
            if (status === 0) {
                status = response ? 200 : 0;
            }
            if (200 <= status && status <= 300) {
                resolve(response);
            }
            else {
                reject("Failed to load " + url);
            }
        };
        xhr.onerror = function () { reject("Failed to load " + url); };
        xhr.send();
        return promise;
    };
    return ResourceLoaderImpl;
}(compiler_1.ResourceLoader));
ResourceLoaderImpl = __decorate([
    core_1.Injectable()
], ResourceLoaderImpl);
exports.ResourceLoaderImpl = ResourceLoaderImpl;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicmVzb3VyY2VfbG9hZGVyX2ltcGwuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi9wYWNrYWdlcy9wbGF0Zm9ybS1icm93c2VyLWR5bmFtaWMvc3JjL3Jlc291cmNlX2xvYWRlci9yZXNvdXJjZV9sb2FkZXJfaW1wbC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQTs7Ozs7O0dBTUc7QUFDSCw4Q0FBaUQ7QUFDakQsc0NBQXlDO0FBSXpDLElBQWEsa0JBQWtCO0lBQVMsc0NBQWM7SUFBdEQ7O0lBd0NBLENBQUM7SUF2Q0MsZ0NBQUcsR0FBSCxVQUFJLEdBQVc7UUFDYixJQUFJLE9BQThCLENBQUM7UUFDbkMsSUFBSSxNQUE0QixDQUFDO1FBQ2pDLElBQU0sT0FBTyxHQUFHLElBQUksT0FBTyxDQUFTLFVBQUMsR0FBRyxFQUFFLEdBQUc7WUFDM0MsT0FBTyxHQUFHLEdBQUcsQ0FBQztZQUNkLE1BQU0sR0FBRyxHQUFHLENBQUM7UUFDZixDQUFDLENBQUMsQ0FBQztRQUNILElBQU0sR0FBRyxHQUFHLElBQUksY0FBYyxFQUFFLENBQUM7UUFDakMsR0FBRyxDQUFDLElBQUksQ0FBQyxLQUFLLEVBQUUsR0FBRyxFQUFFLElBQUksQ0FBQyxDQUFDO1FBQzNCLEdBQUcsQ0FBQyxZQUFZLEdBQUcsTUFBTSxDQUFDO1FBRTFCLEdBQUcsQ0FBQyxNQUFNLEdBQUc7WUFDWCxtRkFBbUY7WUFDbkYsNEZBQTRGO1lBQzVGLFdBQVc7WUFDWCxJQUFNLFFBQVEsR0FBRyxHQUFHLENBQUMsUUFBUSxJQUFJLEdBQUcsQ0FBQyxZQUFZLENBQUM7WUFFbEQseURBQXlEO1lBQ3pELElBQUksTUFBTSxHQUFHLEdBQUcsQ0FBQyxNQUFNLEtBQUssSUFBSSxHQUFHLEdBQUcsR0FBRyxHQUFHLENBQUMsTUFBTSxDQUFDO1lBRXBELDJEQUEyRDtZQUMzRCx1RUFBdUU7WUFDdkUsaURBQWlEO1lBQ2pELEVBQUUsQ0FBQyxDQUFDLE1BQU0sS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDO2dCQUNqQixNQUFNLEdBQUcsUUFBUSxHQUFHLEdBQUcsR0FBRyxDQUFDLENBQUM7WUFDOUIsQ0FBQztZQUVELEVBQUUsQ0FBQyxDQUFDLEdBQUcsSUFBSSxNQUFNLElBQUksTUFBTSxJQUFJLEdBQUcsQ0FBQyxDQUFDLENBQUM7Z0JBQ25DLE9BQU8sQ0FBQyxRQUFRLENBQUMsQ0FBQztZQUNwQixDQUFDO1lBQUMsSUFBSSxDQUFDLENBQUM7Z0JBQ04sTUFBTSxDQUFDLG9CQUFrQixHQUFLLENBQUMsQ0FBQztZQUNsQyxDQUFDO1FBQ0gsQ0FBQyxDQUFDO1FBRUYsR0FBRyxDQUFDLE9BQU8sR0FBRyxjQUFhLE1BQU0sQ0FBQyxvQkFBa0IsR0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFFOUQsR0FBRyxDQUFDLElBQUksRUFBRSxDQUFDO1FBQ1gsTUFBTSxDQUFDLE9BQU8sQ0FBQztJQUNqQixDQUFDO0lBQ0gseUJBQUM7QUFBRCxDQUFDLEFBeENELENBQXdDLHlCQUFjLEdBd0NyRDtBQXhDWSxrQkFBa0I7SUFEOUIsaUJBQVUsRUFBRTtHQUNBLGtCQUFrQixDQXdDOUI7QUF4Q1ksZ0RBQWtCIn0=