import { Component, OnInit } from '@angular/core';
import { ActivitiesService } from '../activities.service';
import { Activity } from '../activity';
import { ComponentService } from '../component.service';

@Component({
  selector: 'app-practice-plan',
  templateUrl: './practice-plan.page.html',
  styleUrls: ['./practice-plan.page.scss'],
})
export class PracticePlanPage implements OnInit {

  constructor(
    private activityService: ActivitiesService,
    private helper: ComponentService,
  ) { }

  ngOnInit() {
    this.getActivities();
  }

  currentWeek;
  currentDay;
  activities;
  item;

  newActivity(){
    console.log("new Activity");
    let activity = new Activity(this.helper.generateid(), "", "", "", this.currentDay, this.currentWeek);
    this.activityService.createActivity(activity);
  }

  async getActivities(){
    this.activities = await this.activityService.getActivities();
    console.log(this.activities);
  }

  saveItem(activity, item){
    console.log("saving item", activity, item);
    this.activityService.updateActivity(activity);
    this.item = item;
  }

  editItem(item){
    console.log(item, this.item);
    this.item = item
  }
}
