import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { CanActivate } from '@angular/router/src/utils/preactivation';
import { UserService } from '../user.service';
import { AuthService } from '../auth/auth.service';
import * as firebase from 'firebase';

@Injectable({
  providedIn: 'root'
})
export class ProfileGuard implements CanActivate {
  path: ActivatedRouteSnapshot[]; route: ActivatedRouteSnapshot;

  constructor(
    private userService: UserService,
    private authService: AuthService,
    private router: Router,
  ) { }
 async canActivate() {
    return await this.getProfile();
  }

  getProfile() {
    return new Promise(async (resolve) => {
      firebase.auth().onAuthStateChanged(async(userFirebase) => {
        let user = await this.userService.getUserDataFromUid(userFirebase.uid);
        if (user) {
          return resolve(true)
        } else {
          this.router.navigateByUrl("/profile");
          return resolve(false)
        }
      })
    })

  }
}
