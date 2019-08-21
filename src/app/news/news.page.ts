import { Component, OnInit } from '@angular/core';
import { HelperService } from '../helper.service';
import { AddNewsPage } from './add-news/add-news.page';
import * as firebase from 'firebase';
import { UserService } from '../user.service';
import { AuthService } from '../auth/auth.service';
import { ViewNewsPage } from './view-news/view-news.page';
@Component({
  selector: 'app-news',
  templateUrl: './news.page.html',
  styleUrls: ['./news.page.scss'],
})
export class NewsPage implements OnInit {

  constructor(
    private helper: HelperService,
    private userService: UserService,
    private authService: AuthService,
  ) { }

  user;
  news;
  ngOnInit(

  ) {
  }

  async ionViewWillEnter() {
    await this.getUser();
    this.getNews()
  }
  async getUser() {
    this.user = await this.userService.getUserDataFromUid(this.authService.user.uid)
  }
  showAddNews() {
    this.helper.openModal(AddNewsPage, null)
  }

  getNews() {
    firebase.firestore().collection("/users/" + this.user.uid + "/news")
    .orderBy("date", "desc")
    .onSnapshot((newSnap) => {
      let news = []
      newSnap.forEach((item) => {
        news.push(item.data())
      })
      this.news = news;
    })
  }

  viewNews(item){
    this.helper.openModal(ViewNewsPage, {item: item})
  }
}
