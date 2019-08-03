import { Component, OnInit } from '@angular/core';
import { EventsService } from '../events.service';
import { EventGroup } from '../event-group';
import { TimerService } from '../timer.service';
import { from } from 'rxjs';
import { BackgroundMode } from '@ionic-native/background-mode/ngx';
import { ComponentService } from '../component.service';
import { LoginComponent } from '../login/login.component';
import * as firebase from 'firebase';


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
    private helper: ComponentService,
  ) { }


  user;
  nextItem;

  ngOnInit() {
    this.backgroundMode.enable();
    this.getSchedule();
  }

  ionViewWillEnter() {

    firebase.auth().onAuthStateChanged((user)=>{
      this.user = user;
    })
    this.activeEventGroup = (this.eventService.activeEventGroup) ? this.eventService.activeEventGroup : this.dummyEventGroup;
   
    this.timeService.getTime().subscribe((result)=>{
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


  showLogin(){
    this.helper.showModal(LoginComponent, null)
  }

  viewProfile(){
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

}
