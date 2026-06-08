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

  export interface GeographyProps extends SVGProps<SVGPathElement> {
    geography: any;
    style?: {
      default?: React.CSSProperties & { outline?: string };
      hover?: React.CSSProperties & { outline?: string };
      pressed?: React.CSSProperties & { outline?: string };
    };
  }

  export interface MarkerProps {
    coordinates: [number, number];
    children?: ReactNode;
  }

  export interface LineProps extends SVGProps<SVGPathElement> {
    from: [number, number];
    to: [number, number];
    stroke?: string;
    strokeWidth?: number;
    strokeDasharray?: string;
    strokeLinecap?: 'butt' | 'round' | 'square';
    fill?: string;
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
