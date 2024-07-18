import { Component } from '@angular/core';
import { Platform } from '@ionic/angular';
import { AuthServiceService } from './authentication/auth.service.service';
import { Router } from '@angular/router';
@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  constructor(
    private platform: Platform,
    private authService: AuthServiceService,
    private router: Router,
  ) {
    this.initializeApp();
  }
  async ngOnInit() {
    this.authService.isAuthenticated();
    const isAuthenticated = await this.authService.isAuthenticated();
    if (isAuthenticated) {
      this.router.navigate(['/dashboard']);
    }

  }

  initializeApp() {
    this.platform.ready().then(() => {
    })
  }
}
