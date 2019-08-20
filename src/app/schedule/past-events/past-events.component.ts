import { Component, OnInit } from '@angular/core';
import * as firebase from 'firebase';
import { ComponentService } from 'src/app/component.service';
import { AuthService } from 'src/app/auth/auth.service';
import { UserService } from 'src/app/user.service';

@Component({
  selector: 'app-past-events',
  templateUrl: './past-events.component.html',
  styleUrls: ['./past-events.component.scss'],
})
export class PastEventsComponent implements OnInit {

  constructor(
    private helper: ComponentService,
    private userService: UserService,
    private authService: AuthService
  ) { }

  schedule;
  user;

  ngOnInit() {}

  async ionViewWillEnter(){
    await this.getUser();
    this.getSchedule();
  }
  
  async getUser(){
    this.user = await this.userService.getUserDataFromUid(this.authService.user.uid)
  }
  getSchedule() {
    firebase.firestore().collection("users/" + this.user.coach + "/schedule")
    .orderBy("datetime", "desc")
    .onSnapshot((snapshot) => {
      let schedule = [];
      snapshot.forEach((event) => {
        let date = new Date(event.data().datetime);
        let today = new Date();
        if (date < today) {
          schedule.push(event.data());
        }

      })
      this.schedule = schedule
    })
  }

  close(){
    this.helper.closeModal()
  }
}
