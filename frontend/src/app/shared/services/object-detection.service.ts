import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class ObjectDetectionService {

  constructor(private http: HttpClient) { }

  detectObjects(file: any): Observable<any> {
    return this.http.post('http://localhost:5001/detect-objects', {img: file})
  }
}
