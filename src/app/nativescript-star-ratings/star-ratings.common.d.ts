import { View, Property, CssProperty, Style } from 'tns-core-modules/ui/core/view';
export declare enum FillMode {
    FULL = "full",
    HALF = "half",
    PRECISE = "precise",
}
export declare class StarRatingBase extends View {
    max: number;
    value: number;
}
export declare const maxProperty: Property<StarRatingBase, number>;

export declare const indicatorProperty: Property<StarRatingBase, boolean>;

export declare const valueProperty: Property<StarRatingBase, number>;
export declare const fillModeProperty: Property<StarRatingBase, FillMode>;
export declare const emptyBorderColorProperty: CssProperty<Style, string>;
export declare const filledBorderColorProperty: CssProperty<Style, string>;
export declare const emptyColorProperty: CssProperty<Style, string>;
export declare const filledColorProperty: CssProperty<Style, string>;
