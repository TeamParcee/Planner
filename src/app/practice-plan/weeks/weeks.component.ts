import { Component, OnInit } from '@angular/core';
import * as firebase from 'firebase';
import { FirebaseService } from 'src/app/firebase.service';
import { ComponentService } from 'src/app/component.service';
import { ActivitiesService } from 'src/app/activities.service';
import { PopoverController } from '@ionic/angular';
import { UserService } from 'src/app/user.service';
import { AuthService } from 'src/app/auth/auth.service';

@Component({
  selector: 'app-weeks',
  templateUrl: './weeks.component.html',
  styleUrls: ['./weeks.component.scss'],
})
export class WeeksComponent implements OnInit {

  constructor(
    private helper: ComponentService,
    private firebaseService: FirebaseService,
    private activityService: ActivitiesService,
    private popoverCtrl: PopoverController,
    private userService: UserService,
    private authService: AuthService,

  ) { }

  async ngOnInit() {


  }

  async ionViewWillEnter() {
    await this.getUser();
    console.log(this.user);
    this.getWeeks();

  }
  weeks;
  count;
  user;
  weekid;
  weekCount;
  dayCount;
  days: any;

  async getUser() {
    this.user = await this.userService.getUserDataFromUid(this.authService.user.uid);
  }

  getWeeks() {
    firebase.firestore().collection("users/" + this.user.coach + "/weeks").orderBy("week").onSnapshot((snapshot) => {
      let weeks = [];
      snapshot.forEach((week) => {
        weeks.push(week.data())
      })
      this.getDays();
      this.weeks = [...weeks];
      this.weekCount = (this.weeks.length) ? this.weeks.length : 0;
    })
  }

  getDays() {
    firebase.firestore().collection("users/" + this.user.coach + "/weeks/" + this.weekid + "/days")
      .orderBy("day")
      .onSnapshot((snapshot) => {
        let days = [];
        snapshot.forEach((day) => {
          days.push(day.data())
        })
        this.days = days;
        this.dayCount = (this.days.count) ? this.days.count : this.days.length;
      })
  }
  newWeek() {
    this.firebaseService.addDocument("users/" + this.user.coach + "/weeks", { week: (this.weekCount + 1) });
    this.newDay();
  }

  deleteWeek() {
    this.helper.confirmationAlert("Delete Week", "Are you sure you want to delete the last week? All Practice Days will also be deleted.", { denyText: "Cancel", confirmText: "Delete Week" })
      .then((result) => {
        if (result) {
          this.firebaseService.deleteDocument("users/" + this.user.coach + "/weeks/" + this.weeks[(this.weekCount - 1)].id)
        }
      })
  }

  activeWeek(week) {
    this.activityService.activeWeek = week;
    this.popoverCtrl.dismiss();
  }

  newDay() {
    console.log(this.dayCount);
    this.firebaseService.addDocument("users/" + this.user.coach + "/weeks/" + (this.weekCount + 1) + "/days", { day: (this.dayCount + 1) })
  }
}
