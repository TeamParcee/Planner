import { Component, OnInit } from '@angular/core';
import * as firebase from 'firebase';
import { ComponentService } from 'src/app/component.service';

@Component({
  selector: 'app-past-events',
  templateUrl: './past-events.component.html',
  styleUrls: ['./past-events.component.scss'],
})
export class PastEventsComponent implements OnInit {

  constructor(
    private helper: ComponentService
  ) { }

  schedule;
  ngOnInit() {}

  ionViewWillEnter(){
    this.getSchedule();
  }
  

  getSchedule() {
    firebase.firestore().collection("schedule")
    .orderBy("datetime", "desc")
    .onSnapshot((snapshot) => {
      let schedule = [];
      snapshot.forEach((event) => {
        let date = new Date(event.data().datetime);
        let today = new Date();
        if (date < today) {
          schedule.push(event.data());
        }

      })
      this.schedule = schedule
    })
  }

  close(){
    this.helper.closeModal()
  }
}
