import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthServiceService } from '../authentication/auth.service.service';
import { AbstractControl, FormGroup, Validators } from '@angular/forms';
import { FormBuilder } from '@angular/forms';
import { environment } from 'src/environments/environment';
import { Geolocation } from '@capacitor/geolocation';
import { Device } from '@capacitor/device';
import { AlertController } from '@ionic/angular';

import { IonLoaderService } from '../ion-loader.service';
import { FmsService } from '../fms.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent  implements OnInit {

  username: string = '';
  showPassword: boolean = false;
  UserAuthReq: any;
  public loading: boolean = false;
  APIBaseUrl = environment.API_BASE_URL;
  loginForm: FormGroup;
  password: string = '';
  btnLogin: string = 'Login';
  show_hide: boolean = false;
  isToastOpen: boolean = false;
  message: string = "";

  constructor(
    private router: Router,
    private authService: AuthServiceService,
    private formBuilder: FormBuilder,
    private fcmService: FmsService,
    private ionload :IonLoaderService
  ) {
    this.UserAuthReq = {
      UserName: 'acprs.institute@gmail.com',
      Password: '123456',
    };

    this.loginForm = this.formBuilder.group({
      userName: ['', [Validators.required]],
      password: ['', Validators.required],
    });
  }

  public lat: any;
  public lng: any;
  public ip: any;
  public deviceInfo: any;

  ngOnInit() {
    const storedDataString = localStorage.getItem('myData');
    if (storedDataString) {
      const storedData = JSON.parse(storedDataString);
    }
    this.getLocation();
    if (this.authService.isAuthenticated()) {
      this.router.navigate(['/dashboard']);
    }
  }

  get f(): { [key: string]: AbstractControl } {
    return this.loginForm.controls;
  }

  onSubmit() {
    this.isToastOpen = false;
    this.btnLogin = 'Verifying...';
    if (this.loginForm.invalid) {
      this.btnLogin = 'Invalid Credentials';
      return;
    }

    this.loading = true;
    const obj = {
      userName:  this.loginForm.controls['userName'].value,
      password: this.loginForm.controls['password'].value,
    };

    this.authService.login(obj).subscribe(
      async (data) => {
        if (data.isAuthSuccessful) {
          await this.postLoginActions(data.sid);
        } else {
          this.handleLoginError(data.processingStatus);
        }
        this.loading = false;
      },
      (err) => {
        this.loading = false;
        console.log(err);
      }
    );
  }

  async postLoginActions(sid: string) {
    this.getBootInfo();
    this.btnLogin = 'Logged In';
    this.fcmService.registerPush(sid);
  }

  handleLoginError(status:any) {
    if (status.statusCode !== 208) {
      this.btnLogin = 'Login';
      this.isToastOpen = true;
      this.message = status.message;
    } else {
      if (status.docstatus === 1) {
        this.ionload.presentLogToast(status);
        this.btnLogin = 'Login';
      } else {
        this.btnLogin = 'Login';
        this.isToastOpen = true;
        this.message = status;
      }
    }
  }

  getBootInfo() {
    this.authService.getBootInfo().subscribe({
      next: (res) => {
        this.set_Cache(res);
        this.router.navigate(['notify']);
      },
      error: (res) => {
        console.error('Error fetching boot info:', res);
      },
    });
  }

  async getLocation() {
    try {
      const position = await Geolocation.getCurrentPosition();
      const { latitude, longitude } = position.coords;
      this.deviceInfo = await Device.getInfo();
      localStorage.setItem('deviceInfo', JSON.stringify(this.deviceInfo));
      localStorage.setItem('locationAtLogin', JSON.stringify({ latitude, longitude }));
    } catch (error) {
      console.error('Error getting geolocation:', error);
    }
  }

  set_Cache(boot: any) {
    localStorage.setItem('bootInfo', JSON.stringify(boot));
    localStorage.setItem('userName', boot['user'].name);

    this.authService.getuserName();
    this.authService.getUserFname();

  }

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
    this.show_hide = !this.show_hide;
  }
}
