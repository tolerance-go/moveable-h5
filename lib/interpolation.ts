import { CatmullRomCurve3 } from 'three/src/extras/curves/CatmullRomCurve3';
import { SplineCurve } from 'three/src/extras/curves/SplineCurve';
import { Point, Point3d } from './class';
import { Vector2 } from 'three/src/math/Vector2';

export interface Interpolation<T> {
  (items: T[], length: number): T[];
}

/**
 * 3次样条，2维插值
 *
 * @param {Point[]} points
 * @param {number} length
 * @returns {Point[]}
 */
const spline: Interpolation<Point> = function(
  points: Point[],
  length: number = points.length
): Point[] {
  if (!length) {
    return [];
  }
  const curve = new SplineCurve(points);
  return curve.getPoints(length);
};

/**
 * 3次样条，3维插值
 *
 * @param {Point[]} points
 * @param {number} length
 * @returns {Point[]}
 */
const spline3d: Interpolation<Point3d> = function(
  points: Point3d[],
  length: number = points.length
): Point3d[] {
  if (!length) {
    return [];
  }
  const curve = new CatmullRomCurve3(points);
  return curve.getPoints(length);
};

/**
 * 步长，1维插值
 *
 * @param {number[]} paths
 * @param {number} length
 * @returns {number[]}
 */
const step: Interpolation<number> = function(
  paths: number[],
  length: number = paths.length
): number[] {
  if (!length) {
    return [];
  }
  const fakePoints = paths.map(value => ({ x: value, y: 0 }));
  const curve = new SplineCurve(fakePoints as Vector2[]);
  return curve.getPoints(length).map(({ x }) => x);
};

/**
 * 插值 string
 *
 * ['tom', 'any', 'big'], 6 => ['tom', 'tom', 'any', 'any', 'big', 'big]
 *
 * @param {string[]} name
 * @param {number} length
 * @returns {string[]}
 */
const chunk: Interpolation<any> = function(items: any[], length: number = items.length): any[] {
  if (!length) {
    return [];
  }
  const chunkLen = Math.round(length / items.length);
  const chunks = items
    .map(item => Array(chunkLen).fill(item))
    .reduce((arr, next) => arr.concat(next));
  return chunks;
};

export { spline, spline3d, step, chunk };
