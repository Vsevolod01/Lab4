import {Component} from '@angular/core';
import {AbstractControl, FormControl, FormGroup, ValidationErrors, Validators} from "@angular/forms";
import {HttpService} from "../http.service";
import {Router} from "@angular/router";

export class User {
  name: string
  password: string

  constructor(login: string, password: string) {
    this.name = login
    this.password = password
  }
}

@Component({
  selector: 'app-login-form',
  templateUrl: './login-form.component.html',
  styleUrls: ['./login-form.component.css'],
  providers: [HttpService]
})
export class LoginFormComponent {
  loginForm: FormGroup;
  alertMsg: string;
  validInput: boolean;

  constructor(private httpService: HttpService, private router: Router) {
    localStorage.removeItem("userToken");
    this.alertMsg = ""
    this.validInput = true;
    this.loginForm = new FormGroup({
      "loginEntry": new FormControl("", [Validators.required, Validators.pattern("[a-zA-Z0-9]+")]),
      "passwordEntry": new FormControl("", [Validators.required, Validators.pattern("[a-zA-Z0-9]+")]),
    })
  }

  submit(param: String) {
    this.dropAlert()

    let loginControl: AbstractControl = this.loginForm.controls['loginEntry']
    let passwordControl: AbstractControl = this.loginForm.controls['passwordEntry']
    this.parseError(loginControl.errors, passwordControl.errors)
    if (!this.validInput)
      return;

    let login: string = loginControl.value
    let password: string = passwordControl.value

    if (param == "login") {
      this.httpService.loginRequest(new User(login, password)).subscribe((data: any) => {
        console.log(data)
        if (data.authenticated) {
          localStorage.setItem("userToken", btoa(login + ':' + password))
          this.router.navigate(["/main"])
        } else
          this.setAlert(data.info)
      })
    }
    else {
      this.httpService.regRequest(new User(login, password)).subscribe((data: any) => {
        if (data.password) {
          localStorage.setItem("userToken", btoa(login + ':' + password))
          this.router.navigate(["/main"])
        }
        else {
          this.setAlert(data.info)
          console.log(data)
        }
      })
    }
  }

  private parseError(loginErr: ValidationErrors | null, passwordErr: ValidationErrors | null) {
    if (loginErr == null && passwordErr == null) {
      return
    }
    if (loginErr != null) {
      if (loginErr['pattern'] != undefined) {
        this.setAlert("There is allowed only word characters")
        return;
      }
      if (loginErr['required'] != undefined) {
        this.setAlert("Entries shouldn't be empty")
        return;
      }
    }
    if (passwordErr != null) {
      if (passwordErr['pattern'] != undefined) {
        this.setAlert("There is allowed only word characters")
        return;
      }
      if (passwordErr['required'] != undefined) {
        this.setAlert("Entries shouldn't be empty")
        return;
      }
    }
  }

  private setAlert(msg: string) {
    this.alertMsg = msg;
    this.validInput = false;
  }

  private dropAlert() {
    this.alertMsg = "";
    this.validInput = true;
  }

}
