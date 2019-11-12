"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var view_1 = require("tns-core-modules/ui/core/view");
var FillMode;
(function (FillMode) {
    FillMode["FULL"] = "full";
    FillMode["HALF"] = "half";
    FillMode["PRECISE"] = "precise";
})(FillMode = exports.FillMode || (exports.FillMode = {}));
var StarRatingBase = (function (_super) {
    __extends(StarRatingBase, _super);
    function StarRatingBase() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return StarRatingBase;
}(view_1.View));
exports.StarRatingBase = StarRatingBase;
exports.maxProperty = new view_1.Property({
    name: 'max',
    defaultValue: 5
});
exports.valueProperty = new view_1.Property({
    name: 'value',
    defaultValue: 1
});
exports.fillModeProperty = new view_1.Property({
    name: 'fillMode',
    defaultValue: FillMode.FULL
});
exports.emptyBorderColorProperty = new view_1.CssProperty({
    name: 'emptyBorderColor',
    cssName: 'empty-border-color'
});
exports.filledBorderColorProperty = new view_1.CssProperty({
    name: 'filledBorderColor',
    cssName: 'filled-border-color'
});
exports.emptyColorProperty = new view_1.CssProperty({
    name: 'emptyColor',
    cssName: 'empty-color'
});
exports.filledColorProperty = new view_1.CssProperty({
    name: 'filledColor',
    cssName: 'filled-color'
});

exports.indicatorProperty = new view_1.Property({
	  name: "isIndicator",
	  defaultValue: true
	});
exports.indicatorProperty.register(StarRatingBase);
exports.fillModeProperty.register(StarRatingBase);
exports.emptyBorderColorProperty.register(view_1.Style);
exports.filledBorderColorProperty.register(view_1.Style);
exports.emptyColorProperty.register(view_1.Style);
exports.filledColorProperty.register(view_1.Style);
exports.maxProperty.register(StarRatingBase);
exports.valueProperty.register(StarRatingBase);
//# sourceMappingURL=star-ratings.common.js.map