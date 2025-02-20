import { Injectable, OnDestroy } from '@angular/core';
import { inject } from '@angular/core';
import {
  Firestore,
  collection,
  onSnapshot,
  QuerySnapshot,
  DocumentData,
} from '@angular/fire/firestore';
import { Itasks } from '../interfaces/itasks';
import { BehaviorSubject } from 'rxjs';
import { updateDoc, doc } from 'firebase/firestore';

@Injectable({
  providedIn: 'root',
})
export class TasksService implements OnDestroy {
  firestore: Firestore = inject(Firestore);
  unsubscribe: () => void;

  todo$ = new BehaviorSubject<Itasks[]>([]);
  inProgress$ = new BehaviorSubject<Itasks[]>([]);
  awaitFeedback$ = new BehaviorSubject<Itasks[]>([]);
  done$ = new BehaviorSubject<Itasks[]>([]);
  taskList$ = new BehaviorSubject<Itasks[]>([]);

  constructor() {
    this.unsubscribe = onSnapshot(
      collection(this.firestore, 'tasks'),
      (tasks: QuerySnapshot<DocumentData>) => {
        const taskList: Itasks[] = [];
        const todo: Itasks[] = [];
        const inProgress: Itasks[] = [];
        const awaitFeedback: Itasks[] = [];
        const done: Itasks[] = [];

        let index = 0;
        tasks.forEach((task) => {
          const taskData = task.data() as Itasks;
          const taskObject = this.setTaskObject(task.id, taskData, index);
          taskList.push(taskObject);
          this.categorizeTask(
            taskObject,
            todo,
            inProgress,
            awaitFeedback,
            done
          );
          index++;
        });

        this.taskList$.next(taskList);
        this.todo$.next(todo);
        this.inProgress$.next(inProgress);
        this.awaitFeedback$.next(awaitFeedback);
        this.done$.next(done);
      },
      (error) => {
        console.error('Error fetching tasks:', error);
      }
    );
  }

  setTaskObject(id: string, data: any, index: number): Itasks {
    return {
      id: id,
      title: data.title || '',
      description: data.description || '',
      status: data.status || 'todo',
    };
  }

  categorizeTask(
    task: Itasks,
    todo: Itasks[],
    inProgress: Itasks[],
    awaitFeedback: Itasks[],
    done: Itasks[]
  ) {
    if (task.status === 'todo') {
      todo.push(task);
    } else if (task.status === 'in progress') {
      inProgress.push(task);
    } else if (task.status === 'feedback') {
      awaitFeedback.push(task);
    } else if (task.status === 'done') {
      done.push(task);
    }
  }

  async updateTaskStatus(taskId: string, newStatus: string) {
    const taskDocRef = doc(this.firestore, `tasks/${taskId}`);
    await updateDoc(taskDocRef, { status: newStatus }).catch((error) => {
      console.error(error);
    });
  }

  ngOnDestroy() {
    if (this.unsubscribe) {
      this.unsubscribe();
    }
  }
}
