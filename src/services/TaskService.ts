import { Storage } from '@ionic/storage';
import { Task } from '../models/Task';

export class TaskService {
  private storage: Storage | null = null;
  private initialized = false;

  constructor() {
    this.init();
  }

  async init() {
    if (this.initialized) {
      return;
    }

    const storage = new Storage();
    await storage.create();
    this.storage = storage;
    this.initialized = true;
  }

  // Get all tasks
  async getTasks(): Promise<Task[]> {
    await this.init();
    const tasks = await this.storage?.get('tasks') || [];
    return tasks;
  }

  // Get tasks for a specific date
  async getTasksByDate(date: string): Promise<Task[]> {
    const tasks = await this.getTasks();
    return tasks.filter(task => task.date === date);
  }

  // Add a new task
  async addTask(task: Task): Promise<void> {
    await this.init();
    const tasks = await this.getTasks();
    tasks.push(task);
    await this.storage?.set('tasks', tasks);
  }

  // Update an existing task
  async updateTask(task: Task): Promise<void> {
    await this.init();
    const tasks = await this.getTasks();
    const index = tasks.findIndex(t => t.id === task.id);
    if (index !== -1) {
      tasks[index] = task;
      await this.storage?.set('tasks', tasks);
    }
  }

  // Delete a task
  async deleteTask(id: string): Promise<void> {
    await this.init();
    const tasks = await this.getTasks();
    const updatedTasks = tasks.filter(task => task.id !== id);
    await this.storage?.set('tasks', updatedTasks);
  }

  // Toggle task completion status
  async toggleTaskCompletion(id: string): Promise<void> {
    await this.init();
    const tasks = await this.getTasks();
    const index = tasks.findIndex(t => t.id === id);
    if (index !== -1) {
      tasks[index].completed = !tasks[index].completed;
      await this.storage?.set('tasks', tasks);
    }
  }
}

export const taskService = new TaskService();
