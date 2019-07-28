import { Component, OnInit } from '@angular/core';
import { ComponentService } from '../component.service';

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
    console.log("fasdfasdf");
    this.helper.closeModal();
    
  }
}
