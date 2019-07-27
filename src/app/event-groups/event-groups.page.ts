import { Component, OnInit } from '@angular/core';
import { ComponentService } from '../component.service';
import { CreateEventGroupComponent } from './create-event-group/create-event-group.component';
import { EventsService } from '../events.service';
import { ActivatedRoute, RouterLink, Router } from '@angular/router';
import { NavController } from '@ionic/angular';
import * as firebase from 'firebase';

@Component({
  selector: 'app-event-groups',
  templateUrl: './event-groups.page.html',
  styleUrls: ['./event-groups.page.scss'],
})
export class EventGroupsPage implements OnInit {

  constructor(
    private componentService: ComponentService,
    private eventService: EventsService,
    private route: ActivatedRoute,
    private navCtrl: NavController,
  ) { }


  eventGroups;
  eventsCount;

  ngOnInit() {
  }

  async ionViewWillEnter() {

    this.getEventGroups();

  }
  addEventGroup() {
    this.componentService.showModal(CreateEventGroupComponent, null)
  }

  activate(eventGroup) {
    this.eventService.startEvent(eventGroup);
    this.navCtrl.navigateBack("/tabs/home")
  }

  getEventGroups(){
    firebase.firestore().collection("eventgroups").onSnapshot((snapshot)=>{
      let eventGroups = [];
      snapshot.forEach(async(eventGroup)=>{
        let events:any = await eventGroup.ref.collection("/events").get();
        let eventCount = events.docs.length;
        let event = eventGroup.data();
        event.eventCount = eventCount;
        eventGroups.push(event)
      })
      this.eventGroups = eventGroups;
    })
  }
}
