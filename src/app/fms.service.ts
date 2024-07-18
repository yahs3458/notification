import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Capacitor } from '@capacitor/core';
import {
  PushNotificationSchema,
  PushNotifications,
  Token,
  ActionPerformed
} from '@capacitor/push-notifications';
import { AlertController } from '@ionic/angular';
import { Observable } from 'rxjs';
import { ServiceService } from './service.service';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class FmsService {

  APIPostUrl = 'Firebase/RegisterFcmToken';
  APIBaseUrl: string;
  APIGetUrl = 'NotificationLog/get_notificationLogs'

  constructor(
    private http: HttpClient,
    private route: Router,
    private alertController: AlertController,
    private service: ServiceService
  ) {
    this.APIBaseUrl = environment.API_BASE_URL;
  }

  initPush(sid: any) {
    if (Capacitor.getPlatform() !== 'web') {
      this.registerPush(sid);
    }
  }

  registerPush(sid: any) {
    PushNotifications.requestPermissions().then(result => {
      if (result.receive === 'granted') {
        PushNotifications.register();
      } else {
        console.error('Push notifications permission denied');
      }
    });

    PushNotifications.addListener('registration', async (token: Token) => {
      const obj = {
        user_id: sid,
        token: token.value,
        device: Capacitor.getPlatform()
      };
      console.log(obj);
      this.sendTokenToServer(obj);
    });

    PushNotifications.addListener('registrationError', (error: any) => {
      alert('Error on registration: ' + JSON.stringify(error));
    });

    PushNotifications.addListener(
      'pushNotificationReceived',
      (notification: PushNotificationSchema) => {
        this.presentAlert(notification);
      }
    );

    PushNotifications.addListener('pushNotificationActionPerformed', (notification: ActionPerformed) => {
      const actionId = notification.actionId;
      const data = notification.notification.data;
      console.log(`Action ${actionId} was pressed`);
      let limit = 20

      if (actionId === 'accept' || actionId === 'reject') {
        this.getDetailsById(limit).subscribe({
          next: (res) => {
            const id = res.id;
            // this.updateStatus(id, actionId);
          },
          error: (err) => {
            console.error('Error fetching details by ID:', err);
          }
        });
      }
    });
  }

  async presentAlert(notification: any) {
    const alert = await this.alertController.create({
      header: notification.title,
      message: notification.body,
      buttons: [
        {
          text: 'OK',
          role: 'cancel',
          handler: () => {
           
          }
        },
      ]
    });

    await alert.present();
  }

  // handleNotificationAction(notification: any, action: string) {
  //   if (action === 'accept' || action === 'reject') {
  //     let limit = 20

  //     this.getDetailsById(limit).subscribe({
  //       next: (res) => {
  //         const id = res.id;
  //         this.updateStatus(id, action);
  //       },
  //       error: (err) => {
  //         console.error('Error fetching details by ID:', err);
  //       }
  //     });
  //   }
  // }

  // updateStatus(id: string, status: string) {
  //   this.service.putstatus(id, status).subscribe({
  //     next: (res) => {
  //       if (status === 'accept') {
  //         PushNotifications.removeAllListeners();
  //       } else {
  //         PushNotifications.removeAllListeners();
  //         console.log('Logout request rejected');
  //       }
  //     },
  //     error: (err) => {
  //       console.error('Error updating status:', err);
  //     }
  //   });
  // }

  sendTokenToServer(FcmToken: any) {
    console.log("Sending token to server...");
    this.posthospitalDetails(FcmToken).subscribe({
      next: (res) => {
        console.log("Token sent successfully", res);
      },
      error: (err) => {
        console.error("Error sending token", err);
        if (err && err.message) {
          console.error("Error message:", err.message);
        }
      }
    });
  }

  posthospitalDetails(data: any): Observable<any> {
    return this.http.post(this.APIBaseUrl + this.APIPostUrl, data);
  }

  getDetailsById(limit: any): Observable<any> {
    return this.http.get(this.APIBaseUrl + this.APIGetUrl + '/'+ limit);
  }
}
