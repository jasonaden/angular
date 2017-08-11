/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */
export var ViewEncapsulation = {};
ViewEncapsulation.Emulated = 0;
ViewEncapsulation.Native = 1;
ViewEncapsulation.None = 2;
ViewEncapsulation[ViewEncapsulation.Emulated] = "Emulated";
ViewEncapsulation[ViewEncapsulation.Native] = "Native";
ViewEncapsulation[ViewEncapsulation.None] = "None";
/**
 * Metadata properties available for configuring Views.
 *
 * For details on the `\@Component` annotation, see {\@link Component}.
 *
 * ### Example
 *
 * ```
 * \@Component({
 *   selector: 'greet',
 *   template: 'Hello {{name}}!',
 * })
 * class Greet {
 *   name: string;
 *
 *   constructor() {
 *     this.name = 'World';
 *   }
 * }
 * ```
 *
 * @deprecated Use Component instead.
 *
 * {\@link Component}
 */
var ViewMetadata = (function () {
    /**
     * @param {?=} opts
     */
    function ViewMetadata(opts) {
        if (opts === void 0) { opts = {}; }
        this.templateUrl = opts.templateUrl;
        this.template = opts.template;
        this.styleUrls = opts.styleUrls;
        this.styles = opts.styles;
        this.encapsulation = opts.encapsulation;
        this.animations = opts.animations;
        this.interpolation = opts.interpolation;
    }
    return ViewMetadata;
}());
export { ViewMetadata };
function ViewMetadata_tsickle_Closure_declarations() {
    /**
     * {\@link Component#templateUrl}
     * @type {?}
     */
    ViewMetadata.prototype.templateUrl;
    /**
     * {\@link Component#template}
     * @type {?}
     */
    ViewMetadata.prototype.template;
    /**
     * {\@link Component#stylesUrl}
     * @type {?}
     */
    ViewMetadata.prototype.styleUrls;
    /**
     * {\@link Component#styles}
     * @type {?}
     */
    ViewMetadata.prototype.styles;
    /**
     * {\@link Component#encapsulation}
     * @type {?}
     */
    ViewMetadata.prototype.encapsulation;
    /**
     * {\@link Component#animation}
     * @type {?}
     */
    ViewMetadata.prototype.animations;
    /**
     * {\@link Component#interpolation}
     * @type {?}
     */
    ViewMetadata.prototype.interpolation;
}
//# sourceMappingURL=view.js.map