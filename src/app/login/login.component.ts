import { Component, OnInit } from '@angular/core';
import { ComponentService } from '../component.service';
import * as firebase from 'firebase';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {

  constructor(
    private helper: ComponentService
  ) { }

  ngOnInit() {}


  close(){
    this.helper.closeModal();
    
  }
  email;
  password;

  login(){
    firebase.auth().signInWithEmailAndPassword(this.email ,this.password).then(()=>{
      this.close()
    }).catch((e)=>{
      this.helper.showOkAlert("Problem Signing In", e.message)
    })

  }
}
