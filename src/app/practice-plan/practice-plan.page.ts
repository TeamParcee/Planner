import { Component, OnInit } from '@angular/core';
import { ActivitiesService } from '../activities.service';
import { Activity } from '../activity';
import { ComponentService } from '../component.service';
import { from, Observable, Subject } from 'rxjs';
import * as firebase from 'firebase';
import { PopoverController, NavController } from '@ionic/angular';
import { DaysComponent } from './days/days.component';
import { WeeksComponent } from './weeks/weeks.component';
import { EventsService } from '../events.service';
import { EventGroup } from '../event-group';
import { TemplatesPage } from '../templates/templates.page';
import { ViewTemplatesComponent } from './view-templates/view-templates.component';
import { FirebaseService } from '../firebase.service';
import { ChooseDayofweekComponent } from './choose-dayofweek/choose-dayofweek.component';
import * as moment from 'moment';

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

  ionViewWillEnter() {
    this.editId = null;
    this.getCurrentDay().then(() => {
      this.makeCurrent();
      this.getActivities();

    })

    firebase.auth().onAuthStateChanged((user) => {
      this.user = user;
    })
  }
  newActivity() {
    console.log("made");
    let activity = new Activity(this.helper.generateid(), 100, "New Activity", 0, "Contact Level", "Please enter some notes...", this.currentDay.day, this.currentWeek.week);
    this.activityService.createActivity(activity);
  }

  async getActivities() {
    let count = 0;
    firebase.firestore().collection("activities")
      .where("day", "==", this.currentDay.day)
      .where("week", "==", this.currentWeek.week)
      .orderBy("order")
      .onSnapshot((snapshot) => {
        this.orderArray = [];
        let activities = [];
        snapshot.forEach((activity) => {
          count = count + 1;
          let a = activity.data();
          // if(a.duration.length < 2)
          this.orderArray.push({ order: count, id: a.id });
          activities.push(activity.data());
        })
        this.activities = activities;
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
      firebase.firestore().doc("/activities/" + item.id).update({ order: item.order })
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
    firebase.firestore().doc("utilities/currentday").set({ day: this.currentDay, week: this.currentWeek });
    this.getCurrentDay();
  }

  getCurrentDay() {

    return new Promise((resolve) => {
      return firebase.firestore().doc("utilities/currentday").get().then((snapshot) => {
        let x = snapshot.data();

        this.currentDay = x.day;
        this.currentWeek = x.week;
        this.defaultDay = x.day;
        return resolve()
      });
    })

  }

  updateDayofWeek(){

    firebase.firestore().doc("weeks/" + this.currentWeek.week + "/days/" + this.currentDay.id).get().then((snapshot) => {
      let x = snapshot.data();
      this.dayofweek = x.dayofweek;
    })
   
  }
  dateSelected(event) {
    let date = moment(event.toString()).format('ll');
    this.firebaseService.updateDocument("weeks/" + this.currentWeek.week + "/days/" + this.currentDay.id, {dayofweek: date})
    this.showCalendar = false;
    this.updateDayofWeek();
  }
}
