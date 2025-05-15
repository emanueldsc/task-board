import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { environment } from '../../../../environments/environment.prod';
import { Category } from '../model/category.model';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {

  private readonly apiUrl = environment.apiUrl;

  private readonly httpClient = inject(HttpClient)

  public categories = signal<Category[]>([]);

  public getCategories(): Observable<Category[]> {
    return this.httpClient
      .get<Category[]>(`${this.apiUrl}/categories`)
      .pipe(tap(categories => this.categories.set(categories)));
  }

}
