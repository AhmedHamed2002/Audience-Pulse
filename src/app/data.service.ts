import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { environment } from '../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  isLogined = new BehaviorSubject(false);
  token = new BehaviorSubject<string>('');
  private User = new BehaviorSubject<object>({});

  constructor(private _HttpClient: HttpClient) {
    const logined = this.getState();
    if (logined != null) {
      this.isLogined.next(logined);
    }

    const userData = this.getUserDataFromStorage();
    if (userData != null) {
      this.User.next(userData);
    }

    const savedToken = localStorage.getItem('token');
    if (savedToken) {
      this.token.next(savedToken);
    }
  }

  // user state
  saveState() {
    this.setState(this.isLogined.value);
  }

  private setState(data: boolean) {
    localStorage.setItem("userState", JSON.stringify(data));
  }

  private getState(): any {
    const value = localStorage.getItem("userState");
    return value ? JSON.parse(value) : null;
  }

  // user data
  getUserData(): any {
    return this.User.value;
  }

  addUserData(data: object) {
    const newItem = { ...data };
    this.User.next(newItem);
    this.setUserDataFromStorage(newItem);
  }

  removeUserData() {
    const newItem = {};
    this.User.next(newItem);
    this.setUserDataFromStorage(newItem);
  }

  private setUserDataFromStorage(data: object) {
    localStorage.setItem("userData", JSON.stringify(data));
  }

  private getUserDataFromStorage(): any {
    const value = localStorage.getItem("userData");
    return value ? JSON.parse(value) : null;
  }

  // API methods
  registerUser(data: any): Observable<any> {
    if (data.phone_number == null) {
      delete data.phone_number;
    }
    return this._HttpClient.post(`${environment.apiUrl}/register`, data).pipe(
      tap((response: any) => {
        const token = response.token;
        this.token.next(token);
        localStorage.setItem('token', token);
      })
    );
  }

  loginUser(data: any): Observable<any> {
    return this._HttpClient.post(`${environment.apiUrl}/login`, data).pipe(
      tap((response: any) => {
        const token = response.token;
        this.token.next(token);
        localStorage.setItem('token', token);
      })
    );
  }

  editUser(data: any): Observable<any> {
    if (data.phone_number == null) {
      delete data.phone_number;
    }
    data.id = this.getUserData().id;
    const token = this.token.getValue();
    const headers = new HttpHeaders({ Authorization: `Bearer ${token}` });
    return this._HttpClient.put(`${environment.apiUrl}/edit_user`, data, { headers });
  }

requestUser(data: any): Observable<any> {
  const isTwoWords = data.request_name.trim().split(/\s+/).length === 2;
  const isArabicOrEnglish = /^[\u0600-\u06FFa-zA-Z\s]+$/.test(data.request_name.trim());
  if (isTwoWords && isArabicOrEnglish) {
    data.request_name = `"${data.request_name.trim()}"`;
  } else {
    data.request_name = data.request_name.trim();
  }
  if(data.number_of_tweets == null) data.number_of_tweets = 100 ;
  if(data.number_of_posts == null) data.number_of_posts = 20 ;
  const token = this.token.getValue();
  const headers = new HttpHeaders({
    Authorization: `Bearer ${token}`
  });
  return this._HttpClient.post(`${environment.apiUrl}/send_request`, data, { headers });
}


  logoutUser(): Observable<any> {
    const token = this.token.getValue();
    const headers = new HttpHeaders({ Authorization: `Bearer ${token}` });
    return this._HttpClient.post(`${environment.apiUrl}/logout`, null, { headers }).pipe(
      tap(() => {
        localStorage.removeItem('token');
        this.token.next('');
      })
    );
  }

  profile(): Observable<any> {
    const token = this.token.getValue();
    const headers = new HttpHeaders({ Authorization: `Bearer ${token}` });
    return this._HttpClient.post(`${environment.apiUrl}/profile`, {}, { headers });
  }
  dashboard(): Observable<any> {
    const token = this.token.getValue();
    const headers = new HttpHeaders({ Authorization: `Bearer ${token}` });
    return this._HttpClient.post(`${environment.apiUrl}/dashboard`, {}, { headers });
  }
    filter(data: any): Observable<any> {
    const token = this.token.getValue();
    const headers = new HttpHeaders({ Authorization: `Bearer ${token}` });
    return this._HttpClient.post(`${environment.apiUrl}/dashboard`, data, { headers });
  }

  check(): Observable<any> {
    const token = this.token.getValue();
    const headers = new HttpHeaders({ Authorization: `Bearer ${token}` });
    return this._HttpClient.post(`${environment.apiUrl}/check`, null, { headers });
  }
}
