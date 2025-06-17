import { Routes } from '@angular/router';
import { MsalGuard } from '@azure/msal-angular';
import { ProtectedComponent } from './components/routes/protected/protected.component';
import { DefaultLayoutComponent } from './components/layout/default-layout/default-layout.component';
import { LoginComponent } from './components/routes/login/login.component';
export const routesWithoutLoginComponent: Routes = [
    {
        path: '',
        component: DefaultLayoutComponent,
        data: { includeNavBar: true },
        children: [
            {
                path: '',
                component: ProtectedComponent,
                canActivate: [MsalGuard],
            }
        ]
    }
]
export const routes: Routes = [
    {
        path: '',
        component: DefaultLayoutComponent,
        
        children: [
            {
                path: '',
                component: LoginComponent,
                canActivate: [],
            }
        ]
    },
    {
        path: 'protected',
        component: DefaultLayoutComponent,
        data: { includeNavBar: true },
        children: [
            {
                path: '',
                component: ProtectedComponent,
                canActivate: [MsalGuard],
            }
        ]
    }
];
