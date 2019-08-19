import { Component, OnInit } from '@angular/core';
import * as firebase from 'firebase';
import { FirebaseService } from 'src/app/firebase.service';
import { ComponentService } from 'src/app/component.service';
import { ActivitiesService } from 'src/app/activities.service';
import { PopoverController } from '@ionic/angular';
import { UserService } from 'src/app/user.service';
import { AuthService } from 'src/app/auth/auth.service';

@Component({
  selector: 'app-weeks',
  templateUrl: './weeks.component.html',
  styleUrls: ['./weeks.component.scss'],
})
export class WeeksComponent implements OnInit {

  constructor(
    private helper: ComponentService,
    private firebaseService: FirebaseService,
    private activityService: ActivitiesService,
    private popoverCtrl: PopoverController,
    private userService: UserService,
    private authService: AuthService,

  ) { }

  async ngOnInit() {
    await this.getUser();
    this.getWeeks();
    
  }


  weeks;
  count;
  user;
  
  async getUser(){
    this.user = await this.userService.getUserDataFromUid(this.authService.user.uid);
  }

  getWeeks() {
    firebase.firestore().collection("users/" + this.user.coach + "/weeks").orderBy("week").onSnapshot((snapshot) => {
      let weeks = [];
      snapshot.forEach((week) => {
        weeks.push(week.data())
      })
      this.weeks = [...weeks];
      this.count = (this.weeks.length) ? this.weeks.length : 0;
      console.log(this.weeks)
    })
  }

  newWeek() {
    this.firebaseService.addDocument("users/" + this.user.coach + "/weeks", { week: (this.count + 1) })
  }

  deleteWeek() {
    this.helper.confirmationAlert("Delete Week", "Are you sure you want to delete the last week? All Practice Days will also be deleted.", { denyText: "Cancel", confirmText: "Delete Week" })
      .then((result) => {
        if (result) {
          this.firebaseService.deleteDocument("users/" + this.user.coach + "/weeks/" + this.weeks[(this.count - 1)].id)
        }
      })
  }

  activeWeek(week){
    this.activityService.activeWeek = week;
    this.popoverCtrl.dismiss();
    }
}
