import * as React from 'react';
/**
 * Liquid glass surface: frosted, refracting panel with a bright top edge, dim bottom edge and soft lift.
 * Use over photography, grain gradients or busy content (nav bars, floating toolbars, notifications, hero overlays). Never on flat white.
 * @startingPoint section="Surfaces" subtitle="Liquid glass panel, pill and circle" viewport="700x340"
 */
export interface LiquidGlassProps {
  /** dark (default) for photos and navy grounds, light for bright imagery, brand for a blue-tinted glass */
  tone?: 'dark' | 'light' | 'brand';
  /** panel = 28px radius, pill = fully rounded, circle = round button */
  shape?: 'panel' | 'pill' | 'circle';
  /** SVG displacement refraction behind the glass (Chromium only; falls back to blur) */
  refract?: boolean;
  /** hover lift + springy press */
  interactive?: boolean;
  radius?: number | string;
  padding?: number | string;
  as?: keyof JSX.IntrinsicElements;
  onClick?: (e: any) => void;
  style?: React.CSSProperties;
  children?: React.ReactNode;
}
export declare function LiquidGlass(props: LiquidGlassProps): JSX.Element;
