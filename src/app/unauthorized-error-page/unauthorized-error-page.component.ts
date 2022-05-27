import { Component, OnInit } from '@angular/core';
import {LoginFormComponent} from "../login-form/login-form.component";

@Component({
  selector: 'app-unauthorized-error-page',
  templateUrl: './unauthorized-error-page.component.html',
  styleUrls: ['./unauthorized-error-page.component.css'],
  providers: [LoginFormComponent]
})
export class UnauthorizedErrorPageComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

}
