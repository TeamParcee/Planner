import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';
import { Activity } from './activity';

@Injectable({
  providedIn: 'root'
})
export class ActivitiesService {

  constructor(
    private ls: Storage,
  ) { }


  async createActivity(activity: Activity) {
    let activities: any[] = await this.ls.get("activities");
    if (!activities) {
      this.ls.set("activities", [""]);
    }
    activities.push(activity);
    this.ls.set("activities", activities)
  }

  async updateActivity(activity: Activity) {
    let activities: any[] = await this.ls.get("activities");
    if (!activities) {
      this.ls.set("activities", [""]);
    }
    let index = activities.findIndex(a => a.id == activity.id);
    activities.splice(index, 1, activity);
    this.ls.set("activities", activities);
  }

  async deleteActivity(activity: Activity) {
    let activities: any[] = await this.ls.get("activities");
    if (!activities) {
      this.ls.set("activities", [""]);
    }
    let index = activities.findIndex(a => a.id == - activity.id);
    activities.splice(index, 1);
    this.ls.set("activities", activities);
  }

  async getActivities() {
    let activities: any[] = await this.ls.get("activities");
    if (!activities) {
      this.ls.set("activities", [""]);
    }

    return activities;
  }
}
