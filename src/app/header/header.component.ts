import {Component, OnInit} from '@angular/core';
import {LoginFormComponent} from "../login-form/login-form.component";

@Component({
  selector: 'header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
  providers: [LoginFormComponent]
})
export class HeaderComponent implements OnInit {

  constructor() {
  }

  ngOnInit(): void {
  }

}
