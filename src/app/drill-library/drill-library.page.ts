import { Component, OnInit } from '@angular/core';
import { DrillsService } from '../drills.service';
import { typeWithParameters } from '@angular/compiler/src/render3/util';
import { ComponentService } from '../component.service';
import { ViewDrillComponent } from '../view-drill/view-drill.component';
import { AddDrillComponent } from './add-drill/add-drill.component';
import * as firebase from 'firebase';

@Component({
  selector: 'app-drill-library',
  templateUrl: './drill-library.page.html',
  styleUrls: ['./drill-library.page.scss'],
})
export class DrillLibraryPage implements OnInit {

  constructor(
    private drillService: DrillsService,
    private helper: ComponentService
  ) { }


  drills:any[]  = this.drillService.drillData;
  searchFilter:any[] = [...this.drills];
  ngOnInit() {
  }

  ionViewWillEnter(){
    this.getDrills();
    console.log("drills")

  }

  search(event){
    
    this.searchFilter = [...this.drills];

    let value = event.target.value;
    if(!value){
      this.searchFilter = [...this.drills];
    }
    this.searchFilter = this.searchFilter.filter(v => v.Position.toLowerCase().includes(value.toLowerCase()))
  }


  viewDrill(drill){
    this.helper.showModal(ViewDrillComponent, {drill: drill})
  }

  addDrill(){
    this.helper.showModal(AddDrillComponent, null)
  }

  getDrills(){
    firebase.firestore().collection("drills").onSnapshot((snapshot)=>{
      snapshot.forEach((drill)=>{
        this.drills.push(drill.data())
      })
    })
  }

  
}
