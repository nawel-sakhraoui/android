import { StarRatingBase } from './star-ratings.common';
export declare class StarRating extends StarRatingBase {
    nativeView: android.widget.RatingBar;
    private _stars;
    private _filledColor;
    private _emptyColor;
    createNativeView(): android.widget.RatingBar;
    initNativeView(): void;
    emptyColor: string;
    filledColor: string;
    onLoaded(): void;
    disposeNativeView(): void;
}
