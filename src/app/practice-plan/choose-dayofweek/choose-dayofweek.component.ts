import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-choose-dayofweek',
  templateUrl: './choose-dayofweek.component.html',
  styleUrls: ['./choose-dayofweek.component.scss'],
})
export class ChooseDayofweekComponent implements OnInit {

  constructor() { }

  ngOnInit() {}


  dateSelected($event){
    console.log($event)
  }
}
