import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

import { BehaviorSubject } from 'rxjs';

import { TodoService } from './todo.service';
import { Todo } from './todo.model';

@Component({
  selector: 'my-app',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  todos$ = new BehaviorSubject<Todo[]>([]);

  form: FormGroup = new FormGroup({
    id: new FormControl(''),
    title: new FormControl('', Validators.required),
    description: new FormControl('', Validators.required)
  });

  constructor(private service: TodoService) {
    this.service.getAll().subscribe(list => {
      console.log(list);
      this.todos$.next(list);
    });
  }

  get formValues(): Todo {
    return this.form.value;
  }

  onSubmit() {
    if (this.form.valid) {
      this.service.save(this.form.value).subscribe(() => {
        this.form.reset();
      });
    }
  }

  onDelete(id: string) {
    if (id) {
      this.service.delete(id);
    }
  }

  gotoTop() {
    window.scroll({
      top: 0,
      left: 0,
      behavior: 'smooth'
    });
  }
}
