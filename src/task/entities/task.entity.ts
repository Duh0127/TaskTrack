export class Task {
  id: number;
  title: string;
  content: string | null;
  checked: boolean;
  createdAt: Date;
  updatedAt: Date;
  userId: number | null;
}
