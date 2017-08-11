"use strict";
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
Object.defineProperty(exports, "__esModule", { value: true });
/* tslint:disable:no-console  */
urlParamsToForm();
function getIntParameter(name) {
    return parseInt(getStringParameter(name), 10);
}
exports.getIntParameter = getIntParameter;
function getStringParameter(name) {
    var els = document.querySelectorAll("input[name=\"" + name + "\"]");
    var value;
    var el;
    for (var i = 0; i < els.length; i++) {
        el = els[i];
        var type = el.type;
        if ((type != 'radio' && type != 'checkbox') || el.checked) {
            value = el.value;
            break;
        }
    }
    if (value == null) {
        throw new Error("Could not find and input field with name " + name);
    }
    return value;
}
exports.getStringParameter = getStringParameter;
function bindAction(selector, callback) {
    document.querySelector(selector).addEventListener('click', callback);
}
exports.bindAction = bindAction;
function profile(create, destroy, name) {
    return function () {
        window.console.profile(name);
        var duration = 0;
        var count = 0;
        while (count++ < 150) {
            var start = window.performance.now();
            create();
            duration += window.performance.now() - start;
            destroy();
        }
        window.console.profileEnd();
        window.console.log("Iterations: " + count + "; time: " + duration / count + " ms / iteration");
    };
}
exports.profile = profile;
// helper script that will read out the url parameters
// and store them in appropriate form fields on the page
function urlParamsToForm() {
    var regex = /(\w+)=(\w+)/g;
    var search = decodeURIComponent(location.search);
    var match;
    while (match = regex.exec(search)) {
        var name_1 = match[1];
        var value = match[2];
        var els = document.querySelectorAll('input[name="' + name_1 + '"]');
        var el = void 0;
        for (var i = 0; i < els.length; i++) {
            el = els[i];
            if (el.type === 'radio' || el.type === 'checkbox') {
                el.checked = el.value === value;
            }
            else {
                el.value = value;
            }
        }
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidXRpbC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL21vZHVsZXMvYmVuY2htYXJrcy9zcmMvdXRpbC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUE7Ozs7OztHQU1HOztBQUVILGdDQUFnQztBQUNoQyxlQUFlLEVBQUUsQ0FBQztBQUVsQix5QkFBZ0MsSUFBWTtJQUMxQyxNQUFNLENBQUMsUUFBUSxDQUFDLGtCQUFrQixDQUFDLElBQUksQ0FBQyxFQUFFLEVBQUUsQ0FBQyxDQUFDO0FBQ2hELENBQUM7QUFGRCwwQ0FFQztBQUVELDRCQUFtQyxJQUFZO0lBQzdDLElBQU0sR0FBRyxHQUFHLFFBQVEsQ0FBQyxnQkFBZ0IsQ0FBQyxrQkFBZSxJQUFJLFFBQUksQ0FBQyxDQUFDO0lBQy9ELElBQUksS0FBVSxDQUFDO0lBQ2YsSUFBSSxFQUFPLENBQUM7SUFFWixHQUFHLENBQUMsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxNQUFNLEVBQUUsQ0FBQyxFQUFFLEVBQUUsQ0FBQztRQUNwQyxFQUFFLEdBQUcsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQ1osSUFBTSxJQUFJLEdBQUcsRUFBRSxDQUFDLElBQUksQ0FBQztRQUNyQixFQUFFLENBQUMsQ0FBQyxDQUFDLElBQUksSUFBSSxPQUFPLElBQUksSUFBSSxJQUFJLFVBQVUsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDO1lBQzFELEtBQUssR0FBRyxFQUFFLENBQUMsS0FBSyxDQUFDO1lBQ2pCLEtBQUssQ0FBQztRQUNSLENBQUM7SUFDSCxDQUFDO0lBRUQsRUFBRSxDQUFDLENBQUMsS0FBSyxJQUFJLElBQUksQ0FBQyxDQUFDLENBQUM7UUFDbEIsTUFBTSxJQUFJLEtBQUssQ0FBQyw4Q0FBNEMsSUFBTSxDQUFDLENBQUM7SUFDdEUsQ0FBQztJQUVELE1BQU0sQ0FBQyxLQUFLLENBQUM7QUFDZixDQUFDO0FBbkJELGdEQW1CQztBQUVELG9CQUEyQixRQUFnQixFQUFFLFFBQW9CO0lBQy9ELFFBQVEsQ0FBQyxhQUFhLENBQUMsUUFBUSxDQUFHLENBQUMsZ0JBQWdCLENBQUMsT0FBTyxFQUFFLFFBQVEsQ0FBQyxDQUFDO0FBQ3pFLENBQUM7QUFGRCxnQ0FFQztBQUdELGlCQUF3QixNQUFrQixFQUFFLE9BQW1CLEVBQUUsSUFBWTtJQUMzRSxNQUFNLENBQUM7UUFDTCxNQUFNLENBQUMsT0FBTyxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsQ0FBQztRQUM3QixJQUFJLFFBQVEsR0FBRyxDQUFDLENBQUM7UUFDakIsSUFBSSxLQUFLLEdBQUcsQ0FBQyxDQUFDO1FBQ2QsT0FBTyxLQUFLLEVBQUUsR0FBRyxHQUFHLEVBQUUsQ0FBQztZQUNyQixJQUFNLEtBQUssR0FBRyxNQUFNLENBQUMsV0FBVyxDQUFDLEdBQUcsRUFBRSxDQUFDO1lBQ3ZDLE1BQU0sRUFBRSxDQUFDO1lBQ1QsUUFBUSxJQUFJLE1BQU0sQ0FBQyxXQUFXLENBQUMsR0FBRyxFQUFFLEdBQUcsS0FBSyxDQUFDO1lBQzdDLE9BQU8sRUFBRSxDQUFDO1FBQ1osQ0FBQztRQUNELE1BQU0sQ0FBQyxPQUFPLENBQUMsVUFBVSxFQUFFLENBQUM7UUFDNUIsTUFBTSxDQUFDLE9BQU8sQ0FBQyxHQUFHLENBQUMsaUJBQWUsS0FBSyxnQkFBVyxRQUFRLEdBQUcsS0FBSyxvQkFBaUIsQ0FBQyxDQUFDO0lBQ3ZGLENBQUMsQ0FBQztBQUNKLENBQUM7QUFkRCwwQkFjQztBQUVELHNEQUFzRDtBQUN0RCx3REFBd0Q7QUFDeEQ7SUFDRSxJQUFNLEtBQUssR0FBRyxjQUFjLENBQUM7SUFDN0IsSUFBTSxNQUFNLEdBQUcsa0JBQWtCLENBQUMsUUFBUSxDQUFDLE1BQU0sQ0FBQyxDQUFDO0lBQ25ELElBQUksS0FBaUIsQ0FBQztJQUN0QixPQUFPLEtBQUssR0FBRyxLQUFLLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxFQUFFLENBQUM7UUFDbEMsSUFBTSxNQUFJLEdBQUcsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQ3RCLElBQU0sS0FBSyxHQUFHLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUN2QixJQUFNLEdBQUcsR0FBRyxRQUFRLENBQUMsZ0JBQWdCLENBQUMsY0FBYyxHQUFHLE1BQUksR0FBRyxJQUFJLENBQUMsQ0FBQztRQUNwRSxJQUFJLEVBQUUsU0FBSyxDQUFDO1FBQ1osR0FBRyxDQUFDLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxHQUFHLENBQUMsTUFBTSxFQUFFLENBQUMsRUFBRSxFQUFFLENBQUM7WUFDcEMsRUFBRSxHQUFHLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUNaLEVBQUUsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxJQUFJLEtBQUssT0FBTyxJQUFJLEVBQUUsQ0FBQyxJQUFJLEtBQUssVUFBVSxDQUFDLENBQUMsQ0FBQztnQkFDbEQsRUFBRSxDQUFDLE9BQU8sR0FBRyxFQUFFLENBQUMsS0FBSyxLQUFLLEtBQUssQ0FBQztZQUNsQyxDQUFDO1lBQUMsSUFBSSxDQUFDLENBQUM7Z0JBQ04sRUFBRSxDQUFDLEtBQUssR0FBRyxLQUFLLENBQUM7WUFDbkIsQ0FBQztRQUNILENBQUM7SUFDSCxDQUFDO0FBQ0gsQ0FBQyJ9