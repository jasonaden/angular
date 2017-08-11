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
Object.defineProperty(exports, "__esModule", { value: true });
var digest_1 = require("../../src/i18n/digest");
var message_bundle_1 = require("../../src/i18n/message_bundle");
var serializer_1 = require("../../src/i18n/serializers/serializer");
var html_parser_1 = require("../../src/ml_parser/html_parser");
var interpolation_config_1 = require("../../src/ml_parser/interpolation_config");
function main() {
    describe('MessageBundle', function () {
        describe('Messages', function () {
            var messages;
            beforeEach(function () { messages = new message_bundle_1.MessageBundle(new html_parser_1.HtmlParser, [], {}); });
            it('should extract the message to the catalog', function () {
                messages.updateFromTemplate('<p i18n="m|d">Translate Me</p>', 'url', interpolation_config_1.DEFAULT_INTERPOLATION_CONFIG);
                expect(humanizeMessages(messages)).toEqual([
                    'Translate Me (m|d)',
                ]);
            });
            it('should extract and dedup messages', function () {
                messages.updateFromTemplate('<p i18n="m|d@@1">Translate Me</p><p i18n="@@2">Translate Me</p><p i18n="@@2">Translate Me</p>', 'url', interpolation_config_1.DEFAULT_INTERPOLATION_CONFIG);
                expect(humanizeMessages(messages)).toEqual([
                    'Translate Me (m|d)',
                    'Translate Me (|)',
                ]);
            });
        });
    });
}
exports.main = main;
var _TestSerializer = (function (_super) {
    __extends(_TestSerializer, _super);
    function _TestSerializer() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    _TestSerializer.prototype.write = function (messages) {
        return messages.map(function (msg) { return digest_1.serializeNodes(msg.nodes) + " (" + msg.meaning + "|" + msg.description + ")"; })
            .join('//');
    };
    _TestSerializer.prototype.load = function (content, url) {
        return { locale: null, i18nNodesByMsgId: {} };
    };
    _TestSerializer.prototype.digest = function (msg) { return msg.id || "default"; };
    return _TestSerializer;
}(serializer_1.Serializer));
function humanizeMessages(catalog) {
    return catalog.write(new _TestSerializer()).split('//');
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWVzc2FnZV9idW5kbGVfc3BlYy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL3BhY2thZ2VzL2NvbXBpbGVyL3Rlc3QvaTE4bi9tZXNzYWdlX2J1bmRsZV9zcGVjLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQTs7Ozs7O0dBTUc7Ozs7Ozs7Ozs7OztBQUVILGdEQUFxRDtBQUVyRCxnRUFBNEQ7QUFDNUQsb0VBQWlFO0FBQ2pFLCtEQUEyRDtBQUMzRCxpRkFBc0Y7QUFFdEY7SUFDRSxRQUFRLENBQUMsZUFBZSxFQUFFO1FBQ3hCLFFBQVEsQ0FBQyxVQUFVLEVBQUU7WUFDbkIsSUFBSSxRQUF1QixDQUFDO1lBRTVCLFVBQVUsQ0FBQyxjQUFRLFFBQVEsR0FBRyxJQUFJLDhCQUFhLENBQUMsSUFBSSx3QkFBVSxFQUFFLEVBQUUsRUFBRSxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBRTVFLEVBQUUsQ0FBQywyQ0FBMkMsRUFBRTtnQkFDOUMsUUFBUSxDQUFDLGtCQUFrQixDQUN2QixnQ0FBZ0MsRUFBRSxLQUFLLEVBQUUsbURBQTRCLENBQUMsQ0FBQztnQkFDM0UsTUFBTSxDQUFDLGdCQUFnQixDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDO29CQUN6QyxvQkFBb0I7aUJBQ3JCLENBQUMsQ0FBQztZQUNMLENBQUMsQ0FBQyxDQUFDO1lBRUgsRUFBRSxDQUFDLG1DQUFtQyxFQUFFO2dCQUN0QyxRQUFRLENBQUMsa0JBQWtCLENBQ3ZCLCtGQUErRixFQUMvRixLQUFLLEVBQUUsbURBQTRCLENBQUMsQ0FBQztnQkFDekMsTUFBTSxDQUFDLGdCQUFnQixDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDO29CQUN6QyxvQkFBb0I7b0JBQ3BCLGtCQUFrQjtpQkFDbkIsQ0FBQyxDQUFDO1lBQ0wsQ0FBQyxDQUFDLENBQUM7UUFDTCxDQUFDLENBQUMsQ0FBQztJQUNMLENBQUMsQ0FBQyxDQUFDO0FBQ0wsQ0FBQztBQTFCRCxvQkEwQkM7QUFFRDtJQUE4QixtQ0FBVTtJQUF4Qzs7SUFZQSxDQUFDO0lBWEMsK0JBQUssR0FBTCxVQUFNLFFBQXdCO1FBQzVCLE1BQU0sQ0FBQyxRQUFRLENBQUMsR0FBRyxDQUFDLFVBQUEsR0FBRyxJQUFJLE9BQUcsdUJBQWMsQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDLFVBQUssR0FBRyxDQUFDLE9BQU8sU0FBSSxHQUFHLENBQUMsV0FBVyxNQUFHLEVBQWxFLENBQWtFLENBQUM7YUFDekYsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO0lBQ2xCLENBQUM7SUFFRCw4QkFBSSxHQUFKLFVBQUssT0FBZSxFQUFFLEdBQVc7UUFFL0IsTUFBTSxDQUFDLEVBQUMsTUFBTSxFQUFFLElBQUksRUFBRSxnQkFBZ0IsRUFBRSxFQUFFLEVBQUMsQ0FBQztJQUM5QyxDQUFDO0lBRUQsZ0NBQU0sR0FBTixVQUFPLEdBQWlCLElBQVksTUFBTSxDQUFDLEdBQUcsQ0FBQyxFQUFFLElBQUksU0FBUyxDQUFDLENBQUMsQ0FBQztJQUNuRSxzQkFBQztBQUFELENBQUMsQUFaRCxDQUE4Qix1QkFBVSxHQVl2QztBQUVELDBCQUEwQixPQUFzQjtJQUM5QyxNQUFNLENBQUMsT0FBTyxDQUFDLEtBQUssQ0FBQyxJQUFJLGVBQWUsRUFBRSxDQUFDLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxDQUFDO0FBQzFELENBQUMifQ==