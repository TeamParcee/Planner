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
    this.vibration.vibrate(4000);
    this.activeEventGroup = eventGroup;
   let events:any[] = eventGroup;
    
    firebase.firestore().collection("eventgroups/" + eventGroup.id + "/events")
      .orderBy("order")
      .get().then((snapshot) => {
        snapshot.forEach((event) => {
          events.push(event.data())
        })

        let previousIndex;
        let previousEvent;
        let previousDuration;
        let timeoutTime = 0;
        events.forEach(async (event) => {

          let index = events.findIndex(e => e.id === event.id);
          previousIndex = (index == 0) ? 0 : index - 1;
          previousEvent = events[previousIndex];
          previousDuration = (index == 0) ? 0 : events[previousIndex].duration;

          timeoutTime = timeoutTime + previousDuration;

          setTimeout(() => {
            this.activeEvent = event;
            this.timerService.startCountDownTimer(event);
          }, timeoutTime * 62000)

        })
      })
  }
}
