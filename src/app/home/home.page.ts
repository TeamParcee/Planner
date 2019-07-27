import { Component, OnInit } from '@angular/core';
import { EventsService } from '../events.service';
import { EventGroup } from '../event-group';
import { TimerService } from '../timer.service';
import { from } from 'rxjs';
import { BackgroundMode } from '@ionic-native/background-mode/ngx';


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
  ) { }

  ngOnInit() {
    this.backgroundMode.enable();
  }

  ionViewWillEnter() {
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


  // getCurrentEvent(){
  //     this.activeEventGroup.events.
  // }
}
