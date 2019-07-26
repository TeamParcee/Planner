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
    ViewDrillComponent,
  ],
  entryComponents: [
    ViewDrillComponent,
  ],
  imports: [
    BrowserModule,
    ReactiveFormsModule,
    FormsModule,
    IonicModule.forRoot(),
    IonicStorageModule.forRoot(),
    AppRoutingModule],
  providers: [
    StatusBar,
    SplashScreen,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
