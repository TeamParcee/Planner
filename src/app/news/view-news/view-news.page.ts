import { Component, OnInit } from '@angular/core';
import { HelperService } from 'src/app/helper.service';
import { FirebaseService } from 'src/app/firebase.service';
import { UserService } from 'src/app/user.service';
import { AuthService } from 'src/app/auth/auth.service';

@Component({
  selector: 'app-view-news',
  templateUrl: './view-news.page.html',
  styleUrls: ['./view-news.page.scss'],
})
export class ViewNewsPage implements OnInit {

  constructor(
    private helper: HelperService,
    private firebaseService: FirebaseService,
    private userService: UserService,
    private authService: AuthService,
  ) { }

  item;
  user;
  edit = false;
  ngOnInit() {
  }

  ionViewWillEnter() {
    this.getUser()
  }

  async getUser() {
    this.user = await this.userService.getUserDataFromUid(this.authService.user.uid);
  }
  close() {
    this.helper.closeModal();
  }

  delete() {
    this.helper.confirmationAlert("Delete Event", "Are you sure you want to delete this event?", { denyText: "Cancel", confirmText: "Delete Event" })
      .then((result) => {
        this.firebaseService.deleteDocument("/users/" + this.user.uid + "/news/" + this.item.id).then(()=>{
          this.close()
        })
      })

  }

  saveItem() {

    this.firebaseService.updateDocument("/users/" + this.user.uid + "/news/" + this.item.id, {
      title: this.item.title,
      message: this.item.message
    }).then(() => {
      this.close()
    })
  }
}
