import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Observable, Subject } from 'rxjs';
import { map } from 'rxjs/operators';
import { Todo } from './todo.model';

@Injectable({
  providedIn: 'root'
})
export class TodoService {
  constructor(private afs: AngularFirestore) {}

  getAll() {
    return this.afs
      .collection<Todo>('todos')
      .snapshotChanges()
      .pipe(
        map(actions => {
          return actions.map(a => {
            return { id: a.payload.doc.id, ...a.payload.doc.data() };
          });
        })
      );
  }

  save(todo: Todo): Observable<Todo> {
    const subject = new Subject<Todo>();
    if (todo.id) {
      this.afs
        .collection('todos')
        .doc(todo.id)
        .set(todo)
        .then(() => subject.next(todo));
    } else {
      this.afs
        .collection('todos')
        .add(todo)
        .then(ref => {
          const newTodo = {
            ...(todo as Todo),
            id: ref.id
          };
          ref.set(newTodo);
          subject.next(newTodo);
        });
    }
    return subject.asObservable();
  }

  delete(id: string) {
    this.afs.doc('todos/' + id).delete();
  }
}
