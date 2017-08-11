"use strict";
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
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
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
exports.SecurityContext = core_1.SecurityContext;
var dom_tokens_1 = require("../dom/dom_tokens");
var html_sanitizer_1 = require("./html_sanitizer");
var style_sanitizer_1 = require("./style_sanitizer");
var url_sanitizer_1 = require("./url_sanitizer");
/**
 * DomSanitizer helps preventing Cross Site Scripting Security bugs (XSS) by sanitizing
 * values to be safe to use in the different DOM contexts.
 *
 * For example, when binding a URL in an `<a [href]="someValue">` hyperlink, `someValue` will be
 * sanitized so that an attacker cannot inject e.g. a `javascript:` URL that would execute code on
 * the website.
 *
 * In specific situations, it might be necessary to disable sanitization, for example if the
 * application genuinely needs to produce a `javascript:` style link with a dynamic value in it.
 * Users can bypass security by constructing a value with one of the `bypassSecurityTrust...`
 * methods, and then binding to that value from the template.
 *
 * These situations should be very rare, and extraordinary care must be taken to avoid creating a
 * Cross Site Scripting (XSS) security bug!
 *
 * When using `bypassSecurityTrust...`, make sure to call the method as early as possible and as
 * close as possible to the source of the value, to make it easy to verify no security bug is
 * created by its use.
 *
 * It is not required (and not recommended) to bypass security if the value is safe, e.g. a URL that
 * does not start with a suspicious protocol, or an HTML snippet that does not contain dangerous
 * code. The sanitizer leaves safe values intact.
 *
 * @security Calling any of the `bypassSecurityTrust...` APIs disables Angular's built-in
 * sanitization for the value passed in. Carefully check and audit all values and code paths going
 * into this call. Make sure any user data is appropriately escaped for this security context.
 * For more detail, see the [Security Guide](http://g.co/ng/security).
 *
 * @stable
 */
var DomSanitizer = (function () {
    function DomSanitizer() {
    }
    return DomSanitizer;
}());
exports.DomSanitizer = DomSanitizer;
var DomSanitizerImpl = (function (_super) {
    __extends(DomSanitizerImpl, _super);
    function DomSanitizerImpl(_doc) {
        var _this = _super.call(this) || this;
        _this._doc = _doc;
        return _this;
    }
    DomSanitizerImpl.prototype.sanitize = function (ctx, value) {
        if (value == null)
            return null;
        switch (ctx) {
            case core_1.SecurityContext.NONE:
                return value;
            case core_1.SecurityContext.HTML:
                if (value instanceof SafeHtmlImpl)
                    return value.changingThisBreaksApplicationSecurity;
                this.checkNotSafeValue(value, 'HTML');
                return html_sanitizer_1.sanitizeHtml(this._doc, String(value));
            case core_1.SecurityContext.STYLE:
                if (value instanceof SafeStyleImpl)
                    return value.changingThisBreaksApplicationSecurity;
                this.checkNotSafeValue(value, 'Style');
                return style_sanitizer_1.sanitizeStyle(value);
            case core_1.SecurityContext.SCRIPT:
                if (value instanceof SafeScriptImpl)
                    return value.changingThisBreaksApplicationSecurity;
                this.checkNotSafeValue(value, 'Script');
                throw new Error('unsafe value used in a script context');
            case core_1.SecurityContext.URL:
                if (value instanceof SafeResourceUrlImpl || value instanceof SafeUrlImpl) {
                    // Allow resource URLs in URL contexts, they are strictly more trusted.
                    return value.changingThisBreaksApplicationSecurity;
                }
                this.checkNotSafeValue(value, 'URL');
                return url_sanitizer_1.sanitizeUrl(String(value));
            case core_1.SecurityContext.RESOURCE_URL:
                if (value instanceof SafeResourceUrlImpl) {
                    return value.changingThisBreaksApplicationSecurity;
                }
                this.checkNotSafeValue(value, 'ResourceURL');
                throw new Error('unsafe value used in a resource URL context (see http://g.co/ng/security#xss)');
            default:
                throw new Error("Unexpected SecurityContext " + ctx + " (see http://g.co/ng/security#xss)");
        }
    };
    DomSanitizerImpl.prototype.checkNotSafeValue = function (value, expectedType) {
        if (value instanceof SafeValueImpl) {
            throw new Error("Required a safe " + expectedType + ", got a " + value.getTypeName() + " " +
                "(see http://g.co/ng/security#xss)");
        }
    };
    DomSanitizerImpl.prototype.bypassSecurityTrustHtml = function (value) { return new SafeHtmlImpl(value); };
    DomSanitizerImpl.prototype.bypassSecurityTrustStyle = function (value) { return new SafeStyleImpl(value); };
    DomSanitizerImpl.prototype.bypassSecurityTrustScript = function (value) { return new SafeScriptImpl(value); };
    DomSanitizerImpl.prototype.bypassSecurityTrustUrl = function (value) { return new SafeUrlImpl(value); };
    DomSanitizerImpl.prototype.bypassSecurityTrustResourceUrl = function (value) {
        return new SafeResourceUrlImpl(value);
    };
    return DomSanitizerImpl;
}(DomSanitizer));
DomSanitizerImpl = __decorate([
    core_1.Injectable(),
    __param(0, core_1.Inject(dom_tokens_1.DOCUMENT)),
    __metadata("design:paramtypes", [Object])
], DomSanitizerImpl);
exports.DomSanitizerImpl = DomSanitizerImpl;
var SafeValueImpl = (function () {
    function SafeValueImpl(changingThisBreaksApplicationSecurity) {
        this.changingThisBreaksApplicationSecurity = changingThisBreaksApplicationSecurity;
        // empty
    }
    SafeValueImpl.prototype.toString = function () {
        return "SafeValue must use [property]=binding: " + this.changingThisBreaksApplicationSecurity +
            " (see http://g.co/ng/security#xss)";
    };
    return SafeValueImpl;
}());
var SafeHtmlImpl = (function (_super) {
    __extends(SafeHtmlImpl, _super);
    function SafeHtmlImpl() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    SafeHtmlImpl.prototype.getTypeName = function () { return 'HTML'; };
    return SafeHtmlImpl;
}(SafeValueImpl));
var SafeStyleImpl = (function (_super) {
    __extends(SafeStyleImpl, _super);
    function SafeStyleImpl() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    SafeStyleImpl.prototype.getTypeName = function () { return 'Style'; };
    return SafeStyleImpl;
}(SafeValueImpl));
var SafeScriptImpl = (function (_super) {
    __extends(SafeScriptImpl, _super);
    function SafeScriptImpl() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    SafeScriptImpl.prototype.getTypeName = function () { return 'Script'; };
    return SafeScriptImpl;
}(SafeValueImpl));
var SafeUrlImpl = (function (_super) {
    __extends(SafeUrlImpl, _super);
    function SafeUrlImpl() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    SafeUrlImpl.prototype.getTypeName = function () { return 'URL'; };
    return SafeUrlImpl;
}(SafeValueImpl));
var SafeResourceUrlImpl = (function (_super) {
    __extends(SafeResourceUrlImpl, _super);
    function SafeResourceUrlImpl() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    SafeResourceUrlImpl.prototype.getTypeName = function () { return 'ResourceURL'; };
    return SafeResourceUrlImpl;
}(SafeValueImpl));
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZG9tX3Nhbml0aXphdGlvbl9zZXJ2aWNlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vcGFja2FnZXMvcGxhdGZvcm0tYnJvd3Nlci9zcmMvc2VjdXJpdHkvZG9tX3Nhbml0aXphdGlvbl9zZXJ2aWNlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQTs7Ozs7O0dBTUc7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUVILHNDQUE2RTtBQVFyRSwwQkFSK0Isc0JBQWUsQ0FRL0I7QUFOdkIsZ0RBQTJDO0FBRTNDLG1EQUE4QztBQUM5QyxxREFBZ0Q7QUFDaEQsaURBQTRDO0FBZ0Q1Qzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0dBOEJHO0FBQ0g7SUFBQTtJQXNEQSxDQUFDO0lBQUQsbUJBQUM7QUFBRCxDQUFDLEFBdERELElBc0RDO0FBdERxQixvQ0FBWTtBQTBEbEMsSUFBYSxnQkFBZ0I7SUFBUyxvQ0FBWTtJQUNoRCwwQkFBc0MsSUFBUztRQUEvQyxZQUFtRCxpQkFBTyxTQUFHO1FBQXZCLFVBQUksR0FBSixJQUFJLENBQUs7O0lBQWEsQ0FBQztJQUU3RCxtQ0FBUSxHQUFSLFVBQVMsR0FBb0IsRUFBRSxLQUE0QjtRQUN6RCxFQUFFLENBQUMsQ0FBQyxLQUFLLElBQUksSUFBSSxDQUFDO1lBQUMsTUFBTSxDQUFDLElBQUksQ0FBQztRQUMvQixNQUFNLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDO1lBQ1osS0FBSyxzQkFBZSxDQUFDLElBQUk7Z0JBQ3ZCLE1BQU0sQ0FBQyxLQUFlLENBQUM7WUFDekIsS0FBSyxzQkFBZSxDQUFDLElBQUk7Z0JBQ3ZCLEVBQUUsQ0FBQyxDQUFDLEtBQUssWUFBWSxZQUFZLENBQUM7b0JBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQyxxQ0FBcUMsQ0FBQztnQkFDdEYsSUFBSSxDQUFDLGlCQUFpQixDQUFDLEtBQUssRUFBRSxNQUFNLENBQUMsQ0FBQztnQkFDdEMs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