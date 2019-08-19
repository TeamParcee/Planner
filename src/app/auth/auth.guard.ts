import { Injectable } from '@angular/core';
import { Router, CanLoad, CanActivate } from '@angular/router';
import { NavController } from '@ionic/angular';
import { AuthService } from './auth.service';
import * as firebase from 'firebase';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(
    private authService: AuthService,
    private router: Router,
    private navCtrl: NavController) {


  }
  user;
  ionViewWillLoad() {

  }
  async canActivate() {

    return this.getUser()
  }


  getUser(): any {
    return new Promise((resolve) => {
      firebase.auth().onAuthStateChanged((user) => {
        this.user = user;
        if (!user) {
          this.router.navigateByUrl("/auth")
          return resolve(false)
        } else {
          return resolve(true)
        }
      })
    })
  }
}
