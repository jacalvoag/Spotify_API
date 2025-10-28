import { Routes } from '@angular/router';
import { Layout } from './layout/layout';
import { Home } from './features/home/home';
import { Search } from './features/search/search';
import { Library } from './features/library/library';

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
            path: 'search', 
            component: Search
        },
        {
            path: 'library', 
            component: Library 
        },
        ]
    },
    { path: '**', redirectTo: '' }
];