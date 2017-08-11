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
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var base64_js_1 = require("base64-js");
// This class is based on the Bitmap examples at:
// http://www.i-programmer.info/projects/36-web/6234-reading-a-bmp-file-in-javascript.html
// and http://www.worldwidewhat.net/2012/07/how-to-draw-bitmaps-using-javascript/
var BitmapService = (function () {
    function BitmapService() {
    }
    BitmapService.prototype.convertToImageData = function (buffer) {
        var bmp = this._getBMP(buffer);
        return this._BMPToImageData(bmp);
    };
    BitmapService.prototype.applySepia = function (imageData) {
        var buffer = imageData.data;
        for (var i = 0; i < buffer.length; i += 4) {
            var r = buffer[i];
            var g = buffer[i + 1];
            var b = buffer[i + 2];
            buffer[i] = (r * .393) + (g * .769) + (b * .189);
            buffer[i + 1] = (r * .349) + (g * .686) + (b * .168);
            buffer[i + 2] = (r * .272) + (g * .534) + (b * .131);
        }
        return imageData;
    };
    BitmapService.prototype.toDataUri = function (imageData) {
        var header = this._createBMPHeader(imageData);
        imageData = this._imageDataToBMP(imageData);
        return 'data:image/bmp;base64,' + btoa(header) + base64_js_1.fromByteArray(imageData.data);
    };
    // converts a .bmp file ArrayBuffer to a dataURI
    BitmapService.prototype.arrayBufferToDataUri = function (data) {
        return 'data:image/bmp;base64,' + base64_js_1.fromByteArray(data);
    };
    // returns a UInt8Array in BMP order (starting from the bottom)
    BitmapService.prototype._imageDataToBMP = function (imageData) {
        var width = imageData.width;
        var height = imageData.height;
        var data = imageData.data;
        for (var y = 0; y < height / 2; ++y) {
            var topIndex = y * width * 4;
            var bottomIndex = (height - y) * width * 4;
            for (var i = 0; i < width * 4; i++) {
                this._swap(data, topIndex, bottomIndex);
                topIndex++;
                bottomIndex++;
            }
        }
        return imageData;
    };
    BitmapService.prototype._swap = function (data, index1, index2) {
        var temp = data[index1];
        data[index1] = data[index2];
        data[index2] = temp;
    };
    // Based on example from
    // http://www.worldwidewhat.net/2012/07/how-to-draw-bitmaps-using-javascript/
    BitmapService.prototype._createBMPHeader = function (imageData) {
        var numFileBytes = this._getLittleEndianHex(imageData.width * imageData.height);
        var w = this._getLittleEndianHex(imageData.width);
        var h = this._getLittleEndianHex(imageData.height);
        return 'BM' +
            numFileBytes +
            '\x00\x00' +
            '\x00\x00' +
            '\x36\x00\x00\x00' +
            '\x28\x00\x00\x00' +
            w +
            h +
            '\x01\x00' +
            '\x20\x00' +
            '\x00\x00\x00\x00' +
            '\x00\x00\x00\x00' +
            '\x13\x0B\x00\x00' +
            '\x13\x0B\x00\x00' +
            '\x00\x00\x00\x00' +
            '\x00\x00\x00\x00'; // 0 important colors (means all colors are important)
    };
    BitmapService.prototype._BMPToImageData = function (bmp) {
        var width = bmp.infoHeader.biWidth;
        var height = bmp.infoHeader.biHeight;
        var imageData = new ImageData(width, height);
        var data = imageData.data;
        var bmpData = bmp.pixels;
        var stride = bmp.stride;
        for (var y = 0; y < height; ++y) {
            for (var x = 0; x < width; ++x) {
                var index1 = (x + width * (height - y)) * 4;
                var index2 = x * 3 + stride * y;
                data[index1] = bmpData[index2 + 2];
                data[index1 + 1] = bmpData[index2 + 1];
                data[index1 + 2] = bmpData[index2];
                data[index1 + 3] = 255;
            }
        }
        return imageData;
    };
    BitmapService.prototype._getBMP = function (buffer) {
        var datav = new DataView(buffer);
        var bitmap = {
            fileHeader: {
                bfType: datav.getUint16(0, true),
                bfSize: datav.getUint32(2, true),
                bfReserved1: datav.getUint16(6, true),
                bfReserved2: datav.getUint16(8, true),
                bfOffBits: datav.getUint32(10, true),
            },
            infoHeader: {
                biSize: datav.getUint32(14, true),
                biWidth: datav.getUint32(18, true),
                biHeight: datav.getUint32(22, true),
                biPlanes: datav.getUint16(26, true),
                biBitCount: datav.getUint16(28, true),
                biCompression: datav.getUint32(30, true),
                biSizeImage: datav.getUint32(34, true),
                biXPelsPerMeter: datav.getUint32(38, true),
                biYPelsPerMeter: datav.getUint32(42, true),
                biClrUsed: datav.getUint32(46, true),
                biClrImportant: datav.getUint32(50, true)
            },
            stride: null,
            pixels: null
        };
        var start = bitmap.fileHeader.bfOffBits;
        bitmap.stride =
            Math.floor((bitmap.infoHeader.biBitCount * bitmap.infoHeader.biWidth + 31) / 32) * 4;
        bitmap.pixels = new Uint8Array(datav.buffer, start);
        return bitmap;
    };
    // Based on example from
    // http://www.worldwidewhat.net/2012/07/how-to-draw-bitmaps-using-javascript/
    BitmapService.prototype._getLittleEndianHex = function (value) {
        var result = [];
        for (var bytes = 4; bytes > 0; bytes--) {
            result.push(String.fromCharCode(value & 255));
            value >>= 8;
        }
        return result.join('');
    };
    return BitmapService;
}());
BitmapService = __decorate([
    core_1.Injectable()
], BitmapService);
exports.BitmapService = BitmapService;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYml0bWFwLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vLi4vbW9kdWxlcy9wbGF5Z3JvdW5kL3NyYy93ZWJfd29ya2Vycy9pbWFnZXMvc2VydmljZXMvYml0bWFwLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQTs7Ozs7O0dBTUc7Ozs7Ozs7O0FBRUgsc0NBQXlDO0FBQ3pDLHVDQUF3QztBQUV4QyxpREFBaUQ7QUFDakQsMEZBQTBGO0FBQzFGLGlGQUFpRjtBQUVqRixJQUFhLGFBQWE7SUFBMUI7SUFrSkEsQ0FBQztJQWpKQywwQ0FBa0IsR0FBbEIsVUFBbUIsTUFBbUI7UUFDcEMsSUFBTSxHQUFHLEdBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQyxNQUFNLENBQUMsQ0FBQztRQUNqQyxNQUFNLENBQUMsSUFBSSxDQUFDLGVBQWUsQ0FBQyxHQUFHLENBQUMsQ0FBQztJQUNuQyxDQUFDO0lBRUQsa0NBQVUsR0FBVixVQUFXLFNBQW9CO1FBQzdCLElBQU0sTUFBTSxHQUFHLFNBQVMsQ0FBQyxJQUFJLENBQUM7UUFDOUIsR0FBRyxDQUFDLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxNQUFNLENBQUMsTUFBTSxFQUFFLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQztZQUMxQyxJQUFNLENBQUMsR0FBRyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDcEIsSUFBTSxDQUFDLEdBQUcsTUFBTSxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQztZQUN4QixJQUFNLENBQUMsR0FBRyxNQUFNLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDO1lBQ3hCLE1BQU0sQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUMsQ0FBQztZQUNqRCxNQUFNLENBQUMs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