import { Injectable, Injector } from '@angular/core';
import { HttpEvent, HttpInterceptor, HttpHandler, HttpRequest, HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { retry, catchError } from 'rxjs/operators';
//modules core services
import { UtilsService } from '../../core/services'

@Injectable()
export class HttpErrorInterceptor implements HttpInterceptor {
    constructor(private injector:Injector) { 
        
    }

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        const utilsService = this.injector.get(UtilsService);
        return next.handle(request)
            .pipe(
                retry(1),
                catchError((errorObject: HttpErrorResponse) => {                    
                    let errorMessage = '';
                    if (errorObject.error instanceof ErrorEvent) {
                        // client-side error
                        errorMessage = `Error: ${errorObject.error.message}`;
                    } else {
                        // server-side error
                        errorMessage = errorObject.error.message
                    }
                     //window.alert(errorMessage);
                    utilsService.onError(errorMessage);
                    return throwError(errorMessage);
                })
            )
    }
}