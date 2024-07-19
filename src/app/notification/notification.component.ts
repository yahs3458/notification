import { Component, OnInit } from '@angular/core';
import { AuthServiceService } from '../authentication/auth.service.service';
import { FmsService } from '../fms.service';
import { ServiceService } from '../service.service';
import { HttpStatusCode } from '@angular/common/http';
import { IonLoaderService } from '../ion-loader.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-notification',
  templateUrl: './notification.component.html',
  styleUrls: ['./notification.component.scss'],
})
export class NotificationComponent  {
  notification_list: any[] = [];
  user_info: any[] = [];

  constructor(
    private auth: AuthServiceService,
    private fms: FmsService,
    private service: ServiceService,
    private router:Router,
    private IonLoaderService: IonLoaderService
  ) {}

  ionViewDidEnter() {
    this.getNotificationlist();
  }

  getNotificationlist() {
    let limit = 20;
    this.service.getDetailsById(limit).subscribe({
      next: (res) => {
        console.log(res)
        this.notification_list = [res];
        this.user_info = res.notification_logs;
      },
      error: (err) => {
        if (err.status == '401') {
          alert('Your Token has been expired. Kindly Login again to continue...');
          this.auth.doLogout();
        }
        console.error(err);
      },
    });
  }

  async acceptItem(from_user: string,tagto:any) {
    let Status = 'Accept';
    this.service.putstatus(from_user, Status,tagto).subscribe({
      next: async (res) => {
        if (res.statusCode == HttpStatusCode.Ok) {
          this.IonLoaderService.presentSuccessToast(res.message);
        } else {
          this.IonLoaderService.presentFailToast(res.message);
        }
        this.getNotificationlist() 
        this.IonLoaderService.dismissLoader();
      },
      error: async (err) => {
        if (err.status == '401') {
          alert('Your Token has expired. Kindly login again to continue...');
          this.auth.doLogout();
        }
        this.IonLoaderService.dismissLoader();
      },
    });
  }

  async rejectItem(from_user: string,tagto:any) {
    let Status = 'Reject';
    this.service.putstatus(from_user, Status ,tagto).subscribe({
      next: async (res) => {
        if (res.statusCode == HttpStatusCode.Ok) {
          this.IonLoaderService.presentSuccessToast(res.message);
        } else {
          this.IonLoaderService.presentFailToast(res.message);
        }
        this.getNotificationlist() 
        this.IonLoaderService.dismissLoader();
      },
      error: async (err) => {
        if (err.status == '401') {
          alert('Your Token has expired. Kindly login again to continue...');
          this.auth.doLogout();
        }
        this.IonLoaderService.dismissLoader();
      },
    });
  }

navigate(){
  this.router.navigate(['/dashboard']);
}
  logout() {
    this.auth.doLogout();
  }
}
