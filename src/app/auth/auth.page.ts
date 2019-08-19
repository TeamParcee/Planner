import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AuthService } from './auth.service';
import { NavController } from '@ionic/angular';
import { HelperService } from '../helper.service';
import { UserService } from '../user.service';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.page.html',
  styleUrls: ['./auth.page.scss'],
})
export class AuthPage implements OnInit {

  constructor(
    private userService: UserService,
    private navCtrl: NavController,
    private authService: AuthService,
    private helper: HelperService,
    private fb: FormBuilder) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.email]],
      password: ['', Validators.minLength(6)]
    })
    this.registerForm = this.fb.group({
      username: ['', Validators.minLength(2)],
      fname: ['', Validators.minLength(2)],
      lname: ['', Validators.minLength(2)],
      isCoach: ['',],
      email: ['', [Validators.email]],
      password: ['', Validators.minLength(6)]
    })
  }

  ngOnInit() {
  }

  loginForm: FormGroup;
  registerForm: FormGroup;

  login() {
    this.authService.loginEmail(this.loginForm.value.email, this.loginForm.value.password).catch((e) => {
      this.helper.okAlert("Problem Occured", e.message)
    }).then(() => {
      this.navCtrl.navigateForward("/tabs/home");
    })
  }

  register() {
    let form = this.registerForm.value;
    this.authService.createAccountEmail(form.email, form.password, form.username, "").then((user: firebase.User) => {
      form.password = "*******";
      if (form.isCoach) {
        form.coach = user.uid
      } else {
        form.coach = null
      }
      form.uid = user.uid;
      this.userService.createNewUserData(user.uid, form);
      this.navCtrl.navigateForward("/tabs/home");
    })
  }
}
