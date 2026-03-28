import { ChangeDetectionStrategy, Component, input, signal } from '@angular/core';

@Component({
  selector: 'tm-button',
  imports: [],
  templateUrl: './tm-button.html',
  styleUrl: './tm-button.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TmButton { 
  type = input('primary');
}
