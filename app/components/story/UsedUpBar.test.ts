import {describe, expect, it} from 'vitest';
import {interpolate} from './UsedUpBar';

describe('UsedUpBar wear schedule', () => {
  const anchors: [number, number][] = [
    [100, 0],
    [200, 1],
    [300, 1],
    [500, 3],
  ];

  it('holds the first stage before the first anchor', () => {
    expect(interpolate(anchors, 0)).toBe(0);
  });

  it('interpolates linearly between anchors', () => {
    expect(interpolate(anchors, 150)).toBe(0.5);
    expect(interpolate(anchors, 400)).toBe(2);
  });

  it('holds flat across a plateau', () => {
    expect(interpolate(anchors, 250)).toBe(1);
  });

  it('holds the last stage past the end', () => {
    expect(interpolate(anchors, 9999)).toBe(3);
  });
});
