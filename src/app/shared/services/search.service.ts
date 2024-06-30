import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Product } from '../../core/model/object-model';

@Injectable({
  providedIn: 'root',
})
export class SearchService {
  constructor(private http: HttpClient) {}

  searchByName(type: string,query: string ,name: string): Observable<Product[]> {
    return this.http.get<Product[]>(`/api/${type}/${query}=${name}`);
  }
}
