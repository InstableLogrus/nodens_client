import { Input, Component, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../services/auth.service';

import { Router } from '@angular/router';
import { defer, switchMap, tap } from 'rxjs';

@Component({
    selector: 'app-login-form',
    imports: [
        MatCardModule,
        MatInputModule,
        MatButtonModule,
        ReactiveFormsModule,
    ],
    templateUrl: './login-form.component.html',
    styleUrl: './login-form.component.scss'
})
export class LoginFormComponent {
    form: FormGroup = new FormGroup({
        email: new FormControl('Wilma.Parlier@outlook.com'), // @todo: change
        password: new FormControl('xsczV8z1IevziG5'), // @todo: change
    });

    constructor(private http: HttpClient, private router:Router, private authService:AuthService) { }

    queryUserInfoByAuth$ = this.authService.queryUserInfoByAuth();

    onLogin$ = defer(() => this.authService.userLogin(this.loginData))
                .pipe(switchMap(() => this.queryUserInfoByAuth$), tap(() => this.router.navigateByUrl('/')));
    


    get loginData() {
        return this.form.value;
    }


    submit() {
        if (this.form.valid) {
            // this.submitEM.emit(this.form.value);
            // console.log("submit: ", this.form.value);
            // this.http.post<any>('http://localhost:5000/auth/login', this.form.value).subscribe(data => {
            //     console.log('data:', data, this)
            //     sessionStorage.setItem('accessToken', data.access_token)
            //     this.router.navigate(['/']);
            // });
            this.onLogin$.subscribe();
        }
    }
    @Input() error: string | null = null;

    @Output() submitEM = new EventEmitter();


}
