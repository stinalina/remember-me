import { FormControl } from '@angular/forms';

import { htmlContentValidator } from './html-content.validator';

describe('htmlContentValidator', () => {
  it('should return required when value is empty', () => {
    const validator = htmlContentValidator();

    expect(validator(new FormControl(''))).toEqual({ required: true });
  });

  it('should return required when html contains no visible text', () => {
    const validator = htmlContentValidator();

    expect(validator(new FormControl('<p>&nbsp;</p>'))).toEqual({ required: true });
  });

  it('should return minlength when plain text is shorter than required', () => {
    const validator = htmlContentValidator(3);

    expect(validator(new FormControl('<strong>ab</strong>'))).toEqual({
      minlength: {
        requiredLength: 3,
        actualLength: 2,
      },
    });
  });

  it('should accept html content when decoded text meets the minimum length', () => {
    const validator = htmlContentValidator(6);

    expect(validator(new FormControl('<p>Hello&nbsp;&lt;x&gt;&amp;</p>'))).toBeNull();
  });
});