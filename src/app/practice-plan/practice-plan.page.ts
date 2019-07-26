import { Component, OnInit } from '@angular/core';
import { ActivitiesService } from '../activities.service';
import { Activity } from '../activity';
import { ComponentService } from '../component.service';
import { from, Observable } from 'rxjs';
import * as firebase from 'firebase';
import { PopoverController } from '@ionic/angular';
import { DaysComponent } from './days/days.component';

@Component({
  selector: 'app-practice-plan',
  templateUrl: './practice-plan.page.html',
  styleUrls: ['./practice-plan.page.scss'],
})
export class PracticePlanPage implements OnInit {

  constructor(
    private activityService: ActivitiesService,
    private helper: ComponentService,
    private popOverController: PopoverController,
  ) { }

  ngOnInit() {
    this.getActivities();
  }

  currentWeek = "";
  currentDay = 0;
  activities;
  item;
  editId;
  editname;
  oldValue;
  ionViewWillEnter() {
    this.editId = null;
  }
  newActivity() {
    let activity = new Activity(this.helper.generateid(), "New Activity", "New Duration", "Contact Level", "Please enter some notes...", this.currentDay, this.currentWeek);
    this.activityService.createActivity(activity);
  }

  async getActivities() {

    firebase.firestore().collection("activities").onSnapshot((snapshot)=>{
      let activities = [];
      snapshot.forEach((activity)=>{
        activities.push(activity.data())
      })
      this.activities = activities
    })
  }


  saveItem(activity) {
    this.oldValue = activity;
    this.activityService.updateActivity(activity);
    this.editname = null;
    this.editId = null
  }
  cancelItem(activity){
    this.getActivities();
    this.editname = null;
    this.editId = null;
  }

  editItem(item) {
    this.editId = item;

  }

  reorderItems(ev) {
   ev.detail.complete()
}

async viewDays(ev: any) {
  const popover = await this.popOverController.create({
    component: DaysComponent,
    event: ev,
    translucent: true
  });
  return await popover.present();
}
}
