import {Injectable} from "@angular/core";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {User} from "./login-form/login-form.component";
import {Observable} from "rxjs";
import {Dot} from "./main-page/main-page.component";

@Injectable()
export class HttpService {
  constructor(private http: HttpClient) {
  }

  regUrl: string = "http://localhost:8080/account/register"
  loginUrl: string = "http://localhost:8080/account/login"
  addDotUrl: string = "http://localhost:8080/dots"
  removeDotsUrl: string = "http://localhost:8080/dots"
  dataUrl: string = "http://localhost:8080/dots"

  // regUrl: string = "http://localhost:8080/lab4-0.0.1-SNAPSHOT/account/register"
  // loginUrl: string = "http://localhost:8080/lab4-0.0.1-SNAPSHOT/account/login"
  // addDotUrl: string = "http://localhost:8080/lab4-0.0.1-SNAPSHOT/dots"
  // removeDotsUrl: string = "http://localhost:8080/lab4-0.0.1-SNAPSHOT/dots"
  // dataUrl: string = "http://localhost:8080/lab4-0.0.1-SNAPSHOT/dots"

  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
    })
  };

  regRequest(user: User): Observable<any> {
    let userJson: string = JSON.stringify(user)
    return this.http.post(this.regUrl, userJson, this.httpOptions)
  }

  loginRequest(user: User): Observable<any> {
    // this.httpOptions.headers.append( "Authorization", 'Basic ' + btoa(user.name + ':' + user.password))
    // console.log(this.httpOptions.headers)
    // this.httpOptions.headers = this.httpOptions.headers.append( "Authorization", 'Basic ' + btoa(user.name + ':' + user.password))
    // console.log(this.httpOptions.headers)
    return this.http.get(this.loginUrl, {headers: this.httpOptions.headers.append( "Authorization", 'Basic ' + btoa(user.name + ':' + user.password))})
  }

  addRequest(dot: Dot, userToken: string): Observable<any> {
    let dotJson: string = JSON.stringify(dot)
    return this.http.post(this.addDotUrl, dotJson, {headers: this.httpOptions.headers.append( "Authorization", 'Basic ' + userToken)})
  }

  clearRequest(userToken: string): Observable<any> {
    return this.http.delete(this.removeDotsUrl, {headers: this.httpOptions.headers.append( "Authorization", 'Basic ' + userToken)});
  }

  dataRequest(userToken: string): Observable<any> {
    return this.http.get(this.dataUrl, {headers: this.httpOptions.headers.append( "Authorization", 'Basic ' + userToken)});
  }
}
