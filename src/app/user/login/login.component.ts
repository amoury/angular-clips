import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  credentials = {
    email: "",
    password: ""
  }

  showAlert = false
  alertMsg = 'please wait'
  alertColor = 'blue'
  inSubmission = false

  constructor(private auth: AngularFireAuth) { }

  ngOnInit(): void {
  }

  async login() {
    this.showAlert = true;
    this.alertMsg = 'please wait';
    this.alertColor = 'blue';
    this.inSubmission = true;

    try {
      await this.auth.signInWithEmailAndPassword(
        this.credentials.email, this.credentials.password
      )
    } catch (error) {
      this.inSubmission = false;
      this.alertMsg = 'unexpected error occured',
        this.alertColor = 'red';
      return
    }

    this.alertMsg = 'success'
    this.alertColor = 'green'
  }

}
