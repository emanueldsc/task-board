import { AsyncPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { MatDivider } from '@angular/material/divider';
import { ColorsListComponent } from '../../components/colors-list/colors-list.component';
import { MainListComponent } from '../../components/main-list/main-list.component';
import { CategoryService } from '../../service/category.service';

const COMPONENTS = [
  MainListComponent,
  ColorsListComponent
];

const MODULES = [
  MatDivider,
  AsyncPipe
]

@Component({
  selector: 'app-category',
  standalone: true,
  imports: [...COMPONENTS, ...MODULES],
  template: `
    <div class="flex flex-col justify-between h-full w-full gap-4">

      @if(categories$ | async) {

        <!-- main-list -->
        <app-main-list class="h-full" />

        <mat-divider class="opacity-50" />

        <!-- colors-list -->
        <app-colors-list />

      }

    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CategoryComponent {

  private readonly categoryService = inject(CategoryService);

  public categories$ = this.categoryService.getCategories();

}
