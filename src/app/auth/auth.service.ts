import { Injectable } from '@angular/core';
import * as firebase from 'firebase';
import { HelperService } from '../helper.service';
import { reject } from 'q';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(
    private helper: HelperService,
  ) {
    firebase.auth().onAuthStateChanged((user)=>{
      this.user = user;
    })
  }



  ;
  user;


  loginEmail(email, password) {
    return new Promise((resolve, reject) => {
      return firebase.auth().signInWithEmailAndPassword(email, password).then((result) => {
        return resolve(result.user)
      }).catch((e)=>{
        return reject(e)
      })
    })
  }

  createAccountEmail(email, password, displayName, photoURL) {
    return new Promise((resolve) => {
      return firebase.auth().createUserWithEmailAndPassword(email, password).then((result) => {
        result.user.updateProfile({
          displayName: displayName,
          photoURL: photoURL,
        })
        return resolve(result.user);
      }).catch((e) => {
        console.log(e)
      })
    })
  }
  getUserData(uid) {
    return new Promise((resolve) => {
      return firebase.firestore().doc("users/" + uid).get().then((snap) => {
        return snap.data()
      }).catch((e) => {
        console.log(e)
      })
    })
  }

  logout() {
    return new Promise((resolve) => {
      return firebase.auth().signOut().then(() => {
        return resolve()
      })
    }).catch((e) => {
      console.log(e)
    })
  }

  deleteDocument(doc) {
    return new Promise((resolve) => {
      firebase.firestore().doc(doc).delete().then(() => {
        resolve()
      })
    }).catch((e) => {
      console.log(e)
    })
  }

  deleteAccount(uid) {
    return new Promise((resolve) => {
      return this.deleteDocument("users/" + uid).then(() => {
        return firebase.auth().currentUser.delete().then(() => {
          return resolve()
        })
      })
    }).catch((e) => {
      console.log(e)
    })
  }
}
