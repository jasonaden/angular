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
var testing_1 = require("@angular/core/testing");
var dom_adapter_1 = require("@angular/platform-browser/src/dom/dom_adapter");
var dom_sanitization_service_1 = require("@angular/platform-browser/src/security/dom_sanitization_service");
function main() {
    describe('jit', function () { declareTests({ useJit: true }); });
    describe('no jit', function () { declareTests({ useJit: false }); });
}
exports.main = main;
var SecuredComponent = (function () {
    function SecuredComponent() {
        this.ctxProp = 'some value';
    }
    return SecuredComponent;
}());
SecuredComponent = __decorate([
    core_1.Component({ selector: 'my-comp', template: '' })
], SecuredComponent);
var OnPrefixDir = (function () {
    function OnPrefixDir() {
    }
    return OnPrefixDir;
}());
__decorate([
    core_1.Input(),
    __metadata("design:type", Object)
], OnPrefixDir.prototype, "onPrefixedProp", void 0);
__decorate([
    core_1.Input(),
    __metadata("design:type", Object)
], OnPrefixDir.prototype, "onclick", void 0);
OnPrefixDir = __decorate([
    core_1.Directive({ selector: '[onPrefixedProp]' })
], OnPrefixDir);
function declareTests(_a) {
    var useJit = _a.useJit;
    describe('security integration tests', function () {
        beforeEach(function () {
            testing_1.TestBed.configureCompiler({ useJit: useJit }).configureTestingModule({
                declarations: [
                    SecuredComponent,
                    OnPrefixDir,
                ]
            });
        });
        var originalLog;
        beforeEach(function () {
            originalLog = dom_adapter_1.getDOM().log;
            dom_adapter_1.getDOM().log = function (msg) { };
        });
        afterEach(function () { dom_adapter_1.getDOM().log = originalLog; });
        describe('events', function () {
            it('should disallow binding to attr.on*', function () {
                var template = "<div [attr.onclick]=\"ctxProp\"></div>";
                testing_1.TestBed.overrideComponent(SecuredComponent, { set: { template: template } });
                expect(function () { return testing_1.TestBed.createComponent(SecuredComponent); })
                    .toThrowError(/Binding to event attribute 'onclick' is disallowed for security reasons, please use \(click\)=.../);
            });
            it('should disallow binding to on* with NO_ERRORS_SCHEMA', function () {
                var template = "<div [onclick]=\"ctxProp\"></div>";
                testing_1.TestBed.overrideComponent(SecuredComponent, { set: { template: template } }).configureTestingModule({
                    schemas: [core_1.NO_ERRORS_SCHEMA]
                });
                expect(function () { return testing_1.TestBed.createComponent(SecuredComponent); })
                    .toThrowError(/Binding to event property 'onclick' is disallowed for security reasons, please use \(click\)=.../);
            });
            it('should disallow binding to on* unless it is consumed by a directive', function () {
                var template = "<div [onPrefixedProp]=\"ctxProp\" [onclick]=\"ctxProp\"></div>";
                testing_1.TestBed.overrideComponent(SecuredComponent, { set: { template: template } }).configureTestingModule({
                    schemas: [core_1.NO_ERRORS_SCHEMA]
                });
                // should not throw for inputs starting with "on"
                var cmp = undefined;
                expect(function () { return cmp = testing_1.TestBed.createComponent(SecuredComponent); }).not.toThrow();
                // must bind to the directive not to the property of the div
                var value = cmp.componentInstance.ctxProp = {};
                cmp.detectChanges();
                var div = cmp.debugElement.children[0];
                expect(div.injector.get(OnPrefixDir).onclick).toBe(value);
                expect(dom_adapter_1.getDOM().getProperty(div.nativeElement, 'onclick')).not.toBe(value);
                expect(dom_adapter_1.getDOM().hasAttribute(div.nativeElement, 'onclick')).toEqual(false);
            });
        });
        describe('safe HTML values', function () {
            it('should not escape values marked as trusted', function () {
                var template = "<a [href]=\"ctxProp\">Link Title</a>";
                testing_1.TestBed.overrideComponent(SecuredComponent, { set: { template: template } });
                var fixture = testing_1.TestBed.createComponent(SecuredComponent);
                var sanitizer = testing_1.getTestBed().get(dom_sanitization_service_1.DomSanitizer);
                var e = fixture.debugElement.children[0].nativeElement;
                var ci = fixture.componentInstance;
                var trusted = sanitizer.bypassSecurityTrustUrl('javascript:alert(1)');
                ci.ctxProp = trusted;
                fixture.detectChanges();
                expect(dom_adapter_1.getDOM().getProperty(e, 'href')).toEqual('javascript:alert(1)');
            });
            it('should error when using the wrong trusted value', function () {
                var template = "<a [href]=\"ctxProp\">Link Title</a>";
                testing_1.TestBed.overrideComponent(SecuredComponent, { set: { template: template } });
                var fixture = testing_1.TestBed.createComponent(SecuredComponent);
                var sanitizer = testing_1.getTestBed().get(dom_sanitization_service_1.DomSanitizer);
                var trusted = sanitizer.bypassSecurityTrustScript('javascript:alert(1)');
                var ci = fixture.componentInstance;
                ci.ctxProp = trusted;
                expect(function () { return fixture.detectChanges(); }).toThrowError(/Required a safe URL, got a Script/);
            });
            it('should warn when using in string interpolation', function () {
                var template = "<a href=\"/foo/{{ctxProp}}\">Link Title</a>";
                testing_1.TestBed.overrideComponent(SecuredComponent, { set: { template: template } });
                var fixture = testing_1.TestBed.createComponent(SecuredComponent);
                var sanitizer = testing_1.getTestBed().get(dom_sanitization_service_1.DomSanitizer);
                var e = fixture.debugElement.children[0].nativeElement;
                var trusted = sanitizer.bypassSecurityTrustUrl('bar/baz');
                var ci = fixture.componentInstance;
                ci.ctxProp = trusted;
                fixture.detectChanges();
                expect(dom_adapter_1.getDOM().getProperty(e, 'href')).toMatch(/SafeValue(%20| )must(%20| )use/);
            });
        });
        describe('sanitizing', function () {
            function checkEscapeOfHrefProperty(fixture, isAttribute) {
                var e = fixture.debugElement.children[0].nativeElement;
                var ci = fixture.componentInstance;
                ci.ctxProp = 'hello';
                fixture.detectChanges();
                // In the browser, reading href returns an absolute URL. On the server side,
                // it just echoes back the property.
                var value = isAttribute ? dom_adapter_1.getDOM().getAttribute(e, 'href') : dom_adapter_1.getDOM().getProperty(e, 'href');
                expect(value).toMatch(/.*\/?hello$/);
                ci.ctxProp = 'javascript:alert(1)';
                fixture.detectChanges();
                value = isAttribute ? dom_adapter_1.getDOM().getAttribute(e, 'href') : dom_adapter_1.getDOM().getProperty(e, 'href');
                expect(value).toEqual('unsafe:javascript:alert(1)');
            }
            it('should escape unsafe properties', function () {
                var template = "<a [href]=\"ctxProp\">Link Title</a>";
                testing_1.TestBed.overrideComponent(SecuredComponent, { set: { template: template } });
                var fixture = testing_1.TestBed.createComponent(SecuredComponent);
                checkEscapeOfHrefProperty(fixture, false);
            });
            it('should escape unsafe attributes', function () {
                var template = "<a [attr.href]=\"ctxProp\">Link Title</a>";
                testing_1.TestBed.overrideComponent(SecuredComponent, { set: { template: template } });
                var fixture = testing_1.TestBed.createComponent(SecuredComponent);
                checkEscapeOfHrefProperty(fixture, true);
            });
            it('should escape unsafe properties if they are used in host bindings', function () {
                var HrefDirective = (function () {
                    function HrefDirective() {
                    }
                    return HrefDirective;
                }());
                __decorate([
                    core_1.HostBinding('href'), core_1.Input(),
                    __metadata("design:type", String)
                ], HrefDirective.prototype, "dirHref", void 0);
                HrefDirective = __decorate([
                    core_1.Directive({ selector: '[dirHref]' })
                ], HrefDirective);
                var template = "<a [dirHref]=\"ctxProp\">Link Title</a>";
                testing_1.TestBed.configureTestingModule({ declarations: [HrefDirective] });
                testing_1.TestBed.overrideComponent(SecuredComponent, { set: { template: template } });
                var fixture = testing_1.TestBed.createComponent(SecuredComponent);
                checkEscapeOfHrefProperty(fixture, false);
            });
            it('should escape unsafe attributes if they are used in host bindings', function () {
                var HrefDirective = (function () {
                    function HrefDirective() {
                    }
                    return HrefDirective;
                }());
                __decorate([
                    core_1.HostBinding('attr.href'), core_1.Input(),
                    __metadata("design:type", String)
                ], HrefDirective.prototype, "dirHref", void 0);
                HrefDirective = __decorate([
                    core_1.Directive({ selector: '[dirHref]' })
                ], HrefDirective);
                var template = "<a [dirHref]=\"ctxProp\">Link Title</a>";
                testing_1.TestBed.configureTestingModule({ declarations: [HrefDirective] });
                testing_1.TestBed.overrideComponent(SecuredComponent, { set: { template: template } });
                var fixture = testing_1.TestBed.createComponent(SecuredComponent);
                checkEscapeOfHrefProperty(fixture, true);
            });
            it('should escape unsafe style values', function () {
                var template = "<div [style.background]=\"ctxProp\">Text</div>";
                testing_1.TestBed.overrideComponent(SecuredComponent, { set: { template: template } });
                var fixture = testing_1.TestBed.createComponent(SecuredComponent);
                var e = fixture.debugElement.children[0].nativeElement;
                var ci = fixture.componentInstance;
                // Make sure binding harmless values works.
                ci.ctxProp = 'red';
                fixture.detectChanges();
                // In some browsers, this will contain the full background specification, not just
                // the color.
                expect(dom_adapter_1.getDOM().getStyle(e, 'background')).toMatch(/red.*/);
                ci.ctxProp = 'url(javascript:evil())';
                fixture.detectChanges();
                // Updated value gets rejected, no value change.
                expect(dom_adapter_1.getDOM().getStyle(e, 'background')).not.toContain('javascript');
            });
            it('should escape unsafe SVG attributes', function () {
                var template = "<svg:circle [xlink:href]=\"ctxProp\">Text</svg:circle>";
                testing_1.TestBed.overrideComponent(SecuredComponent, { set: { template: template } });
                expect(function () { return testing_1.TestBed.createComponent(SecuredComponent); })
                    .toThrowError(/Can't bind to 'xlink:href'/);
            });
            it('should escape unsafe HTML values', function () {
                var template = "<div [innerHTML]=\"ctxProp\">Text</div>";
                testing_1.TestBed.overrideComponent(SecuredComponent, { set: { template: template } });
                var fixture = testing_1.TestBed.createComponent(SecuredComponent);
                var e = fixture.debugElement.children[0].nativeElement;
                var ci = fixture.componentInstance;
                // Make sure binding harmless values works.
                ci.ctxProp = 'some <p>text</p>';
                fixture.detectChanges();
                expect(dom_adapter_1.getDOM().getInnerHTML(e)).toEqual('some <p>text</p>');
                ci.ctxProp = 'ha <script>evil()</script>';
                fixture.detectChanges();
                expect(dom_adapter_1.getDOM().getInnerHTML(e)).toEqual('ha evil()');
                ci.ctxProp = 'also <img src="x" onerror="evil()"> evil';
                fixture.detectChanges();
                expect(dom_adapter_1.getDOM().getInnerHTML(e)).toEqual('also <img src="x"> evil');
                ci.ctxProp = 'also <iframe srcdoc="evil"></iframe> evil';
                fixture.detectChanges();
                expect(dom_adapter_1.getDOM().getInnerHTML(e)).toEqual('also  evil');
            });
        });
    });
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2VjdXJpdHlfaW50ZWdyYXRpb25fc3BlYy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL3BhY2thZ2VzL2NvcmUvdGVzdC9saW5rZXIvc2VjdXJpdHlfaW50ZWdyYXRpb25fc3BlYy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUE7Ozs7OztHQU1HOzs7Ozs7Ozs7OztBQUVILHNDQUF5RjtBQUN6RixpREFBNEU7QUFDNUUsNkVBQXFFO0FBQ3JFLDRHQUE2RjtBQUU3RjtJQUNFLFFBQVEsQ0FBQyxLQUFLLEVBQUUsY0FBUSxZQUFZLENBQUMsRUFBQyxNQUFNLEVBQUUsSUFBSSxFQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO0lBRXpELFFBQVEsQ0FBQyxRQUFRLEVBQUUsY0FBUSxZQUFZLENBQUMsRUFBQyxNQUFNLEVBQUUsS0FBSyxFQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO0FBQy9ELENBQUM7QUFKRCxvQkFJQztBQUdELElBQU0sZ0JBQWdCO0lBRHRCO1FBRUUsWUFBTyxHQUFRLFlBQVksQ0FBQztJQUM5QixDQUFDO0lBQUQsdUJBQUM7QUFBRCxDQUFDLEFBRkQsSUFFQztBQUZLLGdCQUFnQjtJQURyQixnQkFBUyxDQUFDLEVBQUMsUUFBUSxFQUFFLFNBQVMsRUFBRSxRQUFRLEVBQUUsRUFBRSxFQUFDLENBQUM7R0FDekMsZ0JBQWdCLENBRXJCO0FBR0QsSUFBTSxXQUFXO0lBQWpCO0lBR0EsQ0FBQztJQUFELGtCQUFDO0FBQUQsQ0FBQyxBQUhELElBR0M7QUFGVTtJQUFSLFlBQUssRUFBRTs7bURBQXFCO0FBQ3BCO0lBQVIsWUFBSyxFQUFFOzs0Q0FBYztBQUZsQixXQUFXO0lBRGhCLGdCQUFTLENBQUMsRUFBQyxRQUFRLEVBQUUsa0JBQWtCLEVBQUMsQ0FBQztHQUNwQyxXQUFXLENBR2hCO0FBRUQsc0JBQXNCLEVBQTJCO1FBQTFCLGtCQUFNO0lBQzNCLFFBQVEsQ0FBQyw0QkFBNEIsRUFBRTtRQUVyQyxVQUFVLENBQUM7WUFDVCxpQkFBTyxDQUFDLGlCQUFpQixDQUFDLEVBQUMsTUFBTSxFQUFFLE1BQU0sRUFBQyxDQUFDLENBQUMsc0JBQXNCLENBQUM7Z0JBQ2pFLFlBQVksRUFBRTtvQkFDWixnQkFBZ0I7b0JBQ2hCLFdBQVc7aUJBQ1o7YUFDRixDQUFDLENBQUM7UUFDTCxDQUFDLENBQUMsQ0FBQztRQUVILElBQUksV0FBOEIsQ0FBQztRQUNuQyxVQUFVLENBQUM7WUFDVCxXQUFXLEdBQUcsb0JBQU0sRUFBRSxDQUFDLEdBQUcsQ0FBQztZQUMzQixvQkFBTSxFQUFFLENBQUMsR0FBRyxHQUFHLFVBQUMsR0FBRyxJQUE2QixDQUFDLENBQUM7UUFDcEQsQ0FBQyxDQUFDLENBQUM7UUFDSCxTQUFTLENBQUMsY0FBUSxvQkFBTSxFQUFFLENBQUMsR0FBRyxHQUFHLFdBQVcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBRWpELFFBQVEsQ0FBQyxRQUFRLEVBQUU7WUFDakIsRUFBRSxDQUFDLHFDQUFxQyxFQUFFO2dCQUN4QyxJQUFNLFFBQVEsR0FBRyx3Q0FBc0MsQ0FBQztnQkFDeEQsaUJBQU8sQ0FBQyxpQkFBaUIsQ0FBQyxnQkFBZ0IsRUFBRSxFQUFDLEdBQUcsRUFBRSxFQUFDLFFBQVEsVUFBQSxFQUFDLEVBQUMsQ0FBQyxDQUFDO2dCQUUvRCxNQUFNLENBQUMsY0FBTSxPQUFBLGlCQUFPLENBQUMsZUFBZSxDQUFDLGdCQUFnQixDQUFDLEVBQXpDLENBQXlDLENBQUM7cUJBQ2xELFlBQVksQ0FDVCxtR0FBbUcsQ0FBQyxDQUFDO1lBQy9HLENBQUMsQ0FBQyxDQUFDO1lBRUgsRUFBRSxDQUFDLHNEQUFzRCxFQUFFO2dCQUN6RCxJQUFNLFFBQVEsR0FBRyxtQ0FBaUMsQ0FBQztnQkFDbkQsaUJBQU8sQ0FBQyxpQkFBaUIsQ0FBQyxnQkFBZ0IsRUFBRSxFQUFDLEdBQUcsRUFBRSxFQUFDLFFBQVEsVUFBQSxFQUFDLEVBQUMsQ0FBQyxDQUFDLHNCQUFzQixDQUFDO29CQUNwRixPQUFPLEVBQUUsQ0FBQyx1QkFBZ0IsQ0FBQztpQkFDNUIsQ0FBQyxDQUFDO2dCQUVILE1BQU0sQ0FBQyxjQUFNLE9BQUEsaUJBQU8sQ0FBQyxlQUFlLENBQUMsZ0JBQWdCLENBQUMsRUFBekMsQ0FBeUMsQ0FBQztxQkFDbEQsWUFBWSxDQUNULGtHQUFrRyxDQUFDLENBQUM7WUFDOUcsQ0FBQyxDQUFDLENBQUM7WUFFSCxFQUFFLENBQUMscUVBQXFFLEVBQUU7Z0JBQ3hFLElBQU0sUUFBUSxHQUFHLGdFQUE0RCxDQUFDO2dCQUM5RSxpQkFBTyxDQUFDLGlCQUFpQixDQUFDLGdCQUFnQixFQUFFLEVBQUMsR0FBRyxFQUFFLEVBQUMsUUFBUSxVQUFBLEVBQUMsRUFBQyxDQUFDLENBQUMsc0JBQXNCLENBQUM7b0JBQ3BGLE9BQU8sRUFBRSxDQUFDLHVCQUFnQixDQUFDO2lCQUM1QixDQUFDLENBQUM7Z0JBRUgsaURBQWlEO2dCQUNqRCxJQUFJLEdBQUcsR0FBdUMsU0FBVyxDQUFDO2dCQUMxRCxNQUFNLENBQUMsY0FBTSxPQUFBLEdBQUcsR0FBRyxpQkFBTyxDQUFDLGVBQWUsQ0FBQyxnQkFBZ0IsQ0FBQyxFQUEvQyxDQUErQyxDQUFDLENBQUMsR0FBRyxDQUFDLE9BQU8sRUFBRSxDQUFDO2dCQUU1RSw0REFBNEQ7Z0JBQzVELElBQU0sS0FBSyxHQUFHLEdBQUcsQ0FBQyxpQkFBaUIsQ0FBQyxPQUFPLEdBQUcsRUFBRSxDQUFDO2dCQUNqRCxHQUFHLENBQUMsYUFBYSxFQUFFLENBQUM7Z0JBQ3BCLElBQU0sR0FBRyxHQUFHLEdBQUcsQ0FBQyxZQUFZLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFDO2dCQUN6QyxNQUFNLENBQUMsR0FBRyxDQUFDLFFBQVEsQ0FBQyxHQUFHLENBQUMsV0FBVyxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDO2dCQUMxRCxNQUFNLENBQUMsb0JBQU0sRUFBRSxDQUFDLFdBQVcsQ0FBQyxHQUFHLENBQUMsYUFBYSxFQUFFLFNBQVMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQztnQkFDM0UsTUFBTSxDQUFDLG9CQUFNLEVBQUUsQ0FBQyxZQUFZLENBQUMsR0FBRyxDQUFDLGFBQWEsRUFBRSxTQUFTLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxLQUFLLENBQUMsQ0FBQztZQUM3RSxDQUFDLENBQUMsQ0FBQztRQUVMLENBQUMsQ0FBQyxDQUFDO1FBRUgsUUFBUSxDQUFDLGtCQUFrQixFQUFFO1lBQzNCLEVBQUUsQ0FBQyw0Q0FBNEMsRUFBRTtnQkFDL0MsSUFBTSxRQUFRLEdBQUcsc0NBQW9DLENBQUM7Z0JBQ3RELGlCQUFPLENBQUMsaUJBQWlCLENBQUMsZ0JBQWdCLEVBQUUsRUFBQyxHQUFHLEVBQUUsRUFBQyxRQUFRLFVBQUEsRUFBQyxFQUFDLENBQUMsQ0FBQztnQkFDL0QsSUFBTSxPQUFPLEdBQUcsaUJBQU8sQ0FBQyxlQUFlLENBQUMsZ0JBQWdCLENBQUMsQ0FBQztnQkFDMUQsSUFBTSxTQUFTLEdBQWlCLG9CQUFVLEVBQUUsQ0FBQyxHQUFHLENBQUMsdUNBQVksQ0FBQyxDQUFDO2dCQUUvRCxJQUFNLENBQUMsR0FBRyxPQUFPLENBQUMsWUFBWSxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQyxhQUFhLENBQUM7Z0JBQ3pELElBQU0sRUFBRSxHQUFHLE9BQU8sQ0FBQyxpQkFBaUIsQ0FBQztnQkFDckMsSUFBTSxPQUFPLEdBQUcsU0FBUyxDQUFDLHNCQUFzQixDQUFDLHFCQUFxQixDQUFDLENBQUM7Z0JBQ3hFLEVBQUUsQ0FBQyxPQUFPLEdBQUcsT0FBTyxDQUFDO2dCQUNyQixPQUFPLENBQUMsYUFBYSxFQUFFLENBQUM7Z0JBQ3hCLE1BQU0sQ0FBQyxvQkFBTSxFQUFFLENBQUMsV0FBVyxDQUFDLENBQUMsRUFBRSxNQUFNLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxxQkFBcUIsQ0FBQyxDQUFDO1lBQ3pFLENBQUMsQ0FBQyxDQUFDO1lBRUgsRUFBRSxDQUFDLGlEQUFpRCxFQUFFO2dCQUNwRCxJQUFNLFFBQVEsR0FBRyxzQ0FBb0MsQ0FBQztnQkFDdEQsaUJBQU8sQ0FBQyxpQkFBaUIsQ0FBQyxnQkFBZ0IsRUFBRSxFQUFDLEdBQUcsRUFBRSxFQUFDLFFBQVEsVUFBQSxFQUFDLEVBQUMsQ0FBQyxDQUFDO2dCQUMvRCxJQUFNLE9BQU8sR0FBRyxpQkFBTyxDQUFDLGVBQWUsQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFDO2dCQUMxRCxJQUFNLFNBQVMsR0FBaUIsb0JBQVUsRUFBRSxDQUFDLEdBQUcsQ0FBQyx1Q0FBWSxDQUFDLENBQUM7Z0JBRS9ELElBQU0sT0FBTyxHQUFHLFNBQVMsQ0FBQyx5QkFBeUIsQ0FBQyxxQkFBcUIsQ0FBQyxDQUFDO2dCQUMzRSxJQUFNLEVBQUUsR0FBRyxPQUFPLENBQUMsaUJBQWlCLENBQUM7Z0JBQ3JDLEVBQUUsQ0FBQyxPQUFPLEdBQUcsT0FBTyxDQUFDO2dCQUNyQixNQUFNLENBQUMsY0FBTSxPQUFBLE9BQU8sQ0FBQyxhQUFhLEVBQUUsRUFBdkIsQ0FBdUIsQ0FBQyxDQUFDLFlBQVksQ0FBQyxtQ0FBbUMsQ0FBQyxDQUFDO1lBQzFGLENBQUMsQ0FBQyxDQUFDO1lBRUgsRUFBRSxDQUFDLGdEQUFnRCxFQUFFO2dCQUNuRCxJQUFNLFFBQVEsR0FBRyw2Q0FBMkMsQ0FBQztnQkFDN0QsaUJBQU8sQ0FBQyxpQkFBaUIsQ0FBQyxnQkFBZ0IsRUFBRSxFQUFDLEdBQUcsRUFBRSxFQUFDLFFBQVEsVUFBQSxFQUFDLEVBQUMsQ0FBQyxDQUFDO2dCQUMvRCxJQUFNLE9BQU8sR0FBRyxpQkFBTyxDQUFDLGVBQWUsQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFDO2dCQUMxRCxJQUFNLFNBQVMsR0FBaUIsb0JBQVUsRUFBRSxDQUFDLEdBQUcsQ0FBQyx1Q0FBWSxDQUFDLENBQUM7Z0JBRS9ELElBQU0sQ0FBQyxHQUFHLE9BQU8sQ0FBQyxZQUFZLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFDLGFBQWEsQ0FBQztnQkFDekQsSUFBTSxPQUFPLEdBQUcsU0FBUyxDQUFDLHNCQUFzQixDQUFDLFNBQVMsQ0FBQyxDQUFDO2dCQUM1RCxJQUFNLEVBQUUsR0FBRyxPQUFPLENBQUMsaUJBQWlCLENBQUM7Z0JBQ3JDLEVBQUUsQ0FBQyxPQUFPLEdBQUcsT0FBTyxDQUFDO2dCQUNyQixPQUFPLENBQUMsYUFBYSxFQUFFLENBQUM7Z0JBQ3hCLE1BQU0sQ0FBQyxvQkFBTSxFQUFFLENBQUMsV0FBVyxDQUFDLENBQUMsRUFBRSxNQUFNLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxnQ0FBZ0MsQ0FBQyxDQUFDO1lBQ3BGLENBQUMsQ0FBQyxDQUFDO1FBQ0wsQ0FBQyxDQUFDLENBQUM7UUFFSCxRQUFRLENBQUMsWUFBWSxFQUFFO1lBQ3JCLG1DQUFtQyxPQUE4QixFQUFFLFdBQW9CO2dCQUNyRixJQUFNLENBQUMsR0FBRyxPQUFPLENBQUMsWUFBWSxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQyxhQUFhLENBQUM7Z0JBQ3pELElBQU0sRUFBRSxHQUFHLE9BQU8sQ0FBQyxpQkFBaUIsQ0FBQztnQkFDckMsRUFBRSxDQUFDLE9BQU8sR0FBRyxPQUFPLENBQUM7Z0JBQ3JCLE9BQU8sQ0FBQyxhQUFhLEVBQUUsQ0FBQztnQkFDeEIsNEVBQTRFO2dCQUM1RSxvQ0FBb0M7Z0JBQ3BDLElBQUksS0FBSyxHQUNMLFdBQVcsR0FBRyxvQkFBTSxFQUFFLENBQUMsWUFBWSxDQUFDLENBQUMsRUFBRSxNQUFNLENBQUMsR0FBRyxvQkFBTSxFQUFFLENBQUMsV0FBVyxDQUFDLENBQUMsRUFBRSxNQUFNLENBQUMsQ0FBQztnQkFDckYsTUFBTSxDQUFDLEtBQUssQ0FBQyxDQUFDLE9BQU8sQ0FBQyxhQUFhLENBQUMsQ0FBQztnQkFFckMsRUFBRSxDQUFDLE9BQU8sR0FBRyxxQkFBcUIsQ0FBQztnQkFDbkMsT0FBTyxDQUFDLGFBQWEsRUFBRSxDQUFDO2dCQUN4QixLQUFLLEdBQUcsV0FBVyxHQUFHLG9CQUFNLEVBQUUsQ0FBQyxZQUFZLENBQUMsQ0FBQyxFQUFFLE1BQU0sQ0FBQyxHQUFHLG9CQUFNLEVBQUUsQ0FBQyxXQUFXLENBQUMsQ0FBQyxFQUFFLE1BQU0sQ0FBQyxDQUFDO2dCQUN6RixNQUFNLENBQUMsS0FBSyxDQUFDLENBQUMsT0FBTyxDQUFDLDRCQUE0QixDQUFDLENBQUM7WUFDdEQsQ0FBQztZQUVELEVBQUUsQ0FBQyxpQ0FBaUMsRUFBRTtnQkFDcEMsSUFBTSxRQUFRLEdBQUcsc0NBQW9DLENBQUM7Z0JBQ3RELGlCQUFPLENBQUMsaUJBQWlCLENBQUMsZ0JBQWdCLEVBQUUsRUFBQyxHQUFHLEVBQUUsRUFBQyxRQUFRLFVBQUEsRUFBQyxFQUFDLENBQUMsQ0FBQztnQkFDL0QsSUFBTSxPQUFPLEdBQUcsaUJBQU8sQ0FBQyxlQUFlLENBQUMsZ0JBQWdCLENBQUMsQ0FBQztnQkFFMUQseUJBQXlCLENBQUMsT0FBTyxFQUFFLEtBQUssQ0FBQyxDQUFDO1lBQzVDLENBQUMsQ0FBQyxDQUFDO1lBRUgsRUFBRSxDQUFDLGlDQUFpQyxFQUFFO2dCQUNwQyxJQUFNLFFBQVEsR0FBRywyQ0FBeUMsQ0FBQztnQkFDM0QsaUJBQU8sQ0FBQyxpQkFBaUIsQ0FBQyxnQkFBZ0IsRUFBRSxFQUFDLEdBQUcsRUFBRSxFQUFDLFFBQVEsVUFBQSxFQUFDLEVBQUMsQ0FBQyxDQUFDO2dCQUMvRCxJQUFNLE9BQU8sR0FBRyxpQkFBTyxDQUFDLGVBQWUsQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFDO2dCQUUxRCx5QkFBeUIsQ0FBQyxPQUFPLEVBQUUsSUFBSSxDQUFDLENBQUM7WUFDM0MsQ0FBQyxDQUFDLENBQUM7WUFFSCxFQUFFLENBQUMsbUVBQW1FLEVBQUU7Z0JBRXRFLElBQU0sYUFBYTtvQkFBbkI7b0JBR0EsQ0FBQztvQkFBRCxvQkFBQztnQkFBRCxDQUFDLEFBSEQsSUFHQztnQkFEQztvQkFEQyxrQkFBVyxDQUFDLE1BQU0sQ0FBQyxFQUFFLFlBQUssRUFBRTs7OERBQ2I7Z0JBRlosYUFBYTtvQkFEbEIsZ0JBQVMsQ0FBQyxFQUFDLFFBQVEsRUFBRSxXQUFXLEVBQUMsQ0FBQzttQkFDN0IsYUFBYSxDQUdsQjtnQkFFRCxJQUFNLFFBQVEsR0FBRyx5Q0FBdUMsQ0FBQztnQkFDekQsaUJBQU8sQ0FBQyxzQkFBc0IsQ0FBQyxFQUFDLFlBQVksRUFBRSxDQUFDLGFBQWEsQ0FBQyxFQUFDLENBQUMsQ0FBQztnQkFDaEUsaUJBQU8sQ0FBQyxpQkFBaUIsQ0FBQyxnQkFBZ0IsRUFBRSxFQUFDLEdBQUcsRUFBRSxFQUFDLFFBQVEsVUFBQSxFQUFDLEVBQUMsQ0FBQyxDQUFDO2dCQUMvRCxJQUFNLE9BQU8sR0FBRyxpQkFBTyxDQUFDLGVBQWUsQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFDO2dCQUUxRCx5QkFBeUIsQ0FBQyxPQUFPLEVBQUUsS0FBSyxDQUFDLENBQUM7WUFDNUMsQ0FBQyxDQUFDLENBQUM7WUFFSCxFQUFFLENBQUMsbUVBQW1FLEVBQUU7Z0JBRXRFLElBQU0sYUFBYTtvQkFBbkI7b0JBR0EsQ0FBQztvQkFBRCxvQkFBQztnQkFBRCxDQUFDLEFBSEQsSUFHQztnQkFEQztvQkFEQyxrQkFBVyxDQUFDLFdBQVcsQ0FBQyxFQUFFLFlBQUssRUFBRTs7OERBQ2xCO2dCQUZaLGFBQWE7b0JBRGxCLGdCQUFTLENBQUMsRUFBQyxRQUFRLEVBQUUsV0FBVyxFQUFDLENBQUM7bUJBQzdCLGFBQWEsQ0FHbEI7Z0JBRUQsSUFBTSxRQUFRLEdBQUcseUNBQXVDLENBQUM7Z0JBQ3pELGlCQUFPLENBQUMsc0JBQXNCLENBQUMsRUFBQyxZQUFZLEVBQUUsQ0FBQyxhQUFhLENBQUMsRUFBQyxDQUFDLENBQUM7Z0JBQ2hFLGlCQUFPLENBQUMsaUJBQWlCLENBQUMsZ0JBQWdCLEVBQUUsRUFBQyxHQUFHLEVBQUUsRUFBQyxRQUFRLFVBQUEsRUFBQyxFQUFDLENBQUMsQ0FBQztnQkFDL0QsSUFBTSxPQUFPLEdBQUcsaUJBQU8sQ0FBQyxlQUFlLENBQUMsZ0JBQWdCLENBQUMsQ0FBQztnQkFFMUQseUJBQXlCLENBQUMsT0FBTyxFQUFFLElBQUksQ0FBQyxDQUFDO1lBQzNDLENBQUMsQ0FBQyxDQUFDO1lBRUgsRUFBRSxDQUFDLG1DQUFtQyxFQUFFO2dCQUN0QyxJQUFNLFFBQVEsR0FBRyxnREFBOEMsQ0FBQztnQkFDaEUsaUJBQU8sQ0FBQyxpQkFBaUIsQ0FBQyxnQkFBZ0IsRUFBRSxFQUFDLEdBQUcsRUFBRSxFQUFDLFFBQVEsVUFBQSxFQUFDLEVBQUMsQ0FBQyxDQUFDO2dCQUMvRCxJQUFNLE9BQU8sR0FBRyxpQkFBTyxDQUFDLGVBQWUsQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFDO2dCQUUxRCxJQUFNLENBQUMsR0FBRyxPQUFPLENBQUMsWUFBWSxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQyxhQUFhLENBQUM7Z0JBQ3pELElBQU0sRUFBRSxHQUFHLE9BQU8sQ0FBQyxpQkFBaUIsQ0FBQztnQkFDckMsMkNBQTJDO2dCQUMzQyxFQUFFLENBQUMsT0FBTyxHQUFHLEtBQUssQ0FBQztnQkFDbkIsT0FBTyxDQUFDLGFBQWEsRUFBRSxDQUFDO2dCQUN4QixrRkFBa0Y7Z0JBQ2xGLGFBQWE7Z0JBQ2IsTUFBTSxDQUFDLG9CQUFNLEVBQUUsQ0FBQyxRQUFRLENBQUMsQ0FBQyxFQUFFLFlBQVksQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLE9BQU8sQ0FBQyxDQUFDO2dCQUU1RCxFQUFFLENBQUMsT0FBTyxHQUFHLHdCQUF3QixDQUFDO2dCQUN0QyxPQUFPLENBQUMsYUFBYSxFQUFFLENBQUM7Z0JBQ3hCLGdEQUFnRDtnQkFDaEQsTUFBTSxDQUFDLG9CQUFNLEVBQUUsQ0FBQyxRQUFRLENBQUMsQ0FBQyxFQUFFLFlBQVksQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLFNBQVMsQ0FBQyxZQUFZLENBQUMsQ0FBQztZQUN6RSxDQUFDLENBQUMsQ0FBQztZQUVILEVBQUUsQ0FBQyxxQ0FBcUMsRUFBRTtnQkFDeEMsSUFBTSxRQUFRLEdBQUcsd0RBQXNELENBQUM7Z0JBQ3hFLGlCQUFPLENBQUMsaUJBQWlCLENBQUMsZ0JBQWdCLEVBQUUsRUFBQyxHQUFHLEVBQUUsRUFBQyxRQUFRLFVBQUEsRUFBQyxFQUFDLENBQUMsQ0FBQztnQkFFL0QsTUFBTSxDQUFDLGNBQU0sT0FBQSxpQkFBTyxDQUFDLGVBQWUsQ0FBQyxnQkFBZ0IsQ0FBQyxFQUF6QyxDQUF5QyxDQUFDO3FCQUNsRCxZQUFZLENBQUMsNEJBQTRCLENBQUMsQ0FBQztZQUNsRCxDQUFDLENBQUMsQ0FBQztZQUVILEVBQUUsQ0FBQyxrQ0FBa0MsRUFBRTtnQkFDckMsSUFBTSxRQUFRLEdBQUcseUNBQXVDLENBQUM7Z0JBQ3pELGlCQUFPLENBQUMsaUJBQWlCLENBQUMsZ0JBQWdCLEVBQUUsRUFBQyxHQUFHLEVBQUUsRUFBQyxRQUFRLFVBQUEsRUFBQyxFQUFDLENBQUMsQ0FBQztnQkFDL0QsSUFBTSxPQUFPLEdBQUcsaUJBQU8sQ0FBQyxlQUFlLENBQUMsZ0JBQWdCLENBQUMsQ0FBQztnQkFFMUQsSUFBTSxDQUFDLEdBQUcsT0FBTyxDQUFDLFlBQVksQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUMsYUFBYSxDQUFDO2dCQUN6RCxJQUFNLEVBQUUsR0FBRyxPQUFPLENBQUMsaUJBQWlCLENBQUM7Z0JBQ3JDLDJDQUEyQztnQkFDM0MsRUFBRSxDQUFDLE9BQU8sR0FBRyxrQkFBa0IsQ0FBQztnQkFDaEMsT0FBTyxDQUFDLGFBQWEsRUFBRSxDQUFDO2dCQUN4QixNQUFNLENBQUMsb0JBQU0sRUFBRSxDQUFDLFlBQVksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxrQkFBa0IsQ0FBQyxDQUFDO2dCQUU3RCxFQUFFLENBQUMsT0FBTyxHQUFHLDRCQUE0QixDQUFDO2dCQUMxQyxPQUFPLENBQUMsYUFBYSxFQUFFLENBQUM7Z0JBQ3hCLE1BQU0sQ0FBQyxvQkFBTSxFQUFFLENBQUMsWUFBWSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLFdBQVcsQ0FBQyxDQUFDO2dCQUV0RCxFQUFFLENBQUMsT0FBTyxHQUFHLDBDQUEwQyxDQUFDO2dCQUN4RCxPQUFPLENBQUMsYUFBYSxFQUFFLENBQUM7Z0JBQ3hCLE1BQU0sQ0FBQyxvQkFBTSxFQUFFLENBQUMsWUFBWSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLHlCQUF5QixDQUFDLENBQUM7Z0JBRXBFLEVBQUUsQ0FBQyxPQUFPLEdBQUcsMkNBQTJDLENBQUM7Z0JBQ3pELE9BQU8sQ0FBQyxhQUFhLEVBQUUsQ0FBQztnQkFDeEIsTUFBTSxDQUFDLG9CQUFNLEVBQUUsQ0FBQyxZQUFZLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsWUFBWSxDQUFDLENBQUM7WUFDekQsQ0FBQyxDQUFDLENBQUM7UUFDTCxDQUFDLENBQUMsQ0FBQztJQUNMLENBQUMsQ0FBQyxDQUFDO0FBQ0wsQ0FBQyJ9