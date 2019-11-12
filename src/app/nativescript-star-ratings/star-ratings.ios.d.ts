import { StarRatingBase } from './star-ratings.common';
export declare class StarRating extends StarRatingBase {
    nativeView: CosmosView;
    private _delegate;
    constructor();
    onLoaded(): void;
    onUnloaded(): void;
    disposeNativeView(): void;
    emptyBorderColor: string;
    filledBorderColor: string;
    emptyColor: string;
    filledColor: string;
}
