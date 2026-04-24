import { ChangeDetectionStrategy, Component, output } from "@angular/core";
import { AvatarImagePipe } from "@app/personal-space/utils/avatar-image.pipe";

@Component({
  selector: 'reme-avatar-dialog',
  templateUrl: './avatar.dialog.html',
  imports: [
    AvatarImagePipe
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AvatarDialog {
  public readonly selectAvatar = output<string>();

  protected readonly AvatarNames: string[] = [
    'Chase',
    'Brian',
    'Eden',
    'Robert',
    'Kimberly',
    'Leah',
    'Jessica',
    'Sarah',
    'Nolan',
    'Alexander',
    'Aiden',
    'Kingston',
    'Leo',
    'Liliana',
    'Eliza',
    'Emery',
    'Jocelyn',
    'Aidan',
    'Avery',
    'Andrea',
];
}
