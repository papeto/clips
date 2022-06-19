import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  showAlert=false;
  alertMsg='Login...';
  alertColor='blue';
  inSubmission = false;

  credentials = {
  email: "",
  password: ""
}
  constructor(private auth: AngularFireAuth) { }


  ngOnInit(): void {
  }

  async login(){
    this.showAlert = true
    this.alertMsg = 'Login...'
    this.alertColor = 'blue'
    this.inSubmission = true

    try{
    await this.auth.signInWithEmailAndPassword(
    this.credentials.email,
    this.credentials.password,)

    }catch(e){
      this.inSubmission = false
      this.alertMsg = 'This account doesnt exist or password is incorrect'
      this.alertColor = 'red'
      console.log(e)
      return
    }

    this.alertMsg = 'Loged!'
    this.alertColor = 'green'

  }

}
