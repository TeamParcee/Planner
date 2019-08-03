import { Component, OnInit } from '@angular/core';
import { ComponentService } from '../component.service';
import { NewScheduleItemComponent } from './new-schedule-item/new-schedule-item.component';
import * as firebase from 'firebase';
import { PastEventsComponent } from './past-events/past-events.component';
import { ViewScheduleItemComponent } from './view-schedule-item/view-schedule-item.component';

@Component({
  selector: 'app-schedule',
  templateUrl: './schedule.page.html',
  styleUrls: ['./schedule.page.scss'],
})
export class SchedulePage implements OnInit {

  constructor(
    private helper: ComponentService,

  ) { }

  schedule;
  nextItem;
  ngOnInit() {
  }

  ionViewWillEnter() {
    this.getSchedule();
  }

  newItem() {
    this.helper.showModal(NewScheduleItemComponent, null)
  }

  viewPastEvents(){
    this.helper.showModal(PastEventsComponent, null);
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
      this.schedule = schedule.slice(1);
      this.nextItem = schedule.shift();
    })
  }

  viewEvent(item){
    this.helper.showModal(ViewScheduleItemComponent, {item:item})
  }
}
