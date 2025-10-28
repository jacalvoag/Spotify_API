import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Sidebar } from '../shared/components/sidebar/sidebar';
import { Player } from '../shared/components/player/player';

@Component({
    selector: 'app-layout',
    standalone: true,
    imports: [RouterOutlet, Sidebar, Player],
    templateUrl: './layout.html',
    styleUrl: './layout.css',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Layout {}