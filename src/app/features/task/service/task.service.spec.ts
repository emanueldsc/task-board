import { HttpErrorResponse, provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed, waitForAsync } from '@angular/core/testing';
import { task, TASK_INTERNAL_SERVER_ERROR_RESPONSE, TASK_NOT_FOUND_RESPONSE, TASK_UNPROCESSIBLE_ENTITY_RESPONSE, tasks } from 'src/app/__mocks__/task';
import { Task } from '../model/task.model';
import { TaskService } from './task.service';

describe('TaskService', () => {

    let taskService: TaskService;
    let httpTestingController: HttpTestingController;

    const MOCKED_TASKS = tasks;
    const MOCKED_TASK = task;

    const apiUrl = 'http://localhost:3000';

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [
                provideHttpClient(),
                provideHttpClientTesting()
            ],
        })
        taskService = TestBed.inject(TaskService);
        httpTestingController = TestBed.inject(HttpTestingController);
    });

    afterEach(() => {
        httpTestingController.verify();
    });

    it('should be created', () => {
        expect(taskService).toBeTruthy();
    });

    describe('getTasks', () => {

        it('getSortedTasks should return sorted tasks', () => {
            const sortedTasks = taskService.getSortedTasks(MOCKED_TASKS);
            expect(sortedTasks[0].title).toEqual('Comprar pão na padaria');
            expect(sortedTasks[1].title).toEqual('Ir na academia');
        })

        it('should return a list of tasks', () => {
            let tasks!: Task[] | undefined;

            taskService.getTasks().subscribe((response) => {
                tasks = response;
            });

            const req = httpTestingController.expectOne(`${apiUrl}/tasks`);

            req.flush(MOCKED_TASKS);

            expect(tasks).toEqual(MOCKED_TASKS);
            expect(taskService.tasks()).toEqual(MOCKED_TASKS);
            expect(req.request.method).toEqual('GET');
        });

        it('should throw and error when server return Internal Server Error', () => {
            let httpErrorResponse: HttpErrorResponse | undefined;

            taskService.getTasks().subscribe({
                next: () => {
                    fail('failed to fetch the tasks list')
                },
                error: (error: HttpErrorResponse) => {
                    httpErrorResponse = error;
                }
            });

            const req = httpTestingController.expectOne(`${apiUrl}/tasks`);

            req.flush('Internal Server Error', TASK_INTERNAL_SERVER_ERROR_RESPONSE);

            if (!httpErrorResponse) {
                throw new Error('Error needs to be defined');
            }

            expect(httpErrorResponse.status).toEqual(500);
            expect(httpErrorResponse.statusText).toEqual(TASK_INTERNAL_SERVER_ERROR_RESPONSE.statusText);
            expect(req.request.method).toEqual('GET');
        })
    })

    describe('createTasks', () => {

        it('should create a new task', () => {
            let task!: Task | undefined;

            taskService.createTask(MOCKED_TASK).subscribe((response) => {
                task = response;
            });

            const req = httpTestingController.expectOne(`${apiUrl}/tasks`);

            req.flush(MOCKED_TASK);

            expect(task).toEqual(MOCKED_TASK);
            expect(taskService.tasks()[0]).toEqual(MOCKED_TASK);
            expect(taskService.tasks().length).toEqual(1);
            expect(req.request.method).toEqual('POST');
        });

        it('should create a new task', waitForAsync(() => {
            taskService.createTask(MOCKED_TASK).subscribe(() => {
                expect(taskService.tasks().length).toEqual(1);
                expect(taskService.tasks()[0]).toEqual(MOCKED_TASK);
            });

            const req = httpTestingController.expectOne(`${apiUrl}/tasks`);

            req.flush(MOCKED_TASK);

            expect(req.request.method).toEqual('POST');
        }));

        it('should throw unprocessible entity with invalid body when create a task', () => {
            let httpErrorResponse: HttpErrorResponse | undefined;

            taskService.createTask(MOCKED_TASK).subscribe({
                next: () => {
                    fail('failed to add a new tasks')
                },
                error: (error: HttpErrorResponse) => {
                    httpErrorResponse = error;
                }
            });

            const req = httpTestingController.expectOne(`${apiUrl}/tasks`);

            req.flush('Unprocessable Entity', TASK_UNPROCESSIBLE_ENTITY_RESPONSE);

            if (!httpErrorResponse) {
                throw new Error('Error needs to be defined');
            }

            expect(httpErrorResponse.status).toEqual(422);
            expect(httpErrorResponse.statusText).toEqual(TASK_UNPROCESSIBLE_ENTITY_RESPONSE.statusText);
        })
    })

    describe('updateTask', () => {

        it('should updated a task', () => {
            taskService.tasks.set([MOCKED_TASK]);
            
            const updatedTask = MOCKED_TASK;
            updatedTask.title = 'Updated Task Title';

            taskService.updateTask(updatedTask).subscribe(() => {
                expect(taskService.tasks()[0]).toEqual('Updated Task Title');
            });

            const req = httpTestingController.expectOne(`${apiUrl}/tasks/${MOCKED_TASK.id}`);
            req.flush(MOCKED_TASK);

            expect(req.request.method).toEqual('PUT');

        });

        it('should throw unprocessible entity with invalid body when update a task', () => {
            let httpErrorResponse: HttpErrorResponse | undefined;

            taskService.updateTask(MOCKED_TASK).subscribe({
                next: () => {
                    fail('failed to update a tasks')
                },
                error: (error: HttpErrorResponse) => {
                    httpErrorResponse = error;
                }
            });

            const url = `${apiUrl}/tasks/${MOCKED_TASK.id}`;
            const req = httpTestingController.expectOne(url);

            req.flush('Unprocessable Entity', TASK_UNPROCESSIBLE_ENTITY_RESPONSE);

            if (!httpErrorResponse) {
                throw new Error('Error needs to be defined');
            }

            expect(httpErrorResponse.status).toEqual(422);
            expect(httpErrorResponse.statusText).toEqual(TASK_UNPROCESSIBLE_ENTITY_RESPONSE.statusText);
        })
    })
    
    describe('updateIsCompletedStatus', () => {

        it('should update the isCompleted status of a task', () => {
            taskService.tasks.set(MOCKED_TASKS);

            const updatedTask = taskService.tasks()[0];

            taskService.updateIsCompletedStatus(updatedTask.id, true).subscribe();

            const req = httpTestingController.expectOne(`${apiUrl}/tasks/${updatedTask.id}`);
            req.flush({ ...updatedTask, isCompleted: true });

            expect(taskService.tasks()[0].isCompleted).toEqual(true);
            expect(req.request.method).toEqual('PATCH');
        });

        it('should throw unprocessible entity with invalid body when update a task', () => {
            let httpErrorResponse: HttpErrorResponse | undefined;

            taskService.updateIsCompletedStatus(MOCKED_TASK.id, MOCKED_TASK.isCompleted).subscribe({
                next: () => {
                    fail('failed to update a tasks')
                },
                error: (error: HttpErrorResponse) => {
                    httpErrorResponse = error;
                }
            });

            const url = `${apiUrl}/tasks/${MOCKED_TASK.id}`;
            const req = httpTestingController.expectOne(url);

            req.flush('Unprocessable Entity', TASK_UNPROCESSIBLE_ENTITY_RESPONSE);

            if (!httpErrorResponse) {
                throw new Error('Error needs to be defined');
            }

            expect(httpErrorResponse.status).toEqual(422);
            expect(httpErrorResponse.statusText).toEqual(TASK_UNPROCESSIBLE_ENTITY_RESPONSE.statusText);
        })
    })

    describe('deleteTask', () => {

        it('should delete a task', () => {
            taskService.tasks.set(MOCKED_TASKS);

            const taskId = MOCKED_TASK.id;

            taskService.deleteTask(taskId).subscribe();
            
            const req = httpTestingController.expectOne(`${apiUrl}/tasks/${taskId}`);
            req.flush(MOCKED_TASK);
            
            expect(taskService.tasks().length).toEqual(1);
            expect(req.request.method).toEqual('DELETE');
        });

        it('should throw unprocessible entity with invalid body when delete a task', () => {
            let httpErrorResponse: HttpErrorResponse | undefined;

            taskService.tasks.set(MOCKED_TASKS);

            taskService.deleteTask(MOCKED_TASK.id).subscribe({
                next: () => {
                    fail('failed to delete a tasks')
                },
                error: (error: HttpErrorResponse) => {
                    httpErrorResponse = error;
                }
            });

            const url = `${apiUrl}/tasks/${MOCKED_TASK.id}`;
            const req = httpTestingController.expectOne(url);

            req.flush('Unprocessable Entity', TASK_NOT_FOUND_RESPONSE);

            if (!httpErrorResponse) {
                throw new Error('Error needs to be defined');
            }

            expect(taskService.tasks().length).toEqual(2);
            expect(httpErrorResponse.status).toEqual(404);
            expect(httpErrorResponse.statusText).toEqual(TASK_NOT_FOUND_RESPONSE.statusText);
        })
    })

})