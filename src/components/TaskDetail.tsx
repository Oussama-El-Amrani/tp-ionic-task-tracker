import React from 'react';
import { 
  IonModal, 
  IonHeader, 
  IonToolbar, 
  IonTitle, 
  IonContent, 
  IonButtons, 
  IonButton, 
  IonIcon,
  IonBadge,
  IonItem,
  IonLabel
} from '@ionic/react';
import { close, calendar } from 'ionicons/icons';
import ReactMarkdown from 'react-markdown';
import { Task } from '../models/Task';
import './TaskDetail.css';

interface TaskDetailProps {
  isOpen: boolean;
  onClose: () => void;
  task: Task | null;
}

const TaskDetail: React.FC<TaskDetailProps> = ({ isOpen, onClose, task }) => {
  if (!task) {
    return null;
  }

  return (
    <IonModal isOpen={isOpen} onDidDismiss={onClose}>
      <IonHeader>
        <IonToolbar>
          <IonTitle>{task.title}</IonTitle>
          <IonButtons slot="end">
            <IonButton onClick={onClose}>
              <IonIcon icon={close} />
            </IonButton>
          </IonButtons>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding">
        <IonItem lines="none" className="task-date-item">
          <IonIcon icon={calendar} slot="start" />
          <IonLabel>Date</IonLabel>
          <IonBadge color="primary">{task.date}</IonBadge>
        </IonItem>
        <IonItem lines="none" className="task-status-item">
          <IonLabel>Status</IonLabel>
          <IonBadge color={task.completed ? 'success' : 'warning'}>
            {task.completed ? 'Completed' : 'In Progress'}
          </IonBadge>
        </IonItem>

        <div className="markdown-container">
          <ReactMarkdown>{task.description}</ReactMarkdown>
        </div>
      </IonContent>
    </IonModal>
  );
};

export default TaskDetail;