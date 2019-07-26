import { Component, OnInit } from '@angular/core';
import { DrillsService } from '../drills.service';
import { typeWithParameters } from '@angular/compiler/src/render3/util';
import { ComponentService } from '../component.service';
import { ViewDrillComponent } from '../view-drill/view-drill.component';

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


  drills:any[] = this.drillService.drillData;
  searchFilter:any[] = [...this.drills];
  ngOnInit() {
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
}
