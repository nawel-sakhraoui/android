"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var star_ratings_common_1 = require("./star-ratings.common");
var color_1 = require("tns-core-modules/color/color");
var StarRating = (function (_super) {
    __extends(StarRating, _super);
    function StarRating() {
        var _this = _super.call(this) || this;
        _this.nativeView = CosmosView.new();
        _this._delegate = CosmosDelegateImpl.initWithOwner(new WeakRef(_this));
        _this.nativeView.settings = CosmosSettings.new();
        _this.nativeView.settings.emptyBorderColor = new color_1.Color('blue').ios;
        _this.nativeView.settings.emptyColor = new color_1.Color('white').ios;
        _this.nativeView.settings.filledBorderColor = new color_1.Color('blue').ios;
        _this.nativeView.settings.filledColor = new color_1.Color('blue').ios;
        _this.nativeView.rating = 0;
        _this.nativeView.settings.minTouchRating = 0;
        return _this;
    }
    StarRating.prototype.onLoaded = function () {
        _super.prototype.onLoaded.call(this);
        this.nativeView.delegate = this._delegate;
    };
    StarRating.prototype.onUnloaded = function () {
        _super.prototype.onUnloaded.call(this);
        this.nativeView.delegate = null;
    };
    StarRating.prototype.disposeNativeView = function () {
        this._delegate = null;
    };
    Object.defineProperty(StarRating.prototype, "emptyBorderColor", {
        set: function (color) {
            if (this.nativeView) {
                this.nativeView.settings.emptyBorderColor = new color_1.Color(color).ios;
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(StarRating.prototype, "filledBorderColor", {
        set: function (color) {
            if (this.nativeView) {
                this.nativeView.settings.filledBorderColor = new color_1.Color(color).ios;
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(StarRating.prototype, "emptyColor", {
        set: function (color) {
            if (this.nativeView) {
                this.nativeView.settings.emptyColor = new color_1.Color(color).ios;
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(StarRating.prototype, "filledColor", {
        set: function (color) {
            if (this.nativeView) {
                this.nativeView.settings.filledColor = new color_1.Color(color).ios;
            }
        },
        enumerable: true,
        configurable: true
    });
    StarRating.prototype[star_ratings_common_1.fillModeProperty.setNative] = function (value) {
        if (this.nativeView) {
            switch (value) {
                case star_ratings_common_1.FillMode.HALF:
                    this.nativeView.settings.fillMode = 1;
                    break;
                case star_ratings_common_1.FillMode.PRECISE:
                    this.nativeView.settings.fillMode = 2;
                    break;
                default:
                    this.nativeView.settings.fillMode = 0;
                    break;
            }
        }
    };
    StarRating.prototype[star_ratings_common_1.valueProperty.setNative] = function (value) {
        if (this.nativeView) {
            this.nativeView.rating = value;
        }
    };
    StarRating.prototype[star_ratings_common_1.maxProperty.setNative] = function (max) {
        if (this.nativeView) {
            this.nativeView.settings.totalStars = max;
            this.nativeView.update();
            this.width = this.nativeView.intrinsicContentSize.width;
            this.height = this.nativeView.intrinsicContentSize.height;
        }
    };
    return StarRating;
}(star_ratings_common_1.StarRatingBase));
exports.StarRating = StarRating;
var CosmosDelegateImpl = (function (_super) {
    __extends(CosmosDelegateImpl, _super);
    function CosmosDelegateImpl() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    CosmosDelegateImpl.initWithOwner = function (owner) {
        var delegate = new CosmosDelegateImpl();
        delegate._owner = owner;
        return delegate;
    };
    CosmosDelegateImpl.prototype.didFinishTouchingCosmosWithRating = function (rating) {
        var owner = this._owner.get();
        owner.value = rating;
    };
    CosmosDelegateImpl.ObjCProtocols = [CosmosDelegate];
    return CosmosDelegateImpl;
}(NSObject));
//# sourceMappingURL=star-ratings.ios.js.map