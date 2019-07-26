import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';
import { Activity } from './activity';
import { FirebaseService } from './firebase.service';
import * as firebase from 'firebase';

@Injectable({
  providedIn: 'root'
})
export class ActivitiesService {

  constructor(
    private ls: Storage,
    private firebaseService: FirebaseService,
  ) { }


  public activeWeek = {week: 1};
  public activeDay = {day: 1};

  async createActivity(activity: Activity) {

    return await this.firebaseService.addDocument("activities", activity);
  
  }

  async updateActivity(activity: Activity) {
    return await this.firebaseService.updateDocument("activities/" + activity.id, activity)
  }

  async deleteActivity(activity: Activity) {
    return await this.firebaseService.deleteDocument("activities/" + activity.id)
  }

  
  async getActivity(id) {
    return new Promise((resolve) => {
      return firebase.firestore().doc("activities/" + id).get().then((snapshot) => {
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
