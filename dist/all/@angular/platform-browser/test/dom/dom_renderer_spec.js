"use strict";
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
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
var core_1 = require("@angular/core");
var testing_1 = require("@angular/core/testing");
var by_1 = require("@angular/platform-browser/src/dom/debug/by");
var browser_util_1 = require("@angular/platform-browser/testing/src/browser_util");
var matchers_1 = require("@angular/platform-browser/testing/src/matchers");
var dom_renderer_1 = require("../../src/dom/dom_renderer");
function main() {
    describe('DefaultDomRendererV2', function () {
        var renderer;
        beforeEach(function () {
            testing_1.TestBed.configureTestingModule({
                declarations: [
                    TestCmp, SomeApp, CmpEncapsulationEmulated, CmpEncapsulationNative, CmpEncapsulationNone
                ]
            });
            renderer = testing_1.TestBed.createComponent(TestCmp).componentInstance.renderer;
        });
        describe('setAttribute', function () {
            describe('with namespace', function () {
                it('xmlns', function () { return shouldSetAttributeWithNs('xmlns'); });
                it('xml', function () { return shouldSetAttributeWithNs('xml'); });
                it('svg', function () { return shouldSetAttributeWithNs('svg'); });
                it('xhtml', function () { return shouldSetAttributeWithNs('xhtml'); });
                it('xlink', function () { return shouldSetAttributeWithNs('xlink'); });
                it('unknown', function () {
                    var div = document.createElement('div');
                    matchers_1.expect(div.hasAttribute('unknown:name')).toBe(false);
                    renderer.setAttribute(div, 'name', 'value', 'unknown');
                    matchers_1.expect(div.getAttribute('unknown:name')).toBe('value');
                });
                function shouldSetAttributeWithNs(namespace) {
                    var namespaceUri = dom_renderer_1.NAMESPACE_URIS[namespace];
                    var div = document.createElement('div');
                    matchers_1.expect(div.hasAttributeNS(namespaceUri, 'name')).toBe(false);
                    renderer.setAttribute(div, 'name', 'value', namespace);
                    matchers_1.expect(div.getAttributeNS(namespaceUri, 'name')).toBe('value');
                }
            });
        });
        describe('removeAttribute', function () {
            describe('with namespace', function () {
                it('xmlns', function () { return shouldRemoveAttributeWithNs('xmlns'); });
                it('xml', function () { return shouldRemoveAttributeWithNs('xml'); });
                it('svg', function () { return shouldRemoveAttributeWithNs('svg'); });
                it('xhtml', function () { return shouldRemoveAttributeWithNs('xhtml'); });
                it('xlink', function () { return shouldRemoveAttributeWithNs('xlink'); });
                it('unknown', function () {
                    var div = document.createElement('div');
                    div.setAttribute('unknown:name', 'value');
                    matchers_1.expect(div.hasAttribute('unknown:name')).toBe(true);
                    renderer.removeAttribute(div, 'name', 'unknown');
                    matchers_1.expect(div.hasAttribute('unknown:name')).toBe(false);
                });
                function shouldRemoveAttributeWithNs(namespace) {
                    var namespaceUri = dom_renderer_1.NAMESPACE_URIS[namespace];
                    var div = document.createElement('div');
                    div.setAttributeNS(namespaceUri, namespace + ":name", 'value');
                    matchers_1.expect(div.hasAttributeNS(namespaceUri, 'name')).toBe(true);
                    renderer.removeAttribute(div, 'name', namespace);
                    matchers_1.expect(div.hasAttributeNS(namespaceUri, 'name')).toBe(false);
                }
            });
        });
        // other browsers don't support shadow dom
        if (browser_util_1.browserDetection.isChromeDesktop) {
            it('should allow to style components with emulated encapsulation and no encapsulation inside of components with shadow DOM', function () {
                var fixture = testing_1.TestBed.createComponent(SomeApp);
                var cmp = fixture.debugElement.query(by_1.By.css('cmp-native')).nativeElement;
                var native = cmp.shadowRoot.querySelector('.native');
                matchers_1.expect(window.getComputedStyle(native).color).toEqual('rgb(255, 0, 0)');
                var emulated = cmp.shadowRoot.querySelector('.emulated');
                matchers_1.expect(window.getComputedStyle(emulated).color).toEqual('rgb(0, 0, 255)');
                var none = cmp.shadowRoot.querySelector('.none');
                matchers_1.expect(window.getComputedStyle(none).color).toEqual('rgb(0, 255, 0)');
            });
        }
    });
}
exports.main = main;
var CmpEncapsulationNative = (function () {
    function CmpEncapsulationNative() {
    }
    return CmpEncapsulationNative;
}());
CmpEncapsulationNative = __decorate([
    core_1.Component({
        selector: 'cmp-native',
        template: "<div class=\"native\"></div><cmp-emulated></cmp-emulated><cmp-none></cmp-none>",
        styles: [".native { color: red; }"],
        encapsulation: core_1.ViewEncapsulation.Native
    })
], CmpEncapsulationNative);
var CmpEncapsulationEmulated = (function () {
    function CmpEncapsulationEmulated() {
    }
    return CmpEncapsulationEmulated;
}());
CmpEncapsulationEmulated = __decorate([
    core_1.Component({
        selector: 'cmp-emulated',
        template: "<div class=\"emulated\"></div>",
        styles: [".emulated { color: blue; }"],
        encapsulation: core_1.ViewEncapsulation.Emulated
    })
], CmpEncapsulationEmulated);
var CmpEncapsulationNone = (function () {
    function CmpEncapsulationNone() {
    }
    return CmpEncapsulationNone;
}());
CmpEncapsulationNone = __decorate([
    core_1.Component({
        selector: 'cmp-none',
        template: "<div class=\"none\"></div>",
        styles: [".none { color: lime; }"],
        encapsulation: core_1.ViewEncapsulation.None
    })
], CmpEncapsulationNone);
var SomeApp = (function () {
    function SomeApp() {
    }
    return SomeApp;
}());
SomeApp = __decorate([
    core_1.Component({
        selector: 'some-app',
        template: "\n\t  <cmp-native></cmp-native>\n\t  <cmp-emulated></cmp-emulated>\n\t  <cmp-none></cmp-none>\n  ",
    })
], SomeApp);
exports.SomeApp = SomeApp;
var TestCmp = (function () {
    function TestCmp(renderer) {
        this.renderer = renderer;
    }
    return TestCmp;
}());
TestCmp = __decorate([
    core_1.Component({ selector: 'test-cmp', template: '' }),
    __metadata("design:paramtypes", [core_1.Renderer2])
], TestCmp);
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZG9tX3JlbmRlcmVyX3NwZWMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi9wYWNrYWdlcy9wbGF0Zm9ybS1icm93c2VyL3Rlc3QvZG9tL2RvbV9yZW5kZXJlcl9zcGVjLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7O0FBQUE7Ozs7OztHQU1HO0FBQ0gsc0NBQXNFO0FBQ3RFLGlEQUE4QztBQUM5QyxpRUFBOEQ7QUFDOUQsbUZBQW9GO0FBQ3BGLDJFQUFzRTtBQUN0RSwyREFBMEQ7QUFFMUQ7SUFDRSxRQUFRLENBQUMsc0JBQXNCLEVBQUU7UUFDL0IsSUFBSSxRQUFtQixDQUFDO1FBRXhCLFVBQVUsQ0FBQztZQUNULGlCQUFPLENBQUMsc0JBQXNCLENBQUM7Z0JBQzdCLFlBQVksRUFBRTtvQkFDWixPQUFPLEVBQUUsT0FBTyxFQUFFLHdCQUF3QixFQUFFLHNCQUFzQixFQUFFLG9CQUFvQjtpQkFDekY7YUFDRixDQUFDLENBQUM7WUFDSCxRQUFRLEdBQUcsaUJBQU8sQ0FBQyxlQUFlLENBQUMsT0FBTyxDQUFDLENBQUMsaUJBQWlCLENBQUMsUUFBUSxDQUFDO1FBQ3pFLENBQUMsQ0FBQyxDQUFDO1FBRUgsUUFBUSxDQUFDLGNBQWMsRUFBRTtZQUN2QixRQUFRLENBQUMsZ0JBQWdCLEVBQUU7Z0JBQ3pCLEVBQUUsQ0FBQyxPQUFPLEVBQUUsY0FBTSxPQUFBLHdCQUF3QixDQUFDLE9BQU8sQ0FBQyxFQUFqQyxDQUFpQyxDQUFDLENBQUM7Z0JBQ3JELEVBQUUsQ0FBQyxLQUFLLEVBQUUsY0FBTSxPQUFBLHdCQUF3QixDQUFDLEtBQUssQ0FBQyxFQUEvQixDQUErQixDQUFDLENBQUM7Z0JBQ2pELEVBQUUsQ0FBQyxLQUFLLEVBQUUsY0FBTSxPQUFBLHdCQUF3QixDQUFDLEtBQUssQ0FBQyxFQUEvQixDQUErQixDQUFDLENBQUM7Z0JBQ2pELEVBQUUsQ0FBQyxPQUFPLEVBQUUsY0FBTSxPQUFBLHdCQUF3QixDQUFDLE9BQU8sQ0FBQyxFQUFqQyxDQUFpQyxDQUFDLENBQUM7Z0JBQ3JELEVBQUUsQ0FBQyxPQUFPLEVBQUUsY0FBTSxPQUFBLHdCQUF3QixDQUFDLE9BQU8sQ0FBQyxFQUFqQyxDQUFpQyxDQUFDLENBQUM7Z0JBRXJELEVBQUUsQ0FBQyxTQUFTLEVBQUU7b0JBQ1osSUFBTSxHQUFHLEdBQUcsUUFBUSxDQUFDLGFBQWEsQ0FBQyxLQUFLLENBQUMsQ0FBQztvQkFDMUMsaUJBQU0sQ0FBQyxHQUFHLENBQUMsWUFBWSxDQUFDLGNBQWMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDO29CQUVyRCxRQUFRLENBQUMsWUFBWSxDQUFDLEdBQUcsRUFBRSxNQUFNLEVBQUUsT0FBTyxFQUFFLFNBQVMsQ0FBQyxDQUFDO29CQUV2RCxpQkFBTSxDQUFDLEdBQUcsQ0FBQyxZQUFZLENBQUMsY0FBYyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUM7Z0JBQ3pELENBQUMsQ0FBQyxDQUFDO2dCQUVILGtDQUFrQyxTQUFpQjtvQkFDakQsSUFBTSxZQUFZLEdBQUcsNkJBQWMsQ0FBQyxTQUFTLENBQUMsQ0FBQztvQkFDL0MsSUFBTSxHQUFHLEdBQUcsUUFBUSxDQUFDLGFBQWEsQ0FBQyxLQUFLLENBQUMsQ0FBQztvQkFDMUMsaUJBQU0sQ0FBQyxHQUFHLENBQUMsY0FBYyxDQUFDLFlBQVksRUFBRSxNQUFNLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQztvQkFFN0QsUUFBUSxDQUFDLFlBQVksQ0FBQyxHQUFHLEVBQUUsTUFBTSxFQUFFLE9BQU8sRUFBRSxTQUFTLENBQUMsQ0FBQztvQkFFdkQsaUJBQU0sQ0FBQyxHQUFHLENBQUMsY0FBYyxDQUFDLFlBQVksRUFBRSxNQUFNLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQztnQkFDakUsQ0FBQztZQUNILENBQUMsQ0FBQyxDQUFDO1FBQ0wsQ0FBQyxDQUFDLENBQUM7UUFFSCxRQUFRLENBQUMsaUJBQWlCLEVBQUU7WUFDMUIsUUFBUSxDQUFDLGdCQUFnQixFQUFFO2dCQUN6QixFQUFFLENBQUMsT0FBTyxFQUFFLGNBQU0sT0FBQSwyQkFBMkIsQ0FBQyxPQUFPLENBQUMsRUFBcEMsQ0FBb0MsQ0FBQyxDQUFDO2dCQUN4RCxFQUFFLENBQUMsS0FBSyxFQUFFLGNBQU0sT0FBQSwyQkFBMkIsQ0FBQyxLQUFLLENBQUMsRUFBbEMsQ0FBa0MsQ0FBQyxDQUFDO2dCQUNwRCxFQUFFLENBQUMsS0FBSyxFQUFFLGNBQU0sT0FBQSwyQkFBMkIsQ0FBQyxLQUFLLENBQUMsRUFBbEMsQ0FBa0MsQ0FBQyxDQUFDO2dCQUNwRCxFQUFFLENBQUMsT0FBTyxFQUFFLGNBQU0sT0FBQSwyQkFBMkIsQ0FBQyxPQUFPLENBQUMsRUFBcEMsQ0FBb0MsQ0FBQyxDQUFDO2dCQUN4RCxFQUFFLENBQUMsT0FBTyxFQUFFLGNBQU0sT0FBQSwyQkFBMkIsQ0FBQyxPQUFPLENBQUMsRUFBcEMsQ0FBb0MsQ0FBQyxDQUFDO2dCQUV4RCxFQUFFLENBQUMsU0FBUyxFQUFFO29CQUNaLElBQU0sR0FBRyxHQUFHLFFBQVEsQ0FBQyxhQUFhLENBQUMsS0FBSyxDQUFDLENBQUM7b0JBQzFDLEdBQUcsQ0FBQyxZQUFZLENBQUMsY0FBYyxFQUFFLE9BQU8sQ0FBQyxDQUFDO29CQUMxQyxpQkFBTSxDQUFDLEdBQUcsQ0FBQyxZQUFZLENBQUMsY0FBYyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7b0JBRXBELFFBQVEsQ0FBQyxlQUFlLENBQUMsR0FBRyxFQUFFLE1BQU0sRUFBRSxTQUFTLENBQUMsQ0FBQztvQkFFakQsaUJBQU0sQ0FBQyxHQUFHLENBQUMsWUFBWSxDQUFDLGNBQWMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDO2dCQUN2RCxDQUFDLENBQUMsQ0FBQztnQkFFSCxxQ0FBcUMsU0FBaUI7b0JBQ3BELElBQU0sWUFBWSxHQUFHLDZCQUFjLENBQUMsU0FBUyxDQUFDLENBQUM7b0JBQy9DLElBQU0sR0FBRyxHQUFHLFFBQVEsQ0FBQyxhQUFhLENBQUMsS0FBSyxDQUFDLENBQUM7b0JBQzFDLEdBQUcsQ0FBQyxjQUFjLENBQUMsWUFBWSxFQUFLLFNBQVMsVUFBTyxFQUFFLE9BQU8sQ0FBQyxDQUFDO29CQUMvRCxpQkFBTSxDQUFDLEdBQUcsQ0FBQyxjQUFjLENBQUMsWUFBWSxFQUFFLE1BQU0sQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO29CQUU1RCxRQUFRLENBQUMsZUFBZSxDQUFDLEdBQUcsRUFBRSxNQUFNLEVBQUUsU0FBUyxDQUFDLENBQUM7b0JBRWpELGlCQUFNLENBQUMsR0FBRyxDQUFDLGNBQWMsQ0FBQyxZQUFZLEVBQUUsTUFBTSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUM7Z0JBQy9ELENBQUM7WUFDSCxDQUFDLENBQUMsQ0FBQztRQUNMLENBQUMsQ0FBQyxDQUFDO1FBRUgsMENBQTBDO1FBQzFDLEVBQUUsQ0FBQyxDQUFDLCtCQUFnQixDQUFDLGVBQWUsQ0FBQyxDQUFDLENBQUM7WUFDckMsRUFBRSxDQUFDLHdIQUF3SCxFQUN4SDtnQkFDRSxJQUFNLE9BQU8sR0FBRyxpQkFBTyxDQUFDLGVBQWUsQ0FBQyxPQUFPLENBQUMsQ0FBQztnQkFFakQsSUFBTSxHQUFHLEdBQUcsT0FBTyxDQUFDLFlBQVksQ0FBQyxLQUFLLENBQUMsT0FBRSxDQUFDLEdBQUcsQ0FBQyxZQUFZLENBQUMsQ0FBQyxDQUFDLGFBQWEsQ0FBQztnQkFHM0UsSUFBTSxNQUFNLEdBQUcsR0FBRyxDQUFDLFVBQVUsQ0FBQyxhQUFhLENBQUMsU0FBUyxDQUFDLENBQUM7Z0JBQ3ZELGlCQUFNLENBQUMsTUFBTSxDQUFDLGdCQUFnQixDQUFDLE1BQU0sQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLE9BQU8sQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFDO2dCQUV4RSxJQUFNLFFBQVEsR0FBRyxHQUFHLENBQUMsVUFBVSxDQUFDLGFBQWEsQ0FBQyxXQUFXLENBQUMsQ0FBQztnQkFDM0QsaUJBQU0sQ0FBQyxNQUFNLENBQUMsZ0JBQWdCLENBQUMsUUFBUSxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsT0FBTyxDQUFDLGdCQUFnQixDQUFDLENBQUM7Z0JBRTFFLElBQU0sSUFBSSxHQUFHLEdBQUcsQ0FBQyxVQUFVLENBQUMsYUFBYSxDQUFDLE9BQU8sQ0FBQyxDQUFDO2dCQUNuRCxpQkFBTSxDQUFDLE1BQU0sQ0FBQyxnQkFBZ0IsQ0FBQyxJQUFJLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxPQUFPLENBQUMsZ0JBQWdCLENBQUMsQ0FBQztZQUN4RSxDQUFDLENBQUMsQ0FBQztRQUNSLENBQUM7SUFDSCxDQUFDLENBQUMsQ0FBQztBQUNMLENBQUM7QUE3RkQsb0JBNkZDO0FBUUQsSUFBTSxzQkFBc0I7SUFBNUI7SUFDQSxDQUFDO0lBQUQsNkJBQUM7QUFBRCxDQUFDLEFBREQsSUFDQztBQURLLHNCQUFzQjtJQU4zQixnQkFBUyxDQUFDO1FBQ1QsUUFBUSxFQUFFLFlBQVk7UUFDdEIsUUFBUSxFQUFFLGdGQUE4RTtRQUN4RixNQUFNLEVBQUUsQ0FBQyx5QkFBeUIsQ0FBQztRQUNuQyxhQUFhLEVBQUUsd0JBQWlCLENBQUMsTUFBTTtLQUN4QyxDQUFDO0dBQ0ksc0JBQXNCLENBQzNCO0FBUUQsSUFBTSx3QkFBd0I7SUFBOUI7SUFDQSxDQUFDO0lBQUQsK0JBQUM7QUFBRCxDQUFDLEFBREQsSUFDQztBQURLLHdCQUF3QjtJQU43QixnQkFBUyxDQUFDO1FBQ1QsUUFBUSxFQUFFLGNBQWM7UUFDeEIsUUFBUSxFQUFFLGdDQUE4QjtRQUN4QyxNQUFNLEVBQUUsQ0FBQyw0QkFBNEIsQ0FBQztRQUN0QyxhQUFhLEVBQUUsd0JBQWlCLENBQUMsUUFBUTtLQUMxQyxDQUFDO0dBQ0ksd0JBQXdCLENBQzdCO0FBUUQsSUFBTSxvQkFBb0I7SUFBMUI7SUFDQSxDQUFDO0lBQUQsMkJBQUM7QUFBRCxDQUFDLEFBREQsSUFDQztBQURLLG9CQUFvQjtJQU56QixnQkFBUyxDQUFDO1FBQ1QsUUFBUSxFQUFFLFVBQVU7UUFDcEIsUUFBUSxFQUFFLDRCQUEwQjtRQUNwQyxNQUFNLEVBQUUsQ0FBQyx3QkFBd0IsQ0FBQztRQUNsQyxhQUFhLEVBQUUsd0JBQWlCLENBQUMsSUFBSTtLQUN0QyxDQUFDO0dBQ0ksb0JBQW9CLENBQ3pCO0FBVUQsSUFBYSxPQUFPO0lBQXBCO0lBQ0EsQ0FBQztJQUFELGNBQUM7QUFBRCxDQUFDLEFBREQsSUFDQztBQURZLE9BQU87SUFSbkIsZ0JBQVMsQ0FBQztRQUNULFFBQVEsRUFBRSxVQUFVO1FBQ3BCLFFBQVEsRUFBRSxtR0FJVDtLQUNGLENBQUM7R0FDVyxPQUFPLENBQ25CO0FBRFksMEJBQU87QUFJcEIsSUFBTSxPQUFPO0lBQ1gsaUJBQW1CLFFBQW1CO1FBQW5CLGFBQVEsR0FBUixRQUFRLENBQVc7SUFBRyxDQUFDO0lBQzVDLGNBQUM7QUFBRCxDQUFDLEFBRkQsSUFFQztBQUZLLE9BQU87SUFEWixnQkFBUyxDQUFDLEVBQUMsUUFBUSxFQUFFLFVBQVUsRUFBRSxRQUFRLEVBQUUsRUFBRSxFQUFDLENBQUM7cUNBRWpCLGdCQUFTO0dBRGxDLE9BQU8sQ0FFWiJ9