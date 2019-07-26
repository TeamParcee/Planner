import { Component, OnInit } from '@angular/core';
import { ComponentService } from '../component.service';
import { ActivitiesService } from '../activities.service';
import { ActivatedRoute } from '@angular/router';
import { NavController } from '@ionic/angular';
import { FirebaseService } from '../firebase.service';

@Component({
  selector: 'app-edit-activity',
  templateUrl: './edit-activity.page.html',
  styleUrls: ['./edit-activity.page.scss'],
})
export class EditActivityPage implements OnInit {

  constructor(
    private helper: ComponentService,
    private activityService: ActivitiesService,
    private route: ActivatedRoute,
    private navCtrl: NavController,
    private firebaseService: FirebaseService,
  ) { }

  ngOnInit() {
    this.route.paramMap.subscribe((paramMap) => {
      this.id = paramMap.get('id');
      this.getActivity();
    })

  }

  id;
  activity;

  ionViewWillLeave() {
    this.saveItem(this.activity);
  }
  async getActivity() {
    this.activity = await this.activityService.getActivity(this.id);
  }

  saveItem(activity) {
    this.activityService.updateActivity(activity);
  }

  delete() {
    this.helper.confirmationAlert("Delete Activity", "Are you sure you want to delete this Activity?", { denyText: "Cancel", confirmText: "Delete Activity" })
      .then((result) => {
        if (result) {

          this.activityService.deleteActivity(this.activity).then(() => {
            this.navCtrl.navigateRoot("/tabs/practice-plan")
          })

        }
      })
  }
}


