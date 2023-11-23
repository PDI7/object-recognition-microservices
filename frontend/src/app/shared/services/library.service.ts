import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {IObjectDetection} from "../interfaces/i-object-detection";

@Injectable({
  providedIn: 'root'
})
export class LibraryService {

  constructor(private http: HttpClient) { }

  saveItem(item: IObjectDetection): Observable<any> {
    return this.http.post('http://localhost:5001/library', item)
  }

  getAll(): Observable<IObjectDetection[]> {
    return this.http.get<IObjectDetection[]>('http://localhost:5001/library')
  }

  deleteById(id: string) {
    return this.http.delete('http://localhost:5001/library/' + id)
  }
}
