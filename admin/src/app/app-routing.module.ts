import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminAuthGuardService } from './core/guards/admin-auth-guard.service';
import { LogoutGuardService } from './core/guards/logout-guard.service';
import { PageNotFoundComponent } from './modules/page-not-found/page-not-found.component';

const routes: Routes = [ 
  { path: '',   
    redirectTo: '/auth', 
    pathMatch: 'full',
  }, 
  {
    path: 'auth',
    loadChildren: () => import('./modules/Auth/login.module').then(m => m.LoginModule),
    data: {
      customLayout: true,
      title: 'Login'
    }
  },
  {
    path: 'dashboard',
    canActivate: [AdminAuthGuardService], 
    loadChildren: () => import('./modules/dashboard/dashboard.module').then(m => m.DashboardModule),
    data: { 
      title: 'Admin Dashboard',
      customLayout: false
    }       
  },
  {
    path: 'organization-listing',
    canActivate: [AdminAuthGuardService], 
    loadChildren: () => import('./modules/organizations/organizations.module').then(m => m.OrganizationsModule),
    data: { 
      title: 'Organizations Listing',
      customLayout: false
    }       
  },
  {
    path: 'category-listing',
    canActivate: [AdminAuthGuardService], 
    loadChildren: () => import('./modules/categories/categories.module').then(m => m.CategoriesModule),
    data: { 
      title: 'Category Listing',
      customLayout: false 
    }       
  },
  {
    path: 'user-listing',
    canActivate: [AdminAuthGuardService], 
    loadChildren: () => import('./modules/users/users.module').then(m => m.UsersModule),
    data: { 
      title: 'User Listing',
      customLayout: false 
    }       
  },
  {
    path: 'questionnaires',
    canActivate: [AdminAuthGuardService], 
    loadChildren: () => import('./modules/questionnaires/questionnaires.module').then(m => m.QuestionnairesModule),
    data: { 
      title: 'Questionnaires Listing',
      customLayout: false 
    }       
  },
  {
    path: 'update-profile',
    canActivate: [AdminAuthGuardService], 
    loadChildren: () => import('./modules/profile/profile.module').then(m => m.ProfileModule),
    data: { 
      title: 'Profile',
      customLayout: false 
    }       
  },
  {
    path: 'faq-listing',
    canActivate: [AdminAuthGuardService], 
    loadChildren: () => import('./modules/faqs/faqs.module').then(m => m.FaqsModule),
    data: { 
      title: 'FAQs Listing',
      customLayout: false 
    }       
  },
  {
    path: 'settings',
    canActivate: [AdminAuthGuardService], 
    loadChildren: () => import('./modules/settings/settings.module').then(m => m.SettingsModule),
    data: { 
      title: 'Settings',
      customLayout: false 
    }       
  },
  {
    path: 'logout',
    loadChildren: () => import('./modules/Auth/login.module').then(m => m.LoginModule),
    data: { registering: false },
    canActivate: [LogoutGuardService]
  },  

  {
    path: 'change-password',
    canActivate: [AdminAuthGuardService], 
    loadChildren: () => import('./modules/change-password/change-password.module').then(m => m.ChangePasswordModule),
    data: { 
      title: 'Change Password',
      customLayout: false
    }       
  },

  { path: '**',
    component: PageNotFoundComponent 
  }

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
