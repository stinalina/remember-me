import { Utils } from './utils';

describe('Utils', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('should return tomorrow in yyyy-MM-dd format', () => {
    vi.setSystemTime(new Date('2026-08-06T10:15:00Z'));

    expect(Utils.tomorrow).toBe('2026-08-07');
  });
});