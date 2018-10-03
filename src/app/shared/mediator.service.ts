import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class MediatorService {
    private param: BehaviorSubject<any> = new BehaviorSubject(null);
    constructor() { }
    emitParam(param: any) {
        this.param.next(param);
    }
    getParam(): Observable<any> {
        return this.param.asObservable();
    }
}
