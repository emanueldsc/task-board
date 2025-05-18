import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { categoryBackgroundColors } from '../../constants/category.colors';
import { CategoryService } from '../../service/category.service';

@Component({
  selector: 'app-colors-list',
  standalone: true,
  imports: [],
  template: `
    <section class="h-auto mb-4">
      <div class="flex flex-wrap justify-center items-center px-4 gap-4">

      @for(category of categories(); track category.id) {
      
        <span class="flex items-center justify-center {{ categoryBackgroundColors[category.color] }} 
            px-2 py-2 rounded-2xl w-[80px] text-center text-white font-semibold select-none cursor-pointer opacity-80 hover:opacity-100 transition-all duration-200 ease-in-out">
          {{ category.name }}
        </span>
      
      }

      <span></span>
      
      </div>
    </section>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ColorsListComponent { 

  private readonly categoryService = inject(CategoryService);
  public categories = this.categoryService.categories;
  public categoryBackgroundColors = categoryBackgroundColors;

}
