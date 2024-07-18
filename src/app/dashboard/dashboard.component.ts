import { Component, OnInit } from '@angular/core';
import { AuthServiceService } from '../authentication/auth.service.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent  implements OnInit {

  constructor( private auth: AuthServiceService,) { }

  ngOnInit() {}


  logout() {
    this.auth.doLogout();
  }
}
