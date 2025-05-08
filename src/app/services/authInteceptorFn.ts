import { HttpInterceptorFn, HttpRequest, HttpHandlerFn, HttpEvent, HttpErrorResponse } from "@angular/common/http";

import { inject } from "@angular/core";
import { AuthService } from "./auth.service";
import { InterceptorSkipHeader, startWhen } from "../../utils";
import { BehaviorSubject, catchError, defer, EMPTY, finalize, iif, Observable, share, takeUntil, throwError, pipe, concat, tap, forkJoin } from "rxjs";
import { Router } from "@angular/router";
import { AutofillMonitor } from "@angular/cdk/text-field";

function catchHttpError(...status: Array<number>) {
    const statusMap = status.reduce((m, v) => m.set(v, v), new Map());
    // console.log("statusmap: ", statusMap);
    return (next: (err: HttpErrorResponse) => Observable<any>) => {
    //     return catchError((err) => { 
    //         if (err instanceof HttpErrorResponse && statusMap.has(err.status)) {
    //             console.log("ok", err, err instanceof HttpErrorResponse);
    //             return next(err);
    //         }
    //         else {
    //             console.log("?? err: ", err, err instanceof HttpErrorResponse, statusMap);
    //             return throwError(() => new Error(err));
    //         }
    // });
    return catchError((err) => err instanceof HttpErrorResponse && statusMap.has(err.status) ? next(err) : throwError(() => new Error(err)));
};
}

const catch401Error = catchHttpError(401);
const catch400Error = catchHttpError(400);
const catch403Error = catchHttpError(403);
const catch406Error = catchHttpError(406);
const catch500Error = catchHttpError(500);

function applyCredentials(request: HttpRequest<any>, authService: AuthService): HttpRequest<any> {
    console.log("apply credential! ", authService.accessToken);
    return request.clone({
        setHeaders: { Authorization: 'Bearer ' + authService.accessToken }
    });
}

function redirectToLoginForm() {
    const router: Router = inject(Router);
    console.log("redirect to login form");
    router.navigateByUrl('/login');
}


function handle401Error(retry$: Observable<any>, authService: AuthService, refresh$: Observable<any>, logoutUser$: Observable<any>, redirectLogin$: Observable<any>): Observable<any> {
    // console.log("source: ", retry$, authService);
    return retry$.pipe(
        startWhen(refresh$), // essaye un refresh
        tap((v) => console.log("coucou", v)), // exec si refresh complete
        takeUntil(authService.logout$), // exec si logout depuis l'app
        catch401Error(() => redirectLogin$), // exec si 401 -> logout -> redirect to login form
    );
}


function httpErrorsHandler(authService: AuthService, refresh$: Observable<any>, logoutUser$: Observable<any>, redirectLogin$: Observable<any>) {
    return (source$: Observable<any>) => source$.pipe(
        catch401Error(() => handle401Error(source$, authService, refresh$, logoutUser$, redirectLogin$)),
        catch401Error((err) => EMPTY),
        catch400Error((err) => EMPTY),
        catch403Error((err) => EMPTY),
        catch406Error((err) => EMPTY),
        catch500Error((err) => EMPTY),
    );
}

export const authInterceptor: HttpInterceptorFn = (
    req: HttpRequest<any>,
    next: HttpHandlerFn
): Observable<HttpEvent<any>> => {
    const authService = inject(AuthService);
    const router: Router = inject(Router);

    const logoutUser$ = defer(() => (authService.logout(), EMPTY));
    const refresh$ = defer(() => authService.refreshTokenFromServer()).pipe(catchError((err, caught) => redirectLogin$), share());
    const loginForm$ = defer(() => (router.navigateByUrl('/login'), EMPTY));
    const redirectLogin$ = defer(() => (authService.logout(), loginForm$));

    console.log("authInterceptor function ", req);

    if (InterceptorSkipHeader.checkHeader(req)) {
        const req2 = InterceptorSkipHeader.deleteHeader(req);
        return next(req2);
    }
    const nextHandle$ = defer(() => next(applyCredentials(req, authService)));
    // comme l'app ne peut savoir si le cookie httponly contenant le refresh est présent -> on ne peut pas deconnecter en l'absence de jetons
    return iif(() => authService.tokenIsEmpty, /*, logoutUser$*/nextHandle$, nextHandle$).pipe(httpErrorsHandler(authService, refresh$, logoutUser$, loginForm$));
    //   const token = authService.get('your-token');
    //   if (token) {
    //     const cloned = req.clone({
    //       setHeaders: {
    //         authorization: token,
    //       },
    //     });
    //     return next(cloned);
    //   } else {
    //     return next(req);
    //   }
};