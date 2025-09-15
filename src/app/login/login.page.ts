import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: false,
})
export class LoginPage implements OnInit {

  email: string = '';
  password: string = '';
  constructor() { }

  ngOnInit() {
  }

  login() {
    if (this.email === 'admin' && this.password === 'admin') {
      window.location.href = 'main';
    } else {
      alert('Email atau password salah. Silakan coba lagi.');
    }
  }

}
