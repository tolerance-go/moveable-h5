export interface Size {
  width: number;
  height: number;
}

export interface Position {
  x: number;
  y: number;
}

export interface Point {
  x: number;
  y: number;
}

export interface Point3d {
  x: number;
  y: number;
  z: number;
}

export type ValueOf<T> = T[keyof T]

export type Direction = 'x' | 'y';
