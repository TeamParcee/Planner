import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';
import { Activity } from './activity';
import { FirebaseService } from './firebase.service';
import * as firebase from 'firebase';
import { UserService } from './user.service';
import { AuthService } from './auth/auth.service';

@Injectable({
  providedIn: 'root'
})
export class ActivitiesService {

  constructor(
    private ls: Storage,
    private firebaseService: FirebaseService,
    private userService: UserService,
    private authService: AuthService,
  ) { 
    this.getUser();
  }


  public activeWeek = {week: 0};
  public activeDay = {day: 0};
  user;
  async getUser(){
    this.user = await this.userService.getUserDataFromUid(this.authService.user.uid)
  }
  async createActivity(activity: Activity) {
    return await this.firebaseService.addDocument("users/" + this.user.coach + "/activities", activity);
  
  }

  async updateActivity(activity: Activity) {
    return await this.firebaseService.updateDocument("users/" + this.user.coach + "/activities/" + activity.id, activity)
  }

  async deleteActivity(activity: Activity) {
    return await this.firebaseService.deleteDocument("users/" + this.user.coach + "/activities/" + activity.id)
  }

  
  async getActivity(id) {
    return new Promise((resolve) => {
      return firebase.firestore().doc("users/" + this.user.coach + "/activities/" + id).get().then((snapshot) => {
        return resolve(snapshot.data())
      })
    })
  }

  getActiveWek(){
   return this.activeWeek
  }

  getActiveDay(){
    return this.activeDay
  }
}
