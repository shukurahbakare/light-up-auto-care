import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/Operators';
import { QuoteModel } from '../quote/quote.model';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  constructor(private http: HttpClient) {}

  postClient(data: any) {
    console.log(data);
    return this.http
      .post<any>('https://rocky-spire-51361.herokuapp.com/client', data)
      .pipe(
        map((res: any) => {
          return res;
        })
      );
  }

  getAllClients() {
    return this.http
      .get<any>('https://rocky-spire-51361.herokuapp.com/client')
      .pipe(
        map((res: any) => {
          return res;
        })
      );
  }

  getClientByID(ID: number) {
    return this.http
      .get<any>(`https://rocky-spire-51361.herokuapp.com/client/${ID}`)
      .pipe(
        map((res: any) => {
          return res;
        })
      );
  }

  updateClient(data: any, id: number) {
    return this.http
      .put<any>('https://rocky-spire-51361.herokuapp.com/client/' + id, data)
      .pipe(
        map((res: any) => {
          return res;
        })
      );
  }

  deleteClient(id: number) {
    return this.http
      .delete<any>('https://rocky-spire-51361.herokuapp.com/client/' + id)
      .pipe(
        map((res: any) => {
          return res;
        })
      );
  }

  //Vehicle

  postVehicle(data: any) {
    console.log(data);
    return this.http
      .post<any>('https://rocky-spire-51361.herokuapp.com/vehicle', data)
      .pipe(
        map((res: any) => {
          return res;
        })
      );
  }

  getVehicle() {
    return this.http
      .get<any>('https://rocky-spire-51361.herokuapp.com/vehicle')
      .pipe(
        map((res: any) => {
          return res;
        })
      );
  }

  updateVehicle(data: any, id: number) {
    return this.http
      .put<any>('https://rocky-spire-51361.herokuapp.com/vehicle' + id, data)
      .pipe(
        map((res: any) => {
          return res;
        })
      );
  }

  deleteVehicle(id: number) {
    return this.http
      .delete<any>('https://rocky-spire-51361.herokuapp.com/vehicle' + id)
      .pipe(
        map((res: any) => {
          return res;
        })
      );
  }

  //Service

  postService(data: any) {
    return this.http
      .post<any>(
        'https://rocky-spire-51361.herokuapp.com/personalisedService',
        data
      )
      .pipe(
        map((res: any) => {
          return res;
        })
      );
  }

  getAllService() {
    return this.http
      .get<any>('https://rocky-spire-51361.herokuapp.com/personalisedService')
      .pipe(
        map((res: any) => {
          return res;
        })
      );
  }
  

  updateService(data: any, id: number) {
    return this.http
      .put<any>(
        'https://rocky-spire-51361.herokuapp.com/personalisedService/' + id,
        data
      )
      .pipe(
        map((res: any) => {
          return res;
        })
      );
  }

  deleteService(id: number) {
    return this.http
      .delete<any>(
        'https://rocky-spire-51361.herokuapp.com/personalisedService/' + id
      )
      .pipe(
        map((res: any) => {
          return res;
        })
      );
  }

  //Quote

  postQuote(data: QuoteModel) {
    return this.http.post<QuoteModel>('https://rocky-spire-51361.herokuapp.com/quote', data).pipe(
      map((res: QuoteModel) => {
        return res;
      })
    );
  }
  getQuote() {
    return this.http.get<any>('https://rocky-spire-51361.herokuapp.com/quote').pipe(
      map((res: any) => {
        return res;
      })
    );
  }
  updateQuote(data: any, id: number) {
    return this.http.put<any>('https://rocky-spire-51361.herokuapp.com/quote' + id, data).pipe(
      map((res: any) => {
        return res;
      })
    );
  }


  deleteQuote(id: number) {
    return this.http.delete<any>('https://rocky-spire-51361.herokuapp.com/quote' + id).pipe(
      map((res: any) => {
        return res;
      })
    );
  }
}
