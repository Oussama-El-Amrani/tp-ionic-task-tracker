import React, { useState, useEffect } from 'react';
import { 
  IonContent, 
  IonHeader, 
  IonPage, 
  IonTitle, 
  IonToolbar, 
  IonIcon, 
  IonFab, 
  IonFabButton,
  IonToast
} from '@ionic/react';
import { add } from 'ionicons/icons';
import { format } from 'date-fns';
import CalendarView from '../components/CalendarView';
import TaskList from '../components/TaskList';
import TaskForm from '../components/TaskForm';
import TaskDetail from '../components/TaskDetail';
import { taskService } from '../services/TaskService';
import { Task } from '../models/Task';
import './Home.css';

const Home: React.FC = () => {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [currentTask, setCurrentTask] = useState<Task | null>(null);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  useEffect(() => {
    loadTasksForSelectedDate();
  }, [selectedDate]);

  const loadTasksForSelectedDate = async () => {
    const formattedDate = format(selectedDate, 'yyyy-MM-dd');
    const tasksForDate = await taskService.getTasksByDate(formattedDate);
    setTasks(tasksForDate);
  };

  const handleDateSelect = (date: Date) => {
    setSelectedDate(date);
  };

  const handleAddTask = () => {
    setCurrentTask(null);
    setIsFormOpen(true);
  };

  const handleEditTask = (task: Task) => {
    setCurrentTask(task);
    setIsFormOpen(true);
  };

  const handleViewTask = (task: Task) => {
    setCurrentTask(task);
    setIsDetailOpen(true);
  };

  const handleSaveTask = async (task: Task) => {
    try {
      if (task.id && await taskService.getTasks().then(tasks => tasks.some(t => t.id === task.id))) {
        await taskService.updateTask(task);
        setToastMessage('Task updated successfully');
      } else {
        await taskService.addTask(task);
        setToastMessage('Task added successfully');
      }
      setShowToast(true);
      loadTasksForSelectedDate();
    } catch (error) {
      console.error('Error saving task:', error);
      setToastMessage('Error saving task');
      setShowToast(true);
    }
  };

  const handleDeleteTask = async (id: string) => {
    try {
      await taskService.deleteTask(id);
      setToastMessage('Task deleted successfully');
      setShowToast(true);
      loadTasksForSelectedDate();
    } catch (error) {
      console.error('Error deleting task:', error);
      setToastMessage('Error deleting task');
      setShowToast(true);
    }
  };

  const handleToggleComplete = async (id: string) => {
    try {
      await taskService.toggleTaskCompletion(id);
      loadTasksForSelectedDate();
    } catch (error) {
      console.error('Error toggling task completion:', error);
      setToastMessage('Error updating task');
      setShowToast(true);
    }
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Task Tracker</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <IonHeader collapse="condense">
          <IonToolbar>
            <IonTitle size="large">Task Tracker</IonTitle>
          </IonToolbar>
        </IonHeader>

        <CalendarView onDateSelect={handleDateSelect} />

        <div className="selected-date">
          <h2>{format(selectedDate, 'MMMM d, yyyy')}</h2>
        </div>

        <TaskList 
          tasks={tasks} 
          onToggleComplete={handleToggleComplete}
          onEdit={handleEditTask}
          onDelete={handleDeleteTask}
          onView={handleViewTask}
        />

        <IonFab vertical="bottom" horizontal="end" slot="fixed">
          <IonFabButton onClick={handleAddTask}>
            <IonIcon icon={add} />
          </IonFabButton>
        </IonFab>

        <TaskForm 
          isOpen={isFormOpen} 
          onClose={() => setIsFormOpen(false)} 
          onSave={handleSaveTask}
          task={currentTask}
        />

        <TaskDetail 
          isOpen={isDetailOpen} 
          onClose={() => setIsDetailOpen(false)} 
          task={currentTask}
        />

        <IonToast
          isOpen={showToast}
          onDidDismiss={() => setShowToast(false)}
          message={toastMessage}
          duration={2000}
          position="bottom"
        />
      </IonContent>
    </IonPage>
  );
};

export default Home;
