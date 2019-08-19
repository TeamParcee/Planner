import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { CanActivate } from '@angular/router/src/utils/preactivation';
import { UserService } from '../user.service';
import { AuthService } from '../auth/auth.service';
import { HelperService } from '../helper.service';
import * as firebase from 'firebase';

@Injectable({
  providedIn: 'root'
})
export class SelectCoachGuard implements CanActivate {
  path: ActivatedRouteSnapshot[];
  route: ActivatedRouteSnapshot;

  constructor(
    private router: Router,
    private userService: UserService,
    private authService: AuthService,
    private helper: HelperService,
  ) {

  }

  canActivate() {

    return this.getCoach();
  }


  getCoach(){
    return new Promise((resolve)=>{
      firebase.auth().onAuthStateChanged(async (userFirebase) => {
        let user: any = await this.userService.getUserDataFromUid(userFirebase.uid);
  
        if (user.coach) {
          return resolve(true)
        } else {
          this.router.navigateByUrl("select-coach")
          return resolve(false);
        }
      })
    })
  }
}
