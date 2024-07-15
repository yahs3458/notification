import { Injectable } from '@angular/core';
import { LoadingController, ToastController } from '@ionic/angular';
import { apiUrl } from './authentication/api-url';
import { AuthServiceService } from './authentication/auth.service.service';
@Injectable({
  providedIn: 'root'
})
export class IonLoaderService {

  private loadingOverlay: HTMLIonLoadingElement | null = null;

  constructor(
    public loadingController: LoadingController,
    private toastController: ToastController,
    private authService: AuthServiceService
  ) { }
  simpleLoader() {
    this.loadingController
      .create({
        message: 'Loading...',
      })
      .then((response) => {
        response.present();
      });
  }
  private showContent() {
    const contentElement = document.querySelector('ion-content');
    if (contentElement) {
      contentElement.style.visibility = 'visible';
    }
  }
  async showLoader() {
    // Hide the content of the page
    const contentElement = document.querySelector('ion-content');
    if (contentElement) {
      contentElement.innerHTML = '';
      contentElement.style.display = 'none';
    }

    this.loadingOverlay = await this.loadingController.create({
      message: 'Loading...',
      cssClass: 'loader-blur-overlay',
    });

    await this.loadingOverlay.present();
  }

  async hideLoader() {
    if (this.loadingOverlay) {
      await this.loadingOverlay.dismiss();
      this.loadingOverlay = null;
      this.showContent();
    }
  }
  dismissLoader() {
    this.loadingController
      .dismiss()
      .then((response) => {
      
      })
      .catch((err) => {
       
      });
  }
  autoLoader() {
    this.loadingController
      .create({
        message: 'Loading',
        spinner: 'circles',
      })
      .then((response) => {
        response.present();
        response.onDidDismiss().then((response) => {
      
        });
      });
  }
  customLoader() {
    this.loadingController
      .create({
        message: 'Loader with custom style',
        duration: 4000,
        cssClass: 'loader-css-class loader-blur-overlay',
        backdropDismiss: true,
        spinner: 'circles',
      })
      .then((res) => {
        res.present();
      });
  }
  async presentSuccessToast(message: string) {
    const toast = await this.toastController.create({
      message: message,
      duration: 800,
      position: 'bottom',
      color: 'success',
    });
    toast.present();
  }
  async presentFailToast(message: string) {
    const toast = await this.toastController.create({

      message: message,
      duration:3000,
      position: 'bottom',
      color: 'danger',
      cssClass:"mb-10"
    });
    toast.present();
  }
  async presentLogToast(data: any) {
    const toast = await this.toastController.create({
      message: data.message,
      position: 'bottom',
      color: 'warning',
      buttons: [
        {
          text: 'Logout',
          role: 'cancel',
          handler: () => {
            this.authService.forceLogout(data.pkId).subscribe(() => {
              toast.dismiss(); // Dismiss the toast after logging out
            });
          }
        }
      ]
    });
    
    // Present the toast
    toast.present();
  
    // Schedule dismissal after 10 seconds
    setTimeout(() => {
      toast.dismiss();
    }, 10000);
  }
  
}

