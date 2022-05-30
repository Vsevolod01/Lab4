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
      "passwordEntry": new FormControl("", [Validators.required, Validators.pattern("[a-zA-Z0-9]+"), Validators.minLength(6)]),
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
      this.httpService.loginRequest(new User(login, password)).subscribe({
        next: (data: any) => {
          console.log(data)
          localStorage.setItem("userToken", btoa(login + ':' + password))
          localStorage.setItem("user", login);
          this.router.navigate(["/main"])
        },
        error: err => {
          console.log(err)
          this.setAlert("You're not authorized. Perhaps you entered wrong password or this user doesn't exist")
        }
      })
    } else {
      this.httpService.regRequest(new User(login, password)).subscribe({
        next: (data: any) => {
          console.log(data)
          localStorage.setItem("userToken", btoa(login + ':' + password))
          localStorage.setItem("user", login);
          this.router.navigate(["/main"])
        },
        error: err => {
          console.log(err)
          this.setAlert(err.error.message)
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
        this.setAlert("There are allowed only word characters")
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
      if (passwordErr['minlength'] != undefined) {
        this.setAlert("Password length should be longer or equal to 6 characters")
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
