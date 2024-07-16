import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Capacitor } from '@capacitor/core';
import {
  ActionPerformed,
  PushNotificationSchema,
  PushNotifications,
  Token,
} from '@capacitor/push-notifications';
import { AlertController } from '@ionic/angular';
import { Observable } from 'rxjs';
import { ServiceService } from './service.service';
@Injectable({
  providedIn: 'root'
})
export class FmsService {

  APIPostUrl = 'Firebase/RegisterFcmToken';
  authService: any;

  constructor(
    private http: HttpClient,
    private route: Router,
    private alertController: AlertController,
    private service : ServiceService
  ) { }

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
      }
      this.sendTokenToServer(obj);
    });

    PushNotifications.addListener('registrationError', (error: any) => {
      alert('Error on registration: ' + JSON.stringify(error));
    });

    PushNotifications.addListener(
      'pushNotificationReceived',
      (notification: PushNotificationSchema) => {
        if (notification.title && notification.title.toLowerCase().includes('logout')) {
          // Fetch the ID
          this.getDetailsById().subscribe({
            next: (res) => {
              const id = res.id;
              this.presentAcceptRejectAlert(id);
            },
            error: (err) => {
              console.error('Error fetching details by ID:', err);
            }
          });
        } else {
          this.presentAlert(notification);
        }
      }
    );
  }

  async presentAcceptRejectAlert(id: string) {
    const alert = await this.alertController.create({
      header: ' Request',
      message: 'Do you want to accept or reject the login request?',
      buttons: [
        {
          text: 'Reject',
          role: 'cancel',
          handler: () => {
            this.updateStatus(id, 'reject');
          }
        },
        {
          text: 'Accept',
          handler: () => {
            this.updateStatus(id, 'accept');
          }
        }
      ]
    });

    await alert.present();
  }

  updateStatus(id: string, status: string) {
    this.service.putstatus(id, status).subscribe({
      next: (res) => {
        if (status === 'accept') {
          PushNotifications.removeAllListeners();
        } else {
          PushNotifications.removeAllListeners();
          console.log('Logout request rejected');
        }
      },
      error: (err) => {
        console.error('Error updating status:', err);
      }
    });
  }

  sendTokenToServer(FcmToken: any) {
    this.posthospitalDetails(FcmToken).subscribe()
  }

  posthospitalDetails(data: any): Observable<any> {
    return this.http.post(this.APIPostUrl, data);
  }

  async presentAlert(notification: any) {
    const alert = await this.alertController.create({
      header: notification.title,
      message: notification.body,
      buttons: ['Accept'],
    });

    await alert.present();
  }

  getDetailsById(): Observable<any> {
    return this.http.get<any>(''); 
}
}
