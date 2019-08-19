import { Component, OnInit } from '@angular/core';
import { UserService } from '../user.service';
import { FirebaseError } from 'firebase';
import { FirebaseService } from '../firebase.service';
import { AuthService } from '../auth/auth.service';
import { NavController } from '@ionic/angular';
import { HelperService } from '../helper.service';
import * as firebase from 'firebase';

@Component({
  selector: 'app-select-coach',
  templateUrl: './select-coach.page.html',
  styleUrls: ['./select-coach.page.scss'],
})
export class SelectCoachPage implements OnInit {

  constructor(
    private userService: UserService,
    private firebaseService: FirebaseService,
    private authService: AuthService,
    private navCtrl: NavController,
    private helper: HelperService,
  ) { }

  ngOnInit() {
  }

  coaches;

  ionViewWillEnter(){
    this.getCoaches()
  }
  async selectCoach(coach) {

    this.helper.confirmationAlert("Select Coach", "Are you sure you want to select " + coach.fname + " " + coach.lname + " as your coach", { denyText: "Cancel", confirmText: "Select Coach" })
      .then(async (result) => {
        if (result) {
          let user = this.authService.user;

          user = await this.userService.getUserDataFromUid(user.uid);
          if (user) {
            user.coach = coach.uid;
            this.firebaseService.updateDocument("/users/" + user.uid, user).then(() => {
              this.navCtrl.navigateForward("/tabs/home")
            })
          }

        }
      })
  }

  getCoaches(){
    firebase.firestore().collection("/users/")
    .where("isCoach", "==", true)
    .onSnapshot((userSnap)=>{
      let users = [];
      userSnap.forEach((user)=>{
        users.push(user.data())
      })
      this.coaches = users;
    })
  }
}
