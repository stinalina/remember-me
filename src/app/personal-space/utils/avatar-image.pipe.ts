import { Pipe, PipeTransform } from '@angular/core';
import { environment } from '../../../environments/environment';

@Pipe({ name: 'avatarImage' })
export class AvatarImagePipe implements PipeTransform {

  public transform(value: string): string | null {
    return value 
      ? `${environment.DICEBEAR_URL}?size=96&scale=120&seed=${value}`
      : null;
    }
}