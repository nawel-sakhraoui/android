"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var star_ratings_common_1 = require("./star-ratings.common");
var color_1 = require("tns-core-modules/color");

var StarRating = (function (_super) {
    __extends(StarRating, _super);
    function StarRating() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this._filledColor = 'green';
        _this._emptyColor = 'darkgray';
        return _this;
    }
    StarRating.prototype.createNativeView = function () {
        var nativeView = new android.widget.RatingBar(this._context);
        this._stars = nativeView.getProgressDrawable();
        return nativeView;
    };
    StarRating.prototype.initNativeView = function () {
        if (this._filledColor) {
            this.filledColor = this._filledColor;
        }
        if (this._emptyColor) {
            this.emptyColor = this._emptyColor;
        }
        var ref = new WeakRef(this);
        this.nativeView.setOnRatingBarChangeListener(new android.widget.RatingBar.OnRatingBarChangeListener({
            onRatingChanged: function (ratingBar, rating, fromUser) {
                var owner = ref.get();
                if (fromUser) {
                    star_ratings_common_1.valueProperty.nativeValueChange(owner, rating);
                }
            }
        }));
    };
    Object.defineProperty(StarRating.prototype, "emptyColor", {
        set: function (color) {
            this._emptyColor = color;
            if (this._stars) {
                var emptyDrawable = this._stars.getDrawable(0);
                emptyDrawable.setColorFilter(new color_1.Color('darkgray').android, android.graphics.PorterDuff.Mode.SRC_ATOP);
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(StarRating.prototype, "filledColor", {
        set: function (color) {
            this._filledColor = color;
            if (this._stars) {
                var leftDrawable = this._stars.getDrawable(1);
                var rightDrawable = this._stars.getDrawable(2);
                leftDrawable.setColorFilter(new color_1.Color(color).android, android.graphics.PorterDuff.Mode.CLEAR);
                rightDrawable.setColorFilter(new color_1.Color(color).android, android.graphics.PorterDuff.Mode.SRC_ATOP);
            }
        },
        enumerable: true,
        configurable: true
    });
    StarRating.prototype[star_ratings_common_1.fillModeProperty.defaultValue] = function () {
        this.nativeView.setStepSize(1);
    };
    StarRating.prototype[star_ratings_common_1.fillModeProperty.setNative] = function (value) {
        if (this.nativeView) {
            switch (value) {
                case star_ratings_common_1.FillMode.HALF:
                    this.nativeView.setStepSize(0.5);
                    break;
                case star_ratings_common_1.FillMode.PRECISE:
                    this.nativeView.setStepSize(0.1);
                    break;
                default:
                    this.nativeView.setStepSize(1.0);
                    break;
            }
        }
    };
    StarRating.prototype.onLoaded = function () {
        _super.prototype.onLoaded.call(this);
        if (this.nativeView && this.value) {
            this.nativeView.setRating(Number(this.value));
        }
    };
    StarRating.prototype.disposeNativeView = function () {
        if (!this.nativeView)
            return;
        this.nativeView.setOnRatingBarChangeListener(null);
    };
    StarRating.prototype[star_ratings_common_1.valueProperty.setNative] = function (value) {
        if (this.nativeView) {
            this.nativeView.setRating(Number(this.value));
        }
    };
    
    StarRating.prototype[star_ratings_common_1.indicatorProperty.setNative] = function (value) {
        if (this.nativeView) {
            this.nativeView.setIsIndicator(value);
        }
    };
    
    StarRating.prototype[star_ratings_common_1.maxProperty.setNative] = function (max) {
        if (this.nativeView) {
            this.nativeView.setMax(Number(max));
            this.nativeView.setNumStars(Number(max));
        }
    };
    return StarRating;
}(star_ratings_common_1.StarRatingBase));
exports.StarRating = StarRating;
//# sourceMappingURL=star-ratings.android.js.map