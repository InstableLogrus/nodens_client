import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule, HttpClient, HTTP_INTERCEPTORS } from '@angular/common/http';
// import { AuthHttpInterceptor } from './services/auth.interceptor';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpLogInterceptor } from './services/http-log-interceptor';
import { RouterLink, RouterOutlet } from '@angular/router';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { LoginFormComponent } from './login-form/login-form.component';



 /// @deprecated -> utilise standalone
@NgModule({
  declarations: [
    AppComponent,
    // LayoutComponent
  ],
  imports: [
    BrowserModule,
    // AppRoutingModule,
    BrowserAnimationsModule,
    HttpClientModule,
    ReactiveFormsModule,
    RouterOutlet,
    MatSlideToggleModule,
    LoginFormComponent,
    RouterLink
  ],
  providers: [{
    provide: HTTP_INTERCEPTORS,
    useClass: AuthHttpInterceptor,
    multi: true,
  },
  {
    provide: HTTP_INTERCEPTORS,
    useClass: HttpLogInterceptor,
    multi: true,
  }
],
  bootstrap: [AppComponent]
})
export class AppModule { }

