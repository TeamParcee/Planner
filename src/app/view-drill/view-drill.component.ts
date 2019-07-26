import { Component, OnInit } from '@angular/core';
import { ComponentService } from '../component.service';


@Component({
  selector: 'app-view-drill',
  templateUrl: './view-drill.component.html',
  styleUrls: ['./view-drill.component.scss'],
})
export class ViewDrillComponent implements OnInit {

  constructor(
    private helper: ComponentService
  ) { }

  drill;
  ngOnInit() {}

  close(){
    this.helper.closeModal()
  }

}
