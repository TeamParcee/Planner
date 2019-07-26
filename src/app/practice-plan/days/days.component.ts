import { Component, OnInit } from '@angular/core';
import * as firebase from 'firebase';
import { WeekDay } from '@angular/common';
import { FirebaseService } from 'src/app/firebase.service';
import { ComponentService } from 'src/app/component.service';
import { ActivitiesService } from 'src/app/activities.service';

@Component({
  selector: 'app-days',
  templateUrl: './days.component.html',
  styleUrls: ['./days.component.scss'],
})
export class DaysComponent implements OnInit {

  constructor(
    private helper: ComponentService,
    private activeService: ActivitiesService,

    private firebaseService: FirebaseService,
  ) { }

  ngOnInit() { 
    this.getDays();
  }

  days;
  weekid;
  count;

  getDays() {
    firebase.firestore().collection("weeks/" + this.weekid + "/days")
    .orderBy("day")
    .onSnapshot((snapshot) => {
      let days = [];
      snapshot.forEach((day) => {
        days.push(day.data())
      })
      this.days = days;
      this.count = (this.days.count) ? this.days.count : this.days.length;
    })
  }

  newDay(){
    this.firebaseService.addDocument("weeks/" + this.weekid + "/days", {day: (this.count + 1)})
  }

  deleteDay() {
    this.helper.confirmationAlert("Delete Day", "Are you sure you want to delete the last day? All Practice Days will also be deleted.", { denyText: "Cancel", confirmText: "Delete Week" })
      .then((result) => {
        if (result) {
          this.firebaseService.deleteDocument("weeks/" + this.days[(this.count - 1)].id)
        }
      })
  }
  updateDay(day, count){
    this.firebaseService.updateDocument("weeks/" + this.weekid + "/days" + day.id, {day: count})
  }

  activeDay(day){
    this.activityService.activeWeek = week;
    this.popoverCtrl.dismiss();
    }
}
