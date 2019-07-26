import { Component, OnInit } from '@angular/core';
import { ComponentService } from '../component.service';
import { ActivitiesService } from '../activities.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-view-activity',
  templateUrl: './view-activity.page.html',
  styleUrls: ['./view-activity.page.scss'],
})
export class ViewActivityPage implements OnInit {

  constructor(
    private helper: ComponentService,
    private activityService: ActivitiesService,
    private route: ActivatedRoute,
  ) { }

  ngOnInit() {
    this.route.paramMap.subscribe((paramMap)=>{
      this.id = paramMap.get('id');
      this.getActivity();
    })
    
  }

  id;
  activity;

  
  async getActivity(){
    this.activity = await this.activityService.getActivity(this.id);
  }
}
