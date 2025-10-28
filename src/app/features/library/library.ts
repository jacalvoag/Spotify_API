import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-library',
  standalone: true,
  imports: [],
  templateUrl: './library.html',
  styleUrl: './library.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Library {} 
