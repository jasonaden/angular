"use strict";
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
Object.defineProperty(exports, "__esModule", { value: true });
var enums_1 = require("./enums");
function normalizeMethodName(method) {
    if (typeof method !== 'string')
        return method;
    switch (method.toUpperCase()) {
        case 'GET':
            return enums_1.RequestMethod.Get;
        case 'POST':
            return enums_1.RequestMethod.Post;
        case 'PUT':
            return enums_1.RequestMethod.Put;
        case 'DELETE':
            return enums_1.RequestMethod.Delete;
        case 'OPTIONS':
            return enums_1.RequestMethod.Options;
        case 'HEAD':
            return enums_1.RequestMethod.Head;
        case 'PATCH':
            return enums_1.RequestMethod.Patch;
    }
    throw new Error("Invalid request method. The method \"" + method + "\" is not supported.");
}
exports.normalizeMethodName = normalizeMethodName;
exports.isSuccess = function (status) { return (status >= 200 && status < 300); };
function getResponseURL(xhr) {
    if ('responseURL' in xhr) {
        return xhr.responseURL;
    }
    if (/^X-Request-URL:/m.test(xhr.getAllResponseHeaders())) {
        return xhr.getResponseHeader('X-Request-URL');
    }
    return null;
}
exports.getResponseURL = getResponseURL;
function stringToArrayBuffer8(input) {
    var view = new Uint8Array(input.length);
    for (var i = 0, strLen = input.length; i < strLen; i++) {
        view[i] = input.charCodeAt(i);
    }
    return view.buffer;
}
exports.stringToArrayBuffer8 = stringToArrayBuffer8;
function stringToArrayBuffer(input) {
    var view = new Uint16Array(input.length);
    for (var i = 0, strLen = input.length; i < strLen; i++) {
        view[i] = input.charCodeAt(i);
    }
    return view.buffer;
}
exports.stringToArrayBuffer = stringToArrayBuffer;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaHR0cF91dGlscy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uL3BhY2thZ2VzL2h0dHAvc3JjL2h0dHBfdXRpbHMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBOzs7Ozs7R0FNRzs7QUFFSCxpQ0FBc0M7QUFFdEMsNkJBQW9DLE1BQThCO0lBQ2hFLEVBQUUsQ0FBQyxDQUFDLE9BQU8sTUFBTSxLQUFLLFFBQVEsQ0FBQztRQUFDLE1BQU0sQ0FBQyxNQUFNLENBQUM7SUFFOUMsTUFBTSxDQUFDLENBQUMsTUFBTSxDQUFDLFdBQVcsRUFBRSxDQUFDLENBQUMsQ0FBQztRQUM3QixLQUFLLEtBQUs7WUFDUixNQUFNLENBQUMscUJBQWEsQ0FBQyxHQUFHLENBQUM7UUFDM0IsS0FBSyxNQUFNO1lBQ1QsTUFBTSxDQUFDLHFCQUFhLENBQUMsSUFBSSxDQUFDO1FBQzVCLEtBQUssS0FBSztZQUNSLE1BQU0sQ0FBQyxxQkFBYSxDQUFDLEdBQUcsQ0FBQztRQUMzQixLQUFLLFFBQVE7WUFDWCxNQUFNLENBQUMscUJBQWEsQ0FBQyxNQUFNLENBQUM7UUFDOUIsS0FBSyxTQUFTO1lBQ1osTUFBTSxDQUFDLHFCQUFhLENBQUMsT0FBTyxDQUFDO1FBQy9CLEtBQUssTUFBTTtZQUNULE1BQU0sQ0FBQyxxQkFBYSxDQUFDLElBQUksQ0FBQztRQUM1QixLQUFLLE9BQU87WUFDVixNQUFNLENBQUMscUJBQWEsQ0FBQyxLQUFLLENBQUM7SUFDL0IsQ0FBQztJQUNELE1BQU0sSUFBSSxLQUFLLENBQUMsMENBQXVDLE1BQU0seUJBQXFCLENBQUMsQ0FBQztBQUN0RixDQUFDO0FBcEJELGtEQW9CQztBQUVZLFFBQUEsU0FBUyxHQUFHLFVBQUMsTUFBYyxJQUFjLE9BQUEsQ0FBQyxNQUFNLElBQUksR0FBRyxJQUFJLE1BQU0sR0FBRyxHQUFHLENBQUMsRUFBL0IsQ0FBK0IsQ0FBQztBQUV0Rix3QkFBK0IsR0FBUTtJQUNyQyxFQUFFLENBQUMsQ0FBQyxhQUFhLElBQUksR0FBRyxDQUFDLENBQUMsQ0FBQztRQUN6QixNQUFNLENBQUMsR0FBRyxDQUFDLFdBQVcsQ0FBQztJQUN6QixDQUFDO0lBQ0QsRUFBRSxDQUFDLENBQUMsa0JBQWtCLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxxQkFBcUIsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQ3pELE1BQU0sQ0FBQyxHQUFHLENBQUMsaUJBQWlCLENBQUMsZUFBZSxDQUFDLENBQUM7SUFDaEQsQ0FBQztJQUNELE1BQU0sQ0FBQyxJQUFJLENBQUM7QUFDZCxDQUFDO0FBUkQsd0NBUUM7QUFFRCw4QkFBcUMsS0FBYTtJQUNoRCxJQUFNLElBQUksR0FBRyxJQUFJLFVBQVUsQ0FBQyxLQUFLLENBQUMsTUFBTSxDQUFDLENBQUM7SUFDMUMsR0FBRyxDQUFDLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLE1BQU0sR0FBRyxLQUFLLENBQUMsTUFBTSxFQUFFLENBQUMsR0FBRyxNQUFNLEVBQUUsQ0FBQyxFQUFFLEVBQUUsQ0FBQztRQUN2RCxJQUFJLENBQUMsQ0FBQyxDQUFDLEdBQUcsS0FBSyxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUMsQ0FBQztJQUNoQyxDQUFDO0lBQ0QsTUFBTSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUM7QUFDckIsQ0FBQztBQU5ELG9EQU1DO0FBR0QsNkJBQW9DLEtBQWE7SUFDL0MsSUFBTSxJQUFJLEdBQUcsSUFBSSxXQUFXLENBQUMsS0FBSyxDQUFDLE1BQU0sQ0FBQyxDQUFDO0lBQzNDLEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxNQUFNLEdBQUcsS0FBSyxDQUFDLE1BQU0sRUFBRSxDQUFDLEdBQUcsTUFBTSxFQUFFLENBQUMsRUFBRSxFQUFFLENBQUM7UUFDdkQsSUFBSSxDQUFDLENBQUMsQ0FBQyxHQUFHLEtBQUssQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDLENBQUM7SUFDaEMsQ0FBQztJQUNELE1BQU0sQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDO0FBQ3JCLENBQUM7QUFORCxrREFNQyJ9