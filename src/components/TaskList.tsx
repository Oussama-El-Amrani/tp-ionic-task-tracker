import React from 'react';
import { 
  IonList, 
  IonItem, 
  IonLabel, 
  IonCheckbox, 
  IonButton, 
  IonIcon, 
  IonItemSliding, 
  IonItemOptions, 
  IonItemOption 
} from '@ionic/react';
import { pencil, trash } from 'ionicons/icons';
import { Task } from '../models/Task';
import './TaskList.css';

interface TaskListProps {
  tasks: Task[];
  onToggleComplete: (id: string) => void;
  onEdit: (task: Task) => void;
  onDelete: (id: string) => void;
  onView?: (task: Task) => void;
}

const TaskList: React.FC<TaskListProps> = ({ 
  tasks, 
  onToggleComplete, 
  onEdit, 
  onDelete,
  onView 
}) => {
  if (tasks.length === 0) {
    return (
      <div className="empty-tasks">
        <p>No tasks for this day. Add a new task to get started!</p>
      </div>
    );
  }

  return (
    <IonList>
      {tasks.map(task => (
        <IonItemSliding key={task.id}>
          <IonItem 
            className={task.completed ? 'task-completed' : ''}
            onClick={() => onView && onView(task)}
          >
            <IonCheckbox 
              slot="start" 
              checked={task.completed} 
              onIonChange={(e) => {
                e.stopPropagation();
                onToggleComplete(task.id);
              }} 
            />
            <IonLabel>
              <h2>{task.title}</h2>
              <p className="task-preview">
                {task.description.substring(0, 50)}
                {task.description.length > 50 ? '...' : ''}
              </p>
            </IonLabel>
            <IonButton 
              fill="clear" 
              onClick={(e) => {
                e.stopPropagation();
                onEdit(task);
              }}
            >
              <IonIcon icon={pencil} />
            </IonButton>
          </IonItem>
          <IonItemOptions side="end">
            <IonItemOption color="danger" onClick={() => onDelete(task.id)}>
              <IonIcon slot="icon-only" icon={trash} />
            </IonItemOption>
          </IonItemOptions>
        </IonItemSliding>
      ))}
    </IonList>
  );
};

export default TaskList;
