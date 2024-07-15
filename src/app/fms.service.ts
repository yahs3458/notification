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
@Injectable({
  providedIn: 'root'
})
export class FmsService {

  APIPostUrl = 'Firebase/RegisterFcmToken';

  constructor(
    private http: HttpClient,
    private route: Router,
    private alertController: AlertController
  ) {
    
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
      }
      this.sendTokenToServer(obj);
    });

    PushNotifications.addListener('registrationError', (error: any) => {
      alert('Error on registration: ' + JSON.stringify(error));
    });

    PushNotifications.addListener(
      'pushNotificationReceived',
      (notification: PushNotificationSchema) => {
       
      },
    );

    PushNotifications.addListener(
      'pushNotificationActionPerformed',
      (notification: ActionPerformed) => {
        alert('Push action performed: ' + JSON.stringify(notification));
      },
    );
  }

  sendTokenToServer(FcmToken: any) {
    this.posthospitalDetails(FcmToken).subscribe()
  }
  posthospitalDetails(data: any): Observable<any> {
    return this.http.post( this.APIPostUrl, data);
  }
  async presentAlert(notification: any) {
    const alert = await this.alertController.create({
      header: notification.title,
      message: notification.body,
      buttons: ['ok'],
    });

    await alert.present();
  }

}
