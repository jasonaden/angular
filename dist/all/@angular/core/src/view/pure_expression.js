"use strict";
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
Object.defineProperty(exports, "__esModule", { value: true });
var types_1 = require("./types");
var util_1 = require("./util");
function purePipeDef(argCount) {
    // argCount + 1 to include the pipe as first arg
    return _pureExpressionDef(128 /* TypePurePipe */, new Array(argCount + 1));
}
exports.purePipeDef = purePipeDef;
function pureArrayDef(argCount) {
    return _pureExpressionDef(32 /* TypePureArray */, new Array(argCount));
}
exports.pureArrayDef = pureArrayDef;
function pureObjectDef(propToIndex) {
    var keys = Object.keys(propToIndex);
    var nbKeys = keys.length;
    var propertyNames = new Array(nbKeys);
    for (var i = 0; i < nbKeys; i++) {
        var key = keys[i];
        var index = propToIndex[key];
        propertyNames[index] = key;
    }
    return _pureExpressionDef(64 /* TypePureObject */, propertyNames);
}
exports.pureObjectDef = pureObjectDef;
function _pureExpressionDef(flags, propertyNames) {
    var bindings = new Array(propertyNames.length);
    for (var i = 0; i < propertyNames.length; i++) {
        var prop = propertyNames[i];
        bindings[i] = {
            flags: 8 /* TypeProperty */,
            name: prop,
            ns: null,
            nonMinifiedName: prop,
            securityContext: null,
            suffix: null
        };
    }
    return {
        // will bet set by the view definition
        index: -1,
        parent: null,
        renderParent: null,
        bindingIndex: -1,
        outputIndex: -1,
        // regular values
        flags: flags,
        childFlags: 0,
        directChildFlags: 0,
        childMatchedQueries: 0,
        matchedQueries: {},
        matchedQueryIds: 0,
        references: {},
        ngContentIndex: -1,
        childCount: 0, bindings: bindings,
        bindingFlags: util_1.calcBindingFlags(bindings),
        outputs: [],
        element: null,
        provider: null,
        text: null,
        query: null,
        ngContent: null
    };
}
function createPureExpression(view, def) {
    return { value: undefined };
}
exports.createPureExpression = createPureExpression;
function checkAndUpdatePureExpressionInline(view, def, v0, v1, v2, v3, v4, v5, v6, v7, v8, v9) {
    var bindings = def.bindings;
    var changed = false;
    var bindLen = bindings.length;
    if (bindLen > 0 && util_1.checkAndUpdateBinding(view, def, 0, v0))
        changed = true;
    if (bindLen > 1 && util_1.checkAndUpdateBinding(view, def, 1, v1))
        changed = true;
    if (bindLen > 2 && util_1.checkAndUpdateBinding(view, def, 2, v2))
        changed = true;
    if (bindLen > 3 && util_1.checkAndUpdateBinding(view, def, 3, v3))
        changed = true;
    if (bindLen > 4 && util_1.checkAndUpdateBinding(view, def, 4, v4))
        changed = true;
    if (bindLen > 5 && util_1.checkAndUpdateBinding(view, def, 5, v5))
        changed = true;
    if (bindLen > 6 && util_1.checkAndUpdateBinding(view, def, 6, v6))
        changed = true;
    if (bindLen > 7 && util_1.checkAndUpdateBinding(view, def, 7, v7))
        changed = true;
    if (bindLen > 8 && util_1.checkAndUpdateBinding(view, def, 8, v8))
        changed = true;
    if (bindLen > 9 && util_1.checkAndUpdateBinding(view, def, 9, v9))
        changed = true;
    if (changed) {
        var data_1 = types_1.asPureExpressionData(view, def.index);
        var value = void 0;
        switch (def.flags & 201347067 /* Types */) {
            case 32 /* TypePureArray */:
                value = new Array(bindings.length);
                if (bindLen > 0)
                    value[0] = v0;
                if (bindLen > 1)
                    value[1] = v1;
                if (bindLen > 2)
                    value[2] = v2;
                if (bindLen > 3)
                    value[3] = v3;
                if (bindLen > 4)
                    value[4] = v4;
                if (bindLen > 5)
                    value[5] = v5;
                if (bindLen > 6)
                    value[6] = v6;
                if (bindLen > 7)
                    value[7] = v7;
                if (bindLen > 8)
                    value[8] = v8;
                if (bindLen > 9)
                    value[9] = v9;
                break;
            case 64 /* TypePureObject */:
                value = {};
                if (bindLen > 0)
                    value[bindings[0].name] = v0;
                if (bindLen > 1)
                    value[bindings[1].name] = v1;
                if (bindLen > 2)
                    value[bindings[2].name] = v2;
                if (bindLen > 3)
                    value[bindings[3].name] = v3;
                if (bindLen > 4)
                    value[bindings[4].name] = v4;
                if (bindLen > 5)
                    value[bindings[5].name] = v5;
                if (bindLen > 6)
                    value[bindings[6].name] = v6;
                if (bindLen > 7)
                    value[bindings[7].name] = v7;
                if (bindLen > 8)
                    value[bindings[8].name] = v8;
                if (bindLen > 9)
                    value[bindings[9].name] = v9;
                break;
            case 128 /* TypePurePipe */:
                var pipe = v0;
                switch (bindLen) {
                    case 1:
                        value = pipe.transform(v0);
                        break;
                    case 2:
                        value = pipe.transform(v1);
                        break;
                    case 3:
                        value = pipe.transform(v1, v2);
                        break;
                    case 4:
                        value = pipe.transform(v1, v2, v3);
                        break;
                    case 5:
                        value = pipe.transform(v1, v2, v3, v4);
                        break;
                    case 6:
                        value = pipe.transform(v1, v2, v3, v4, v5);
                        break;
                    case 7:
                        value = pipe.transform(v1, v2, v3, v4, v5, v6);
                        break;
                    case 8:
                        value = pipe.transform(v1, v2, v3, v4, v5, v6, v7);
                        break;
                    case 9:
                        value = pipe.transform(v1, v2, v3, v4, v5, v6, v7, v8);
                        break;
                    case 10:
                        value = pipe.transform(v1, v2, v3, v4, v5, v6, v7, v8, v9);
                        break;
                }
                break;
        }
        data_1.value = value;
    }
    return changed;
}
exports.checkAndUpdatePureExpressionInline = checkAndUpdatePureExpressionInline;
function checkAndUpdatePureExpressionDynamic(view, def, values) {
    var bindings = def.bindings;
    var changed = false;
    for (var i = 0; i < values.length; i++) {
        // Note: We need to loop over all values, so that
        // the old values are updates as well!
        if (util_1.checkAndUpdateBinding(view, def, i, values[i])) {
            changed = true;
        }
    }
    if (changed) {
        var data_2 = types_1.asPureExpressionData(view, def.index);
        var value = void 0;
        switch (def.flags & 201347067 /* Types */) {
            case 32 /* TypePureArray */:
                value = values;
                break;
            case 64 /* TypePureObject */:
                value = {};
                for (var i = 0; i < values.length; i++) {
                    value[bindings[i].name] = values[i];
                }
                break;
            case 128 /* TypePurePipe */:
                var pipe = values[0];
                var params = values.slice(1);
                value = pipe.transform.apply(pipe, params);
                break;
        }
        data_2.value = value;
    }
    return changed;
}
exports.checkAndUpdatePureExpressionDynamic = checkAndUpdatePureExpressionDynamic;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicHVyZV9leHByZXNzaW9uLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vcGFja2FnZXMvY29yZS9zcmMvdmlldy9wdXJlX2V4cHJlc3Npb24udHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBOzs7Ozs7R0FNRzs7QUFFSCxpQ0FBeUg7QUFDekgsK0JBQStEO0FBRS9ELHFCQUE0QixRQUFnQjtJQUMxQyxnREFBZ0Q7SUFDaEQsTUFBTSxDQUFDLGtCQUFrQix5QkFBeUIsSUFBSSxLQUFLLENBQUMsUUFBUSxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUM7QUFDN0UsQ0FBQztBQUhELGtDQUdDO0FBRUQsc0JBQTZCLFFBQWdCO0lBQzNDLE1BQU0sQ0FBQyxrQkFBa0IseUJBQTBCLElBQUksS0FBSyxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUM7QUFDMUUsQ0FBQztBQUZELG9DQUVDO0FBRUQsdUJBQThCLFdBQWtDO0lBQzlELElBQU0sSUFBSSxHQUFHLE1BQU0sQ0FBQyxJQUFJLENBQUMsV0FBVyxDQUFDLENBQUM7SUFDdEMsSUFBTSxNQUFNLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQztJQUMzQixJQUFNLGFBQWEsR0FBRyxJQUFJLEtBQUssQ0FBQyxNQUFNLENBQUMsQ0FBQztJQUN4QyxHQUFHLENBQUMsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLE1BQU0sRUFBRSxDQUFDLEVBQUUsRUFBRSxDQUFDO1FBQ2hDLElBQU0sR0FBRyxHQUFHLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUNwQixJQUFNLEtBQUssR0FBRyxXQUFXLENBQUMsR0FBRyxDQUFDLENBQUM7UUFDL0IsYUFBYSxDQUFDLEtBQUssQ0FBQyxHQUFHLEdBQUcsQ0FBQztJQUM3QixDQUFDO0lBRUQsTUFBTSxDQUFDLGtCQUFrQiwwQkFBMkIsYUFBYSxDQUFDLENBQUM7QUFDckUsQ0FBQztBQVhELHNDQVdDO0FBRUQsNEJB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Z0JBQ0UsS0FBSyxHQUFHLElBQUksS0FBSyxDQUFDLFFBQVEsQ0FBQyxNQUFNLENBQUMsQ0FBQztnQkFDbkMsRUFBRSxDQUFDLENBQUMsT0FBTyxHQUFHLENBQUMsQ0FBQztvQkFBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLEdBQUcsRUFBRSxDQUFDO2dCQUMvQixFQUFFLENBQUMsQ0FBQyxPQUFPLEdBQUcsQ0FBQyxDQUFDO29CQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsR0FBRyxFQUFFLENBQUM7Z0JBQy9CLEVBQUUsQ0FBQyxDQUFDLE9BQU8sR0FBRyxDQUFDLENBQUM7b0JBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxHQUFHLEVBQUUsQ0FBQztnQkFDL0IsRUFBRSxDQUFDLENBQUMsT0FBTyxHQUFHLENBQUMsQ0FBQztvQkFBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLEdBQUcsRUFBRSxDQUFDO2dCQUMvQixFQUFFLENBQUMsQ0FBQyxPQUFPLEdBQUcsQ0FBQyxDQUFDO29CQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsR0FBRyxFQUFFLENBQUM7Z0JBQy9CLEVBQUUsQ0FBQyxDQUFDLE9BQU8sR0FBRyxDQUFDLENBQUM7b0JBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxHQUFHLEVBQUUsQ0FBQztnQkFDL0IsRUFBRSxDQUFDLENBQUMsT0FBTyxHQUFHLENBQUMsQ0FBQztvQkFBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLEdBQUcsRUFBRSxDQUFDO2dCQUMvQixFQUFFLENBQUMsQ0FBQyxPQUFPLEdBQUcsQ0FBQyxDQUFDO29CQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsR0FBRyxFQUFFLENBQUM7Z0JBQy9CLEVBQUUsQ0FBQyxDQUFDLE9BQU8sR0FBRyxDQUFDLENBQUM7b0JBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxHQUFHLEVBQUUsQ0FBQztnQkFDL0IsRUFBRSxDQUFDLENBQUMsT0FBTyxHQUFHLENBQUMsQ0FBQztvQkFBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLEdBQUcsRUFBRSxDQUFDO2dCQUMvQixLQUFLLENBQUM7WUFDUjtnQkFDRSxLQUFLLEdBQUcsRUFBRSxDQUFDO2dCQUNYLEVBQUUsQ0FBQyxDQUFDLE9BQU8sR0FBRyxDQUFDLENBQUM7b0JBQUMsS0FBSyxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFNLENBQUMsR0FBRyxFQUFFLENBQUM7Z0JBQ2hELEVBQUUsQ0FBQyxDQUFDLE9BQU8sR0FBRyxDQUFDLENBQUM7b0JBQUMsS0FBSyxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFNLENBQUMsR0FBRyxFQUFFLENBQUM7Z0JBQ2hELEVBQUUsQ0FBQyxDQUFDLE9BQU8sR0FBRyxDQUFDLENBQUM7b0JBQUMsS0FBSyxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFNLENBQUMsR0FBRyxFQUFFLENBQUM7Z0JBQ2hELEVBQUUsQ0FBQyxDQUFDLE9BQU8sR0FBRyxDQUFDLENBQUM7b0JBQUMsS0FBSyxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFNLENBQUMsR0FBRyxFQUFFLENBQUM7Z0JBQ2hELEVBQUUsQ0FBQyxDQUFDLE9BQU8sR0FBRyxDQUFDLENBQUM7b0JBQUMsS0FBSyxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFNLENBQUMsR0FBRyxFQUFFLENBQUM7Z0JBQ2hELEVBQUUsQ0FBQyxDQUFDLE9BQU8sR0FBRyxDQUFDLENBQUM7b0JBQUMsS0FBSyxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFNLENBQUMsR0FBRyxFQUFFLENBQUM7Z0JBQ2hELEVBQUUsQ0FBQyxDQUFDLE9BQU8sR0FBRyxDQUFDLENBQUM7b0JBQUMsS0FBSyxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFNLENBQUMsR0FBRyxFQUFFLENBQUM7Z0JBQ2hELEVBQUUsQ0FBQyxDQUFDLE9BQU8sR0FBRyxDQUFDLENBQUM7b0JBQUMsS0FBSyxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFNLENBQUMsR0FBRyxFQUFFLENBQUM7Z0JB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