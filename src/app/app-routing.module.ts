import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  { path: '', redirectTo: 'tabs', pathMatch: 'full' },
  { path: 'tabs', loadChildren: './tabs/tabs.module#TabsPageModule' },
  { path: 'view-activity', loadChildren: './view-activity/view-activity.module#ViewActivityPageModule' },
  { path: 'edit-drill', loadChildren: './edit-drill/edit-drill.module#EditDrillPageModule' },
  { path: 'edit-activity', loadChildren: './edit-activity/edit-activity.module#EditActivityPageModule' },
  { path: 'event-group', loadChildren: './event-group/event-group.module#EventGroupPageModule' },
  { path: 'event-groups', loadChildren: './event-groups/event-groups.module#EventGroupsPageModule' },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
