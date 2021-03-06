import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { ViewDrillComponent } from './view-drill/view-drill.component';
import { IonicStorageModule } from '@ionic/storage';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import * as firebase from 'firebase';
import { DaysComponent } from './practice-plan/days/days.component';
import { WeeksComponent } from './practice-plan/weeks/weeks.component';
import { CreateEventGroupComponent } from './event-groups/create-event-group/create-event-group.component';
import { AddEventComponent } from './event-group/add-event/add-event.component';
import { EditEventComponent } from './event-group/edit-event/edit-event.component';
import { ViewTemplatesComponent } from './practice-plan/view-templates/view-templates.component';
import { Vibration } from '@ionic-native/vibration/ngx';
import { BackgroundMode } from '@ionic-native/background-mode/ngx';
import { LoginComponent } from './login/login.component';
import { LocalNotifications } from '@ionic-native/local-notifications/ngx';
import { Shake } from '@ionic-native/shake/ngx';
import { QuillModule } from 'ngx-quill'
import { AddDrillComponent } from './drill-library/add-drill/add-drill.component';
import { DatePickerModule } from 'ionic4-date-picker';
import { NewScheduleItemComponent } from './schedule/new-schedule-item/new-schedule-item.component';
import { FromNowPipe } from './pipes/from-now.pipe';
import { PastEventsComponent } from './schedule/past-events/past-events.component';
import { PipesModule } from './pipes/pipes.module';
import { ViewScheduleItemComponent } from './schedule/view-schedule-item/view-schedule-item.component';
import { InAppBrowser } from '@ionic-native/in-app-browser/ngx';
import { AddNewsPage } from './news/add-news/add-news.page';
import { ViewNewsPage } from './news/view-news/view-news.page';



// Your web app's Firebase configuration
var firebaseConfig = {
  apiKey: "AIzaSyAE3AST_EidRw038ej957xstPJFCoGBNbA",
  authDomain: "gerronfootballapp.firebaseapp.com",
  databaseURL: "https://gerronfootballapp.firebaseio.com",
  projectId: "gerronfootballapp",
  storageBucket: "gerronfootballapp.appspot.com",
  messagingSenderId: "248294524088",
  appId: "1:248294524088:web:f00288f7392b08fc"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);


@NgModule({
  declarations: [
    AppComponent,
    DaysComponent,
    WeeksComponent,
    ViewDrillComponent,
    LoginComponent,
    AddDrillComponent,
    CreateEventGroupComponent,
    AddEventComponent,
    AddNewsPage,
    EditEventComponent,
    NewScheduleItemComponent,
    ViewTemplatesComponent,
    PastEventsComponent,
    ViewNewsPage,
    ViewScheduleItemComponent,

  ],
  entryComponents: [
    ViewDrillComponent,
    WeeksComponent,
    LoginComponent,
    AddDrillComponent,
    DaysComponent,
    CreateEventGroupComponent,
    ViewNewsPage,
    AddNewsPage,
    AddEventComponent,
    NewScheduleItemComponent,
    EditEventComponent,
    ViewTemplatesComponent,
    PastEventsComponent,
    ViewScheduleItemComponent,
  ],
  imports: [
    BrowserModule,
    ReactiveFormsModule,
    FormsModule,
    PipesModule,
    IonicModule.forRoot(),
    IonicStorageModule.forRoot(),
    AppRoutingModule],
  providers: [
    StatusBar,
    DatePickerModule,
    SplashScreen,
    Vibration,
    Shake,
    InAppBrowser,
    LocalNotifications,
    BackgroundMode,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
