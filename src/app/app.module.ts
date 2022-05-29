import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import {RouterModule, Routes} from '@angular/router';
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import { AppComponent } from './app.component';
import { LoginFormComponent } from './login-form/login-form.component';
import { HeaderComponent } from './header/header.component';
import { BottomNavigationBarComponent } from './bottom-navigation-bar/bottom-navigation-bar.component';
import {HttpClientModule} from "@angular/common/http";
import { MainPageComponent } from './main-page/main-page.component';
import { UnauthorizedErrorPageComponent } from './unauthorized-error-page/unauthorized-error-page.component';
import { ClockComponent } from './clock/clock.component';
import {SpinnerModule} from "primeng/spinner";
import {InputTextModule} from "primeng/inputtext";
import {TableModule} from "primeng/table";

const routes: Routes = [
  {path: 'login', component: LoginFormComponent},
  {path: 'main', component: window.screen.width >= 1210 ?
      MainPageComponent : window.screen.width >= 836 ? MainPageComponent : MainPageComponent}, // MainPage -> TabletMainPage -> MobileMainPage
  {path: 'unauthorized', component: UnauthorizedErrorPageComponent},
  {path: '', component: LoginFormComponent}
]

@NgModule({
  declarations: [
    AppComponent,
    LoginFormComponent,
    HeaderComponent,
    BottomNavigationBarComponent,
    MainPageComponent,
    UnauthorizedErrorPageComponent,
    ClockComponent,
  ],
  imports: [
    RouterModule.forRoot(routes),
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    SpinnerModule,
    InputTextModule,
    TableModule
  ],
  providers: [LoginFormComponent],
  bootstrap: [AppComponent]
})
export class AppModule { }
