import { RangePipe } from './range.pipe';

describe('Range Pipe', () => {
  const pipe = new RangePipe();

  it('should convert a number to an array of numbers', () => {
    const result = pipe.transform(5);
    expect(result).toEqual([0, 1, 2, 3, 4, 5]);
  });
});