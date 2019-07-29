import { Injectable } from '@angular/core';
import * as Timer from 'easytimer';
import { Observable } from 'rxjs';
import { ComponentService } from './component.service';
import { Event } from './event';
import { Vibration } from '@ionic-native/vibration/ngx';
import { LocalNotifications } from '@ionic-native/local-notifications/ngx';
import { Shake } from '@ionic-native/shake/ngx';
import * as firebase from 'firebase';

@Injectable({
  providedIn: 'root'
})
export class TimerService {

  constructor(
    private componentService: ComponentService,
    private vibration: Vibration,
    private localNotifications: LocalNotifications,
    private shake: Shake,

  ) {

  }




  timer = new Timer();




  private startTime;
  private endTime;
  private timerRunning;
  private previousTime;
  currentTime;




  startCountDownTimer(event: Event) {
   
    this.timer.start({ countdown: true, startValues: { minutes: event.duration } });
    this.timerRunning = true;
    this.waitForTimerToEnd(event);



  }



  waitForTimerToEnd(event) {

    this.timer.addEventListener('targetAchieved', this.timerEnded(event));

  }

  timerEnded(event) {
    console.log("timer ended");
    this.timerRunning = false;
    this.componentService.showOkAlert(event.name + " starting", event.name + " has started.");
    
    let shakeTime = setInterval(()=>{
      this.vibration.vibrate(1000)
    }, 1000)
    
    this.shake.startWatch().subscribe(()=>{
      clearInterval(shakeTime);
    })

    firebase.firestore().doc("utilities/activeEvent").update({name: "Getting Next Event..."})
  }

  isTimerRunning() {
    this.timer.addEventListener('secondsUpdated', () => {
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

