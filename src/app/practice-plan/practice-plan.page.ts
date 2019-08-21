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
import { TimerService } from '../timer.service';
import { LocalNotifications } from '@ionic-native/local-notifications/ngx';
import { BackgroundMode } from '@ionic-native/background-mode/ngx';
import { promise } from 'protractor';


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
    private timerService: TimerService,
    private localNotifications: LocalNotifications,
    private background: BackgroundMode,
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
  count = 0;
  length;
  timerInterval;
  activeTime;
  activeActivity;
  activeStart;
  showStartTime;
  
  async ionViewWillEnter() {
    await this.getUser();
    
    this.editId = null;
    this.getCurrentDay().then(async () => {
      this.makeCurrent();
      this.getActivities()
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
    this.updateDayofWeek();
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
          a.date = this.dayofweek;
          // if(a.duration.length < 2)
          this.orderArray.push({ order: count, id: a.id });
          activities.push(a);
          time = a.time;
          minutes = a.duration;
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

  stopPlan(){
    this.firebaseService.setDocument("users/" + this.user.uid + "/utilities/activeActivity", {active: false})
    this.activeActivity = null;
    clearInterval(this.timerInterval);
    this.count = 0
  }
  startPlan() {
    this.firebaseService.setDocument("users/" + this.user.uid + "/utilities/activeActivity", {active: true})
    this.length = this.activities.length;
    if (this.length > this.count) {
      this.getTimerCount(this.activities[this.count])
    } else {
      this.activeActivity = null;
      clearInterval(this.timerInterval);
      this.count = 0
    }

  }
checkPlanStarted(){
  firebase.firestore().doc("users/" + this.user.uid + "/utilities/activeActivity").get().then((active)=>{
    if(active.data()){
      this.startPlan()
    } 
  })
}
  getTimerCount(activity) {
    this.timerInterval = setInterval(() => {
      let datetime = activity.date + " " + activity.time;
      let now = new Date().getTime();
      let countDownDate = new Date(datetime).getTime();

      let distance = countDownDate - now;

      var days = Math.floor(distance / (1000 * 60 * 60 * 24));
      var hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
      var seconds = Math.floor((distance % (1000 * 60)) / 1000);
      let time = hours + ":" + minutes + ":" + seconds;
     
      if (distance < 0) {
        this.activeTime = "Time Past";
        this.activeActivity = activity.name;
        clearInterval(this.timerInterval);
        this.count++;
        this.startPlan();
      } else {
        this.activeTime = time
        this.activeActivity = activity.name;
        this.activeStart = activity.time;
      }
    }, 1000)


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
      return firebase.firestore().doc("/users/" + this.user.coach + "/utilities/currentday").get().then((snapshot) => {
        if (snapshot.exists) {
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

        }
        return resolve();
      });
    })

  }

  updateDayofWeek() {

    firebase.firestore().doc("/users/" + this.user.uid + "/weeks/" + this.currentWeek.week + "/days/" + this.currentDay.id).get().then((snapshot) => {
      if (snapshot.exists) {
        let x = snapshot.data();
        this.dayofweek = x.dayofweek;
      }
    })

  }
  dateSelected(event) {
    let date = moment(event.toString()).format('ll');
    this.firebaseService.updateDocument("/users/" + this.user.uid + "/weeks/" + this.currentWeek.week + "/days/" + this.currentDay.id, { dayofweek: date })
    this.showCalendar = false;
    this.updateDayofWeek();
  }

  updateStartTime() {
    // let time = moment(this.startTime, "hh:mm a").format("LT");
    let time = this.startTime;
    firebase.firestore().doc("/users/" + this.user.uid + "/weeks/" + this.currentWeek.week + "/days/" + this.currentDay.id).update({ startTime: time });
    this.getActivities();
  }

  getStartTime() {
    return new Promise((resolve) => {
      return firebase.firestore().doc("/users/" + this.user.coach + "/weeks/" + this.currentWeek.week + "/days/" + this.currentDay.id).get().then((snapshot) => {
        if (snapshot.exists) {
          let startTime = moment(snapshot.data().startTime, "HH, mm").format("LT");
          this.startTime = (startTime) ? startTime : "Start Time";
          return resolve()
        } else {
          this.startTime = "Start Time";
          return resolve()
        }

      })
    })

  }

  getTimeOfEvent(time, minutes) {
    return moment(time, "hh:mm a").add('minutes', minutes).format('LT')
  }

  // startVibration() {
  //   this.vibrationInterval = setInterval(() => {
  //     this.vibration.vibrate(1000)
  //   }, 2000)
  // }

  // stopVibration(){
  //   clearInterval(this.vibrationInterval)
  // }
}
