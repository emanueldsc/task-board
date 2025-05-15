import { Component } from '@angular/core';
import { MatDivider } from '@angular/material/divider';
import { CategoryComponent } from '../../features/category/view/category/category.component';
import { TaskComponent } from '../../features/task/view/task/task.component';

const COMPONENTS = [
  CategoryComponent,
  TaskComponent
]

const MODULES = [
  MatDivider
]

@Component({
  selector: 'app-main',
  standalone: true,
  imports: [...COMPONENTS, ...MODULES],
  template: `
    <div class="h-screen flex w-full">

      <!-- Categorias -->
      <app-category class="w-1/4" />

      <!-- Tarefas -->
      <mat-divider class="h-full opacity-50" vertical />

      <!-- Tarefas -->
      <app-task class="w-3/4 pt-10" />

    </div>
  `

})
export class MainComponent {

}
