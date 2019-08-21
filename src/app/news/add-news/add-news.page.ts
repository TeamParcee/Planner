import { Component, OnInit } from '@angular/core';
import { HelperService } from 'src/app/helper.service';
import { FirebaseError, User } from 'firebase';
import { FirebaseService } from 'src/app/firebase.service';
import { UserService } from 'src/app/user.service';
import { AuthService } from 'src/app/auth/auth.service';
import * as moment from 'moment';

@Component({
  selector: 'app-add-news',
  templateUrl: './add-news.page.html',
  styleUrls: ['./add-news.page.scss'],
})
export class AddNewsPage implements OnInit {

  constructor(
    private helper:HelperService,
    private firebaseService: FirebaseService,
    private userService: UserService,
    private authService: AuthService,
  ) { }

  ngOnInit() {
  }

  title;
  message;
  user;

  ionViewWillEnter(){
    this.getUser();
  }
  async getUser(){
    this.user = await this.userService.getUserDataFromUid(this.authService.user.uid);
  }
  addNews(){
    this.helper.confirmationAlert("Create News Item", "Are you sure you want to create this news item?", {denyText: "Cancel", confirmText: "Create News"})
    .then(async(result)=>{
      if(result){
        this.firebaseService.addDocument("users/" + this.user.uid + "/news", {
          title: this.title,
          message: this.message,
          created: moment().calendar(),
        }).then(()=>{
          this.close()
        })
      }
    })
  }

  close(){
    this.helper.closeModal();
  }
}
