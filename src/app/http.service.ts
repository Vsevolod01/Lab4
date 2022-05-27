import {Injectable} from "@angular/core";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {User} from "./registration-form/registration-form.component";
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

  // httpOptions = {
  //   headers: new HttpHeaders({
  //     'Content-Type': 'application/json',
  //   })
  // };

  regRequest(user: User): Observable<any> {
    let userJson: string = JSON.stringify(user)
    return this.http.post(this.regUrl, userJson)
  }

  loginRequest(user: User): Observable<any> {
    let userJson: string = JSON.stringify(user)
    return this.http.post(this.loginUrl, userJson)
  }

  addRequest(dot: Dot, userToken: string): Observable<any> {
    let dotJson: string = JSON.stringify(dot)
    return this.http.post(this.addDotUrl, dotJson, {headers: new HttpHeaders({"Authorization": userToken})})
  }

  clearRequest(userToken: string): Observable<any> {
    return this.http.delete(this.removeDotsUrl, {headers: new HttpHeaders({"Authorization": userToken})});
  }

  dataRequest(userToken: string): Observable<any> {
    return this.http.get(this.dataUrl, {headers: new HttpHeaders({"Authorization": userToken})});
  }
}
