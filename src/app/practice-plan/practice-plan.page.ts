import { Component, OnInit } from '@angular/core';
import { ActivitiesService } from '../activities.service';
import { Activity } from '../activity';
import { ComponentService } from '../component.service';
import * as firebase from 'firebase';
import { PopoverController, NavController } from '@ionic/angular';
import { DaysComponent } from './days/days.component';
import { WeeksComponent } from './weeks/weeks.component';
import { EventsService } from '../events.service';

import { ViewTemplatesComponent } from './view-templates/view-templates.component';
import { FirebaseService } from '../firebase.service';
import * as moment from 'moment';
import { UserService } from '../user.service';
import { AuthService } from '../auth/auth.service';


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
    private eventService: EventsService,
    private navCtrl: NavController,
    private firebaseService: FirebaseService,
    private userService: UserService,
    private authService: AuthService,
  ) { }

  ngOnInit() {

  }



  currentWeek = this.activityService.activeWeek;
  currentDay: any = this.activityService.activeDay;
  defaultDay;
  defaultWeek;
  activities: any[];
  item;
  editId;
  editname;
  oldValue;
  weekid;
  orderArray: any[];
  totalTime;
  changeOrder;
  user;
  showCalendar;
  dayofweek;
  startTime;
  async ionViewWillEnter() {
    await this.getUser()
    this.editId = null;
    this.getCurrentDay().then(() => {
      console.log("ere");
      this.makeCurrent();
      this.getActivities();

    })


  }

  async getUser() {
    this.user = await this.userService.getUserDataFromUid(this.authService.user.uid)
  }
  newActivity() {
    let activity = new Activity(this.helper.generateid(), 100, "New Activity", 0, "Contact Level", "Please enter some notes...", this.currentDay.day, this.currentWeek.week);
    this.activityService.createActivity(activity);
  }

  async getActivities() {
    let count = 0;
    firebase.firestore().collection("/users/" + this.user.coach + "/activities")
      .where("day", "==", this.currentDay.day)
      .where("week", "==", this.currentWeek.week)
      .orderBy("order")
      .onSnapshot(async (snapshot) => {
        await this.getStartTime();
        this.orderArray = [];
        let activities = [];
        let time = this.startTime;
        let minutes = 0;
        snapshot.forEach((activity) => {
          count = count + 1;
          let a = activity.data();
          a.time = this.getTimeOfEvent(time, minutes);
          // if(a.duration.length < 2)
          this.orderArray.push({ order: count, id: a.id });
          activities.push(a);
          time = a.time;
          minutes = a.duration;
        })
        this.activities = activities;
        console.log(this.activities, "fdsafsadf");
        this.updateDayofWeek();
        this.getTotalTime();

      })
  }


  saveItem(activity) {
    this.oldValue = activity;
    this.activityService.updateActivity(activity);
    this.editname = null;
    this.editId = null
  }
  cancelItem(activity) {
    this.getActivities();
    this.editname = null;
    this.editId = null;
  }

  editItem(item) {
    this.editId = item;

  }



  async viewDays(ev: any) {
    const popover = await this.popOverController.create({
      component: DaysComponent,
      componentProps: { weekid: this.currentWeek.week },
      event: ev,
      translucent: true
    });
    await popover.present();
    await popover.onDidDismiss().then(() => {
      this.currentDay = this.activityService.activeDay
      this.getActivities();
    })
  }

  async viewWeeks(ev: any) {
    const popover = await this.popOverController.create({
      component: WeeksComponent,
      event: ev,
      translucent: true
    });
    await popover.present();
    await popover.onDidDismiss().then(() => {
      this.currentWeek = this.activityService.activeWeek;
      this.getActivities();
    })
  }



  async viewTemplates(ev: any) {
    const popover = await this.popOverController.create({
      component: ViewTemplatesComponent,
      componentProps: { activities: this.activities, day: this.currentDay.day, week: this.currentWeek.week },
      event: ev,
      translucent: true
    });
    await popover.present();
    await popover.onDidDismiss().then(() => {
      this.getActivities();
    })
  }

  updateOrder() {

    this.orderArray.forEach((item) => {
      firebase.firestore().doc("/users/" + this.user.uid + "/activities" + item.id).update({ order: item.order })
    })
  }

  reorderItems(ev) {
    let from = ev.detail.from;
    let to = ev.detail.to;
    let draggedItem = this.orderArray.splice(from, 1)[0];
    this.orderArray.splice(to, 0, draggedItem);
    let count = 0;
    this.orderArray.forEach((item) => {
      count = count + 1;
      item.order = count;

    })
    ev.detail.complete();

    this.updateOrder();

  }

  startPlan() {
    let eventGroup: any = [...this.activities];
    this.eventService.startEvent(eventGroup);
    this.navCtrl.navigateBack("/tabs/home")
  }


  getTotalTime() {
    let time = 0;
    this.activities.forEach((activity) => {
      time = activity.duration + time
    })
    this.totalTime = time;
  }

  makeCurrent() {
    firebase.firestore().doc("/users/" + this.user.uid + "/utilities/currentday").set({ day: this.currentDay, week: this.currentWeek });
    this.getCurrentDay();
  }

  getCurrentDay() {

    return new Promise((resolve) => {
      return firebase.firestore().doc("/users/" + this.user.uid + "/utilities/currentday").get().then((snapshot) => {
        let x = snapshot.data();
        if (x) {
          this.currentDay = x.day;
          this.currentWeek = x.week;
          this.defaultDay = x.day;
          this.defaultWeek = x.week;
          return resolve()
        } else {
          return resolve()
        }

      });
    })

  }

  updateDayofWeek() {

    firebase.firestore().doc("/users/" + this.user.uid + "/weeks/" + this.currentWeek.week + "/days/" + this.currentDay.id).get().then((snapshot) => {
      let x = snapshot.data();
      this.dayofweek = x.dayofweek;
    })

  }
  dateSelected(event) {
    let date = moment(event.toString()).format('ll');
    this.firebaseService.updateDocument("/users/" + this.user.uid + "/weeks/" + this.currentWeek.week + "/days/" + this.currentDay.id, { dayofweek: date })
    this.showCalendar = false;
    this.updateDayofWeek();
  }

  updateStartTime() {
    let time = moment(this.startTime, "hh:mm a").format("LT");
    firebase.firestore().doc("/users/" + this.user.uid + "/weeks/" + this.currentWeek.week + "/days/" + this.currentDay.id).update({ startTime: time });
    this.getActivities();
  }

  getStartTime() {
    return new Promise((resolve) => {
      return firebase.firestore().doc("/users/" + this.user.coach + "/weeks/" + this.currentWeek.week + "/days/" + this.currentDay.id).get().then((snapshot) => {
        let startTime = snapshot.data().startTime;
        this.startTime = (startTime) ? startTime : "Start Time";
        return resolve()
      })
    })

  }

  getTimeOfEvent(time, minutes) {
    return moment(time, "hh:mm a").add('minutes', minutes).format('LT')
  }
}
