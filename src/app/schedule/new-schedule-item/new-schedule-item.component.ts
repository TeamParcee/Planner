import { Component, OnInit } from '@angular/core';
import { ComponentService } from 'src/app/component.service';
import { FirebaseService } from 'src/app/firebase.service';
import { UserService } from 'src/app/user.service';
import { AuthService } from 'src/app/auth/auth.service';

@Component({
  selector: 'app-new-schedule-item',
  templateUrl: './new-schedule-item.component.html',
  styleUrls: ['./new-schedule-item.component.scss'],
})
export class NewScheduleItemComponent implements OnInit {

  constructor(
    private helper: ComponentService,
    private firebaseService: FirebaseService,
    private userService: UserService,
    private authService: AuthService,
  ) { }

  itemType;
  datetime;
  notes;
  location;
  user;

  async getUser() {
    this.user = await this.userService.getUserDataFromUid(this.authService.user.uid)
  }
  ngOnInit() { }

  async ionViewWillEnter(){
    await this.getUser();
  }
  close() {
    this.helper.closeModal();
  }

  save() {
    let event = {
      itemType: this.itemType,
      datetime: this.datetime,
      location: this.location,
      notes: this.notes,
    }
    this.firebaseService.addDocument("users/" + this.user.uid + "/schedule", event);
    this.helper.showOkAlert("New Item Added", "Your item has been added");
    this.close();
  }
}
