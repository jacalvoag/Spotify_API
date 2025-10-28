import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Sidebar } from '../shared/components/sidebar/sidebar';

@Component({
    selector: 'app-layout',
    standalone: true,
    imports: [RouterOutlet, Sidebar],
    templateUrl: './layout.html',
    styleUrl: './layout.css',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Layout {}