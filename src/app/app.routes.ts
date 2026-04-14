import { Routes } from '@angular/router';
import { Magictravel } from './layout/magictravel/magictravel';

export const routes: Routes = [
    {
        path: '',
        component: Magictravel,
        children: [
            {
                path: 'home',
                loadComponent: () => import('./pages/home/home').then((mod) => mod.Home),
            },
            {
                path: 'details-trip/:clv',
                loadComponent: () => import('./pages/details/details.page').then((mod) => mod.DetailsPage),
            },
            {
                path: 'travel/:country',
                loadComponent: () => import('./pages/details/details.page').then((mod) => mod.DetailsPage),
            },

            {
                path: '',
                redirectTo: '/home',
                pathMatch: 'full',
            }
        ],
    },
                {
                path: 'explore',
                loadComponent: () => import('./pages/explorar/explorar.page').then((mod) => mod.ExplorarPage),
            },
    {
        path: '**',
        redirectTo: '/home',
    },
];
