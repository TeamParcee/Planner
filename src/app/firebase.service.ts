import { Injectable } from '@angular/core';
import * as firebase from 'firebase';


@Injectable({
  providedIn: 'root'
})
export class FirebaseService {

  constructor() { }




  addDocument(col, obj) {

    return new Promise((resolve) => {
      let id = firebase.firestore().collection(col).doc().id;
      let o = { ...obj }
      o.id = id;
      firebase.firestore().doc(col + "/" + id).set(o).then(() => {
        resolve()
      })
    })
  }

  setDocument(doc, obj) {

    return new Promise((resolve) => {
      firebase.firestore().doc(doc).set(obj).then(() => {
        resolve()
      })
    })
  }

  updateDocument(doc, obj) {

    return new Promise((resolve) => {
      firebase.firestore().doc(doc).update(obj).then(() => {
        resolve()
      })
    })
  }


  deleteDocument(doc) {
    return new Promise((resolve) => {
      firebase.firestore().doc(doc).delete().then(() => {
        resolve()
      })
    })
  }

  getDocument(doc) {
    return new Promise((resolve) => {
      return firebase.firestore().doc(doc).get().then((snapshot) => {
        return resolve(snapshot.data())
      })
    })
  }
}
