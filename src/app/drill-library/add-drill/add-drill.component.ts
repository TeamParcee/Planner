import { Component, OnInit } from '@angular/core';
import { ComponentService } from 'src/app/component.service';
import { FirebaseService } from 'src/app/firebase.service';

@Component({
  selector: 'app-add-drill',
  templateUrl: './add-drill.component.html',
  styleUrls: ['./add-drill.component.scss'],
})
export class AddDrillComponent implements OnInit {

  constructor(
    private helper: ComponentService,
    private firebaseService: FirebaseService,
  ) { }

  ngOnInit(
    
  ) {}

  position;
  drill;
  video;

  
  save(){
    let drill = {
      Position: this.position,
      Drill: this.drill,
      Video: this.video,
    }
    this.firebaseService.addDocument("drills", drill).then(()=>{
      this.close()
    })
  }

  close(){
    this.helper.closeModal();
  }
}
