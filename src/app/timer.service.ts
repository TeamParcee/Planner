import { Injectable } from '@angular/core';
import * as Timer from 'easytimer';
import { Observable } from 'rxjs';
import { ComponentService } from './component.service';
import { Event } from './event';
import { Vibration } from '@ionic-native/vibration/ngx';
import { LocalNotifications } from '@ionic-native/local-notifications/ngx';
import * as firebase from 'firebase';
import * as moment from 'moment';

@Injectable({
  providedIn: 'root'
})
export class TimerService {

  constructor(
    private componentService: ComponentService,
    private vibration: Vibration,
    private localNotifications: LocalNotifications,

  ) {

  }




  timer = new Timer();




  private startTime;
  private endTime;
  private timerRunning;
  private previousTime;
  private seconds;
  private miutes;

  currentTime;
  activeEventLock;
  count;
  vibrationInterval;


  startCountDownTimer(event) {
    // console.log("starting countdown timer");


    this.timer.start({ countdown: true, startValues: { minutes: event.duration } });
    // this.isTimerRunning();
    // this.timerRunning = true;
    this.waitForTimerToEnd(event);

   

  }



  waitForTimerToEnd(event) {

    this.timer.addEventListener('targetAchieved', () => {
      this.componentService.showOkAlert("Event Ended", event.name + " has ended. ")
    });

  }

  timerEnded(event) {
    this.timerRunning = false;
    this.componentService.showOkAlert(event.name + " starting", event.name + " has started.");



  }

  isTimerRunning() {
    this.timer.addEventListener('secondsUpdated', (time) => {
      let currentTime = time.path[0].currentTime;
      firebase.firestore().doc("utilities/timer").set({ ...{ time: currentTime } });
      if (this.timerRunning == true) {
        return true
      } else {
        return false;
      }
    })
  }

  getTime() {
    return new Observable((ob) => {
      let timer = this.timer;
      timer.addEventListener('secondsUpdated', function (e) {
        this.currentTime = timer.getTimeValues().toString();
        ob.next(this.currentTime);
      });
    })
  }

  
}

