import { Component, OnInit } from '@angular/core';
import { ComponentService } from 'src/app/component.service';
import { FirebaseService } from 'src/app/firebase.service';

@Component({
  selector: 'app-new-schedule-item',
  templateUrl: './new-schedule-item.component.html',
  styleUrls: ['./new-schedule-item.component.scss'],
})
export class NewScheduleItemComponent implements OnInit {

  constructor(
    private helper: ComponentService,
    private firebaseService: FirebaseService,
  ) { }

  itemType;
  datetime;
  notes;
  location;
  ngOnInit() {}


  close(){
    this.helper.closeModal();
  }

  save(){
    let event = {
      itemType: this.itemType,
      datetime: this.datetime,
      location: this.location,
      notes: this.notes,
    }
    this.firebaseService.addDocument("schedule", event);
    this.helper.showOkAlert("New Item Added", "Your item has been added");
    this.close();
  }
}
