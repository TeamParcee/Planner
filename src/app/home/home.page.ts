import { Component, OnInit } from '@angular/core';
import { EventsService } from '../events.service';
import { EventGroup } from '../event-group';
import { TimerService } from '../timer.service';
import { from } from 'rxjs';
import { BackgroundMode } from '@ionic-native/background-mode/ngx';
import { ComponentService } from '../component.service';
import { LoginComponent } from '../login/login.component';
import * as firebase from 'firebase';
import { HelperService } from '../helper.service';
import { ProfilePage } from '../profile/profile.page';
import { AuthService } from '../auth/auth.service';
import { UserService } from '../user.service';
import { Vibration } from '@ionic-native/vibration/ngx';
import { LocalNotifications } from '@ionic-native/local-notifications/ngx';


@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {

  constructor(
    private backgroundMode: BackgroundMode,
    private eventService: EventsService,
    private timeService: TimerService,
    private helper: HelperService,
    private authService: AuthService,
    private userService: UserService,
    private vibration: Vibration,
    private localNotifications: LocalNotifications,
  ) { }


  user;
  nextItem;
  vibrateInterval;
  ngOnInit() {
    this.backgroundMode.enable();
    this.getSchedule();
  }

  async getUser() {
    this.user = await this.userService.getUserDataFromUid(this.authService.user.uid);
  }
  ionViewWillEnter() {

    this.getUser();
    this.activeEventGroup = (this.eventService.activeEventGroup) ? this.eventService.activeEventGroup : this.dummyEventGroup;

    this.timeService.getTime().subscribe((result) => {
      this.time = result;
      this.currentEvent = (this.eventService.activeEvent) ? this.eventService.activeEvent : null;
    })
  }

  activeEventGroup: EventGroup;
  currentEvent;
  time;

  dummyEventGroup: EventGroup = {
    id: "1",
    title: "No Active Event Group",
  }


  showLogin() {
    this.helper.openModal(LoginComponent, null)
  }

  viewProfile() {
    console.log(this.user)
  }

  getSchedule() {
    firebase.firestore().collection("schedule")
      .orderBy("datetime")
      .onSnapshot((snapshot) => {
        let schedule = [];
        snapshot.forEach((event) => {
          let date = new Date(event.data().datetime);
          let today = new Date();
          if (date > today) {
            schedule.push(event.data());
          }

        })
        this.nextItem = schedule.shift();
      })
  }

  vibrate() {
    this.vibrateInterval = setInterval(() => {
      this.vibration.vibrate(1000)
    }, 2000)
    this.localNotifications.schedule({
      id: 1,
      title: "GFPlanner",
      text: 'Activity Has Completed',
      sound: 'file://beep.caf',
    });
  }

  stopVibrate() {
    clearInterval(this.vibrateInterval)
  }
}
