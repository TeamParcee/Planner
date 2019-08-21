import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './auth/auth.guard';
import { SelectCoachGuard } from './select-coach/select-coach.guard';
import { ProfileGuard } from './profile/profile.guard';

const routes: Routes = [
  { path: '', redirectTo: 'tabs', pathMatch: 'full', canActivate: [AuthGuard] },
  { path: 'tabs', loadChildren: './tabs/tabs.module#TabsPageModule', canActivate: [AuthGuard, SelectCoachGuard ] },
  { path: 'view-activity', loadChildren: './view-activity/view-activity.module#ViewActivityPageModule', canActivate: [AuthGuard] },
  { path: 'edit-drill', loadChildren: './edit-drill/edit-drill.module#EditDrillPageModule', canActivate: [AuthGuard] },
  { path: 'edit-activity', loadChildren: './edit-activity/edit-activity.module#EditActivityPageModule', canActivate: [AuthGuard] },
  { path: 'event-group', loadChildren: './event-group/event-group.module#EventGroupPageModule', canActivate: [AuthGuard] },
  { path: 'event-groups', loadChildren: './event-groups/event-groups.module#EventGroupsPageModule', canActivate: [AuthGuard] },
  { path: 'about', loadChildren: './about/about.module#AboutPageModule', canActivate: [AuthGuard] },
  { path: 'news', loadChildren: './news/news.module#NewsPageModule', canActivate: [AuthGuard] },
  { path: 'events', loadChildren: './events/events.module#EventsPageModule', canActivate: [AuthGuard] },
  { path: 'auth', loadChildren: './auth/auth.module#AuthPageModule',  },
  { path: 'profile', loadChildren: './profile/profile.module#ProfilePageModule', canActivate: [AuthGuard]  },
  { path: 'select-coach', loadChildren: './select-coach/select-coach.module#SelectCoachPageModule' },
  { path: 'add-news', loadChildren: './news/add-news/add-news.module#AddNewsPageModule' },
  { path: 'view-news', loadChildren: './news/view-news/view-news.module#ViewNewsPageModule' },





];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
