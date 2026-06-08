declare module 'react-simple-maps' {
  import { ComponentType, SVGProps, ReactNode } from 'react';

  export interface ProjectionConfig {
    scale?: number;
    center?: [number, number];
    rotate?: [number, number, number];
  }

  export interface ComposableMapProps {
    projection?: string;
    projectionConfig?: ProjectionConfig;
    width?: number;
    height?: number;
    style?: React.CSSProperties;
    children?: ReactNode;
  }

  export interface GeographiesChildProps {
    geographies: any[];
  }

  export interface GeographiesProps {
    geography: string | object;
    children: (props: GeographiesChildProps) => ReactNode;
  }

  export interface GeographyStyle {
    default?: { outline?: string; fill?: string; stroke?: string; strokeWidth?: number; opacity?: number };
    hover?:   { outline?: string; fill?: string; stroke?: string; strokeWidth?: number; opacity?: number };
    pressed?: { outline?: string; fill?: string; stroke?: string; strokeWidth?: number; opacity?: number };
  }

  export interface GeographyProps {
    geography: any;
    fill?: string;
    stroke?: string;
    strokeWidth?: number;
    style?: GeographyStyle;
    [key: string]: any;
  }

  export interface MarkerProps {
    coordinates: [number, number];
    children?: ReactNode;
    [key: string]: any;
  }

  export interface LineProps {
    from: [number, number];
    to: [number, number];
    stroke?: string;
    strokeWidth?: number;
    strokeDasharray?: string;
    strokeLinecap?: 'butt' | 'round' | 'square';
    fill?: string;
    [key: string]: any;
  }

  export interface MapContextValue {
    projection: (coords: [number, number]) => [number, number] | null;
    path: any;
    width: number;
    height: number;
  }

  export function useMap(): MapContextValue;

  export const ComposableMap: ComponentType<ComposableMapProps>;
  export const Geographies: ComponentType<GeographiesProps>;
  export const Geography: ComponentType<GeographyProps>;
  export const Marker: ComponentType<MarkerProps>;
  export const Line: ComponentType<LineProps>;
}
