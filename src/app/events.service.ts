import { Injectable } from '@angular/core';
import { Event } from './event';
import { EventGroup } from './event-group';
import { Storage } from '@ionic/storage';
import { EventList } from './event-list';
import { promise } from 'protractor';
import { Observable } from 'rxjs';
import { TimerService } from './timer.service';
import { FirebaseService } from './firebase.service';
import * as firebase from 'firebase';

import { Vibration } from '@ionic-native/vibration/ngx';

@Injectable({
  providedIn: 'root'
})
export class EventsService {

  constructor(
    private ls: Storage,
    private timerService: TimerService,
    private firebaseService: FirebaseService,
    private vibration: Vibration,
  ) { }



  private event: EventGroup;
  activeEventGroup: EventGroup;
  activeEvent: Event;
  activeEventLock;
  count;
  countPlus1;
  lastCount;


  async addEventGroup(eventGroup: EventGroup) {
    new Promise(async (resolve) => {
      this.firebaseService.addDocument("eventgroups", eventGroup)
      return resolve()
    })
  }

  async deleteEventGroup(eventGroup: EventGroup) {
    new Promise(async (resolve) => {
      this.firebaseService.deleteDocument("eventgroups/" + eventGroup.id);
      return resolve()
    })
  }

  async saveEventGroup(eventGroup: EventGroup) {
    new Promise(async (resolve) => {
      this.firebaseService.updateDocument("eventgroups/" + eventGroup.id, eventGroup)
      return resolve()
    })
  }

  async addEvent(event: Event, eventGroup: EventGroup) {
    new Promise(async (resolve) => {
      this.firebaseService.addDocument("eventgroups/" + eventGroup.id + "/events", event)
      return resolve();

    })
  }
  async deleteEvent(event: Event, eventGroup: EventGroup) {
    new Promise(async (resolve) => {
      this.firebaseService.deleteDocument("eventgroups/" + eventGroup.id + "/events" + event.id)
      return resolve()
    })
  }

  async editEvent(event: Event, eventGroup: EventGroup) {
    new Promise(async (resolve) => {
      this.firebaseService.updateDocument("eventgroups/" + eventGroup.id + "/events/" + event.id, event)
      return resolve()

    })
  }



  async getEventGroup(id: string) {
    return new Promise(async (resolve) => {
      let eventGroup = await this.firebaseService.getDocument("eventgroups/" + id);
      console.log(eventGroup);
      return resolve(eventGroup);
    })
  }



  

  async startEvent(eventGroup) {
    this.activeEventGroup = eventGroup;
    let events: any[] = eventGroup;

    firebase.firestore().collection("eventgroups/" + eventGroup.id + "/events")
      .orderBy("order")
      .get().then((snapshot) => {
        snapshot.forEach((event) => {
          events.push(event.data())
        })

     
        let x = 0;
        this.timerService.startCountDownTimer(events[0]);
        this.activeEvent = events[0];
        events.slice(1).forEach((event) => {
          x = event.duration + x
          setTimeout(() => {
            this.activeEvent = event;
            this.timerService.startCountDownTimer(event);
          }, x * 65000);
        })


      })
  }


}
