import { Task } from 'src/task/entities/task.entity';

export class User {
  id: number
  email: string
  name: string
  password: string
  tasks?: Array<Pick<Task, 'id' | 'title' | 'content'>>
}
