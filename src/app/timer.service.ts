import { Injectable } from '@angular/core';
import * as Timer from 'easytimer';
import { Observable } from 'rxjs';
import { ComponentService } from './component.service';
import { Event } from './event';
import { Vibration } from '@ionic-native/vibration/ngx';


@Injectable({
  providedIn: 'root'
})
export class TimerService {

  constructor(
    private componentService: ComponentService,
    private vibration: Vibration,
  ) {

  }




  timer = new Timer();




  private startTime;
  private endTime;
  private timerRunning;
  private previousTime;
  currentTime;
  



  startCountDownTimer(event: Event) {
        this.vibration.vibrate(4000);    
        this.timer.start({ countdown: true, startValues: { minutes: event.duration } });
        this.timerRunning = true;
        this.waitForTimerToEnd(event);



  }



  waitForTimerToEnd(event) {

    this.timer.addEventListener('targetAchieved', this.timerEnded(event));

  }

  timerEnded(event) {
    this.timerRunning = false;
    this.componentService.showOkAlert(event.name + " starting", event.name + " has started.")
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

