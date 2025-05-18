import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { environment } from '../../../../environments/environment.prod';
import { Category } from '../model/category.model';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {

  private readonly apiUrl = environment.apiUrl;

  private readonly httpClient = inject(HttpClient);

  private readonly categories$ = this.httpClient.get<Category[]>(
    `${this.apiUrl}/categories`
  );

  public categories = toSignal(this.categories$, { initialValue: [] as Category[] });

}
