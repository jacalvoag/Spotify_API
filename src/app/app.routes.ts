import { Routes } from '@angular/router';
import { Layout } from './layout/layout';
import { Home } from './features/home/home';
import { Search } from './features/search/search';

export const routes: Routes = [
    {
    path: '', 
    component: Layout, 
    children: [ 
        {
        path: '', 
        component: Home,
        pathMatch: 'full' 
        },

        {
        path: '',
        component: Search,
        pathMatch: 'full'
        },

    ]
    },
    { path: '**', redirectTo: '' }
];
