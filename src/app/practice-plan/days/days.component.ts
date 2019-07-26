import { Component, OnInit } from '@angular/core';
import * as firebase from 'firebase';
import { WeekDay } from '@angular/common';
import { FirebaseService } from 'src/app/firebase.service';

@Component({
  selector: 'app-days',
  templateUrl: './days.component.html',
  styleUrls: ['./days.component.scss'],
})
export class DaysComponent implements OnInit {

  constructor(
    private firebaseService: FirebaseService,
  ) { }

  ngOnInit() { }

  days;
  weekid;
  count;

  getDays() {
    firebase.firestore().collection("weeks/" + this.weekid + "/days").onSnapshot((snapshot) => {
      let days = [];
      snapshot.forEach((day) => {
        days.push(day.data())
      })
      this.days = days;
      this.count = (this.days.count) ? this.days.count : this.days.length;
    })
  }

  newDay(){
    this.firebaseService.addDocument("weeks/" + this.weekid, {day: this.count})
  }

  deleteDay(day){
    this.firebaseService.deleteDocument("weeks/" + this.weekid + "/days" + day.id)
  }
  updateDay(day, count){
    this.firebaseService.updateDocument("weeks/" + this.weekid + "/days" + day.id, {day: count})
  }
}
