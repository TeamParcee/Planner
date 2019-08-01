import { Component, OnInit } from '@angular/core';
import { FirebaseService } from 'src/app/firebase.service';
import { ComponentService } from 'src/app/component.service';
import * as firebase from 'firebase';
import { AlertInput } from '@ionic/core';
import { PopoverController } from '@ionic/angular';


@Component({
  selector: 'app-view-templates',
  templateUrl: './view-templates.component.html',
  styleUrls: ['./view-templates.component.scss'],
})
export class ViewTemplatesComponent implements OnInit {

  constructor(
    private firebaseService: FirebaseService,
    private helper: ComponentService,
    private popoverCtrl: PopoverController,
  ) { }

  ngOnInit() {
    this.getTemplates()
  }


  activities: any[];
  template;
  day;
  week;
  templateName;
  templates;

  createTemplate(name) {
    this.template = {
      name: name,
      activities: this.activities,
    }
    this.firebaseService.addDocument("templates", this.template)
  }

  createFromTemplate(template) {
    let activites: any[] = template.activities;

    activites.forEach((activity) => {
      activity.day = this.day;
      activity.week = this.week;
      this.firebaseService.addDocument("/activities/", activity);
    })
    this.helper.showOkAlert("Plan Created", "The Practice Plan has been created from the template " + template.templateName)
  }

  saveTemplate() {
    let input: AlertInput[] = [
      {
        name: "name",
        type: "text"
      }
    ]
    this.helper.inputAlert("Template Name", "Please enter a name for this template", input).then((value) => {
      if (value) {
        this.createTemplate(value)
      }
    });
  }


 

  getTemplates() {
    firebase.firestore().collection("templates").onSnapshot((snapshot) => {
      let templates = [];
      snapshot.forEach((template) => {
        templates.push(template.data())
      })
      this.templates = templates
    })
  }

  confirmDelete(template) {
    this.helper.confirmationAlert("Delete Template", "Are you sure you want to delete template " + template.name, { denyText: "Cancel", confirmText: "Delete Template" })
      .then((result) => {
        if (result) {
          this.deleteTemplate(template)
        }
      })
  }
  deleteTemplate(template) {
    this.firebaseService.deleteDocument("templates/" + template.id);
  }

  confirmCreate(template) {
    this.helper.confirmationAlert("Create From Template", "Are you sure you want add the events from this template" + template.name, { denyText: "Cancel", confirmText: "Add Events" })
      .then((result) => {
        if (result) {
          this.addEvents(template)
        }
      })
  }

  addEvents(template) {
    let activites: any[] = template.activities;

    activites.forEach((activity) => {
      let a = activity;
      a.day = this.day;
      a.week = this.week;
      this.firebaseService.addDocument("activities", a)
    })

  }

  confirmDeleteEvent() {
    console.log("delete");
    this.helper.confirmationAlert("Delete All Activities", "Are you sure you want to delete events from all activities", { denyText: "Cancel", confirmText: "Delete Activities" })
      .then((result) => {
        if (result) {
          this.deleteEvents()
        }
      })
  }

  deleteEvents() {
    firebase.firestore().collection("activities")
    .where("day", "==", this.day)
    .where("week", "==", this.week)
    .get().then((activities)=>{
      
      activities.forEach((activity) => {
        activity.ref.delete()
      })

    })
    

  }
}
