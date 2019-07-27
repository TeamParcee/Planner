import { Injectable } from '@angular/core';
import { ModalController, AlertController, PopoverController } from '@ionic/angular';
import { AlertInput, PopoverOptions } from '@ionic/core';

@Injectable({
  providedIn: 'root'
})
export class ComponentService {

  constructor(
    private modalCtrl: ModalController,
    private alertCtrl: AlertController,
    private popoverCtrl: PopoverController,
  ) { }



  showModal(component, componentProps) {
    this.modalCtrl.create({
      component: component,
      componentProps: componentProps
    }).then((modal) => {
      modal.present();
    })
  }

  closeModal() {
    this.modalCtrl.dismiss()
  }

  showOkAlert(header: string, message: string) {
    this.alertCtrl.create({
      header: header,
      message: message,
      buttons: ["OK"]
    }).then((alert) => {
      alert.present();
    })
  }

  confirmationAlert(header: string, message: string, buttons: { denyText: string, confirmText: string }) {

    return new Promise((resolve) => {
      this.alertCtrl.create({
        header: header,
        message: message,
        buttons: [
          {
            text: buttons.denyText,
            handler: () => {
              return resolve(false)
            }
          }, {
            text: buttons.confirmText,
            handler: () => {
              return resolve(true)
            }
          }
        ]
      }).then((alert) => {
        alert.present();
      })
    })

  }

  generateid() {
    return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
  }

  async inputAlert(header: string, message: string, inputs: AlertInput[]) {
    return new Promise(async (resolve) => {
      let alert = await this.alertCtrl.create({
        header: header,
        message: message,
        inputs: inputs,
        buttons: [
          {
            text: "Cancel",
            role: 'cancel'
          }, {
            text: "Save",
            handler: (result) => {
              alert.dismiss(result.name)
              return resolve(result.name)
            }
          }
        ]
      })
      alert.present()
    })


  }



}
