import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RegistrationService {
  private apiUrl = "https://localhost:7262/api";
  constructor(private http:HttpClient) { }

  getGovernates(): Observable<any>{
    return this.http.get<any>(this.apiUrl + '/lookup/Governates');
    
  }
  getCities(id : number): Observable<any>{
    return this.http.get<any>(this.apiUrl + '/lookup/cities/'+ id);
  }
  createUser(user: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/user`, user);
  }
}
