import { Component, OnInit } from '@angular/core';
import { ComponentService } from '../component.service';
import { NewScheduleItemComponent } from './new-schedule-item/new-schedule-item.component';
import * as firebase from 'firebase';
import { PastEventsComponent } from './past-events/past-events.component';
import { ViewScheduleItemComponent } from './view-schedule-item/view-schedule-item.component';
import { UserService } from '../user.service';
import { AuthService } from '../auth/auth.service';

@Component({
  selector: 'app-schedule',
  templateUrl: './schedule.page.html',
  styleUrls: ['./schedule.page.scss'],
})
export class SchedulePage implements OnInit {

  constructor(
    private helper: ComponentService,
    private userService: UserService,
    private authService: AuthService,
  ) { }

  schedule;
  nextItem;
  user;
  async getUser() {
    this.user = await this.userService.getUserDataFromUid(this.authService.user.uid);
  }
  ngOnInit() {
  }

  async ionViewWillEnter() {
    await this.getUser();
    this.getSchedule();
  }

  newItem() {
    this.helper.showModal(NewScheduleItemComponent, null)
  }

  viewPastEvents() {
    this.helper.showModal(PastEventsComponent, null);
  }
  getSchedule() {
    firebase.firestore().collection("/users/" + this.user.coach + "/schedule")
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
        this.schedule = schedule.slice(1);
        this.nextItem = schedule.shift();
      })
  }

  viewEvent(item) {
    this.helper.showModal(ViewScheduleItemComponent, { item: item })
  }
}
