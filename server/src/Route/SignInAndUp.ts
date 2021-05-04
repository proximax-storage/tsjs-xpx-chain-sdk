import express from 'express';
import { userInfo } from 'node:os';
import {auth, googleProvider,signInWithGoogle, twitterProvider} from '../Util/FirebaseUtils';

const router = express.Router();

router.post('/sign-in', (req, res, next) => {
  let {email,password} = req.body;
  auth.signInWithEmailAndPassword(email,password)
      
  auth.signInWithPopup(googleProvider)
  auth.signInWithPopup(twitterProvider)
});

router.post('/sign-up', (req, res, next) => {
  let {name, email, password, dateOfBirth} = req.body;
  auth.createUserWithEmailAndPassword(email,password)
  
  if (name =="" || email == "" || password == "" || dateOfBirth == ""){
    res.json({
      status: "FAILED",
      message: "Empty input fields!"
    });
  }
  else if (!/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(email)){
    res.json({
      status: "FAILED",
      message: "Invalid email!"
    })
  }
  else if (!new Date(dateOfBirth).getTime()){
    res.json({
      status: "FAILED",
      message: "Invalid date of birth !"
    })
  }
  // TODO - Handle Sign up
  // TODO - Add the Create Xpx Acc at the end
  // TODO - Store to firebase
});



export default router;