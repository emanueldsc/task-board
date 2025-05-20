import { HttpClient } from "@angular/common/http";
import { computed, inject, Injectable, signal } from "@angular/core";
import { Observable, tap } from "rxjs";
import { environment } from "../../../../environments/environment.prod";
import { Task } from "../model/task.model";

@Injectable({
    providedIn: 'root'
})
export class TaskService {
    
    private readonly _httpClient = inject(HttpClient);

    public tasks = signal<Task[]>([]);

    public numberOfTasks = computed(() => this.tasks().length);

    private readonly _apiUrl = environment.apiUrl;

    public getTasks(): Observable<Task[]> {
        return this._httpClient.get<Task[]>(`${this._apiUrl}/tasks`)
            .pipe(tap(tasks => {
                this.tasks.set(tasks);
            }));
    }

    public createTask(task: Partial<Task>): Observable<Task> {
        return this._httpClient.post<Task>(`${this._apiUrl}/tasks`, task)
    }

    public insertATaskInTheTasksLists(newTask: Task): void {
        const updatedTasks = [...this.tasks(), newTask];
        const sortedTasks = this.getSortedTasks(updatedTasks);
        this.tasks.set(sortedTasks);
    }

    public getSortedTasks(tasks: Task[]): Task[] {
        return tasks.sort((a, b) => a.title.localeCompare(b.title));
    }

    public updateTask(task: Task): Observable<Task> {
        return this._httpClient.put<Task>(`${this._apiUrl}/tasks/${task.id}`, task)
    }

    // 
    public updateATaskInTheTasksList(task: Task): void {
        this.tasks.update(tasks => {
            const allTasksWithUpdatedTaskRemoved = tasks.filter(ItemOldList => ItemOldList.id !== task.id);
            const updatedTasks = [...allTasksWithUpdatedTaskRemoved, task];
            return this.getSortedTasks(updatedTasks);
        })
    }

    public updateIsCompletedStatus(taskIs: string, isCompleted: boolean): Observable<Task> {
        return this._httpClient.patch<Task>(`${this._apiUrl}/tasks/${taskIs}`, { isCompleted })
    }

    public deleteTask(taskId: string): Observable<Task> {
        return this._httpClient.delete<Task>(`${this._apiUrl}/tasks/${taskId}`)
    }

    public deleteATaskInTheTasksList(taskId: string): void {
        this.tasks.update(tasks => {
            const updatedTasks = tasks.filter(task => task.id !== taskId);
            return this.getSortedTasks(updatedTasks);
        })
    }


}