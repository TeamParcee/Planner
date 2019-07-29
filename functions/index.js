const functions = require('firebase-functions');
const firebase = require('firebase');
// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//

// exports.helloWorld = functions.https.onRequest((request, response) => {
// let params = request.params;
// console.log(params, request);
//  response.send("Hello from Firebase!");
// });


exports.countDown = functions.firestore.document("utilities/timer").onWrite((change, context)=>{
    setTimeout(()=>{
        let oldTime = change.after.data().time;
        let newTime = oldTime - 1;
        firebase.firestore().doc("utilities/timer").set({time: newTime})
    }, 1000)
})
// exports.startTimer = functions.https.onRequest((request, response) => {
//     response.send("Hello from Firebase!");
//     console.log(request, response)
//    });
