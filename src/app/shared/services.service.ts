import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse, HttpParams} from '@angular/common/http';
import { Observable } from 'rxjs';
// import { Observable } from 'rxjs/Observable';


@Injectable({
  providedIn: 'root'
})
export class ServicesService {
  constructor(private httpClient: HttpClient) {
    const debug = true;
    //domain = debug ? 'http://localhost:4300' : '';
  }

  getSubastas(): Observable<any> {
    return this.httpClient.get('http://localhost:4300/api/subastas');
  }

  getProgress(): Observable<any> {
    return this.httpClient.get('http://localhost:4300/api/log');
  }

  private handleError(error: any) {
    const errMsg = (error.message) ? error.message :
    error.status ? `${error.status} - ${error.statusText}` : 'Server error';

    return Observable.throw(errMsg);
  }
}
