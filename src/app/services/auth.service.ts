import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, filter, iif, Observable, partition, tap } from 'rxjs';
// import { environment } from 'src/environments/environment';
import { InterceptorSkipHeader } from '../../utils';

export const ACCESS_TOKEN = 'accessToken';
export const REFRESH_TOKEN = 'refreshToken';
const Invalid = 'Invalid';

interface Token {
  [ACCESS_TOKEN]: string,
  [REFRESH_TOKEN]: string,
}

function setTokenToLocalStorage() {
  return tap<Token>(({ accessToken, refreshToken }) => {
    localStorage.setItem(ACCESS_TOKEN, accessToken);
    localStorage.setItem(REFRESH_TOKEN, refreshToken);
  });
}

const userInfoInit = 'userInfoInit';

interface UserInfo {
  email: string,
  name: string,
}

type User = UserInfo | typeof userInfoInit | null;

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  authApi = 'http://localhost' + ':' + '5000' + '/auth';
  // authApi = environment.contentPath + '/auth';

  private user$ = new BehaviorSubject<User>(userInfoInit);
  private userWithoutInit$ = this.user$.pipe(filter((u) => u !== userInfoInit));
  public login$: Observable<User>;
  public logout$: Observable<User>;

  constructor(private http: HttpClient) {
    [this.login$, this.logout$] = partition(this.userWithoutInit$,(user) => user !== null);

    this.logout$.subscribe((res) => {
      console.log("logout user");
      this.revokeToken();
    });
  }

  get user() {
    return this.user$.value;
  }

  get isLogin() {
    return !!this.user && this.user !== userInfoInit;
  }

  get accessToken() {
    return localStorage.getItem(ACCESS_TOKEN);
  }

  get refreshToken() {
    return localStorage.getItem(REFRESH_TOKEN);
  }

  get token() {
    const { accessToken, refreshToken } = this;
    return { accessToken, refreshToken };
  }

  get accessTokenIsEmpty() {
    return !this.accessToken;
  }

  get refreshTokenIsEmpty() {
    return !this.refreshToken;
  }

  get tokenIsEmpty() {
    return this.accessTokenIsEmpty /*&& this.refreshTokenIsEmpty;*/
  }

  userLogin(loginData: any): Observable<Token> {
    return this.http.post<Token>(this.authApi + '/login', loginData, InterceptorSkipHeader.options).pipe(setTokenToLocalStorage());
  }

  queryUserInfoByAuth(): Observable<UserInfo> {
    return this.http.post<UserInfo>(this.authApi + '/queryUserInfoByAuth', null).pipe(tap((user) => this.login(user)));
  }

  refreshTokenFromServer(): Observable<Token> {
    return this.http.post<Token>(this.authApi + '/refresh', this.token, InterceptorSkipHeader.options).pipe(setTokenToLocalStorage());
  }

  revokeToken(): void {
    // iif(() => !this.accessTokenIsEmpty, this.http.post(environment.oauth2RevokeUrl + this.access_token, null, InterceptorSkipHeader.options)).subscribe();
    this.removeToken();
  }

  removeToken(): void {
    this.removeAccessToken();
    this.removeRefreshToken();
  }

  removeAccessToken(): void {
    localStorage.removeItem(ACCESS_TOKEN);
  }

  removeRefreshToken(): void {
    localStorage.removeItem(REFRESH_TOKEN);
  }

  makeAccessInvalid(): void {
    localStorage.setItem(ACCESS_TOKEN, Invalid);
  }

  makeRefreshInvalid(): void {
    localStorage.setItem(REFRESH_TOKEN, Invalid);
  }

  login(userInfo: UserInfo) {
    this.user$.next(userInfo);
  }

  logout() {
    this.user$.next(null);
  }
}


// import { Injectable } from '@angular/core';

// @Injectable({
//   providedIn: 'root'
// })
// export class AuthService {

//   constructor() { }

//   token: string | null = null;

//   login() {
//     // Appel à l'API pour obtenir un token d'authentification
//     // Le token est stocké dans la propriété `token`
//   }
// }
