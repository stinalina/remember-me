import { environment } from '../../../environments/environment';

import { AvatarImagePipe } from './avatar-image.pipe';

describe('AvatarImagePipe', () => {
  const pipe = new AvatarImagePipe();

  it('should return null when no seed is provided', () => {
    expect(pipe.transform('')).toBeNull();
  });

  it('should build the dicebear avatar url for a seed value', () => {
    expect(pipe.transform('stina')).toBe(
      `${environment.DICEBEAR_URL}?size=96&scale=120&seed=stina`,
    );
  });
});