import React, {useEffect, useState} from 'react';
import {
    IonButton,
    IonButtons,
    IonContent,
    IonDatetime,
    IonHeader,
    IonIcon,
    IonInput,
    IonItem,
    IonLabel,
    IonModal,
    IonTitle,
    IonToolbar
} from '@ionic/react';
import {close} from 'ionicons/icons';
import MDEditor from '@uiw/react-md-editor';
import {format} from 'date-fns';
import {Task} from '../models/Task';
import './TaskForm.css';

interface TaskFormProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (task: Task) => void;
    task?: Task;
}

const TaskForm: React.FC<TaskFormProps> = ({
                                               isOpen,
                                               onClose,
                                               onSave,
                                               task
                                           }) => {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [date, setDate] = useState<string>(format(new Date(), 'yyyy-MM-dd\'T\'HH:mm'));
    const [id, setId] = useState<string>('');

    useEffect(() => {
        if (task) {
            setTitle(task.title);
            setDescription(task.description);
            setDate(task.date);
            setId(task.id);
        } else {
            resetForm();
        }
    }, [task, isOpen]);

    const resetForm = () => {
        setTitle('');
        setDescription('');
        setDate(format(new Date(), 'yyyy-MM-dd'));
        setId('');
    };

    const handleSave = () => {
        if (!title.trim()) {
            // Could add validation error message here
            return;
        }

        const taskToSave: Task = {
            id: id || Date.now().toString(),
            title,
            description,
            date,
            completed: task ? task.completed : false
        };

        onSave(taskToSave);
        resetForm();
        onClose();
    };

    const handleDateChange = (e: CustomEvent) => {
        const selectedDate = new Date(e.detail.value);
        setDate(format(selectedDate, 'yyyy-MM-dd'));
    };

    return (
        <IonModal isOpen={isOpen} onDidDismiss={onClose}>
            <IonHeader>
                <IonToolbar>
                    <IonTitle>{task ? 'Edit Task' : 'New Task'}</IonTitle>
                    <IonButtons slot="end">
                        <IonButton onClick={onClose}>
                            <IonIcon icon={close}/>
                        </IonButton>
                    </IonButtons>
                </IonToolbar>
            </IonHeader>
            <IonContent className="ion-padding">
                <IonItem>
                    <IonLabel position="stacked">Title</IonLabel>
                    <IonInput
                        value={title}
                        onIonChange={e => setTitle(e.detail.value as string)}
                        placeholder="Enter task title"
                        required
                    />
                </IonItem>

                <IonItem>
                    <IonLabel position="stacked">Date</IonLabel>
                    <div className="calendar-center" >
                        <IonDatetime
                            value={date}
                            onIonChange={handleDateChange}
                            displayFormat="YYYY-MM-DD"
                        />
                    </div>

                </IonItem>

                <div className="markdown-editor-container">
                    <IonLabel position="stacked">Description (Markdown)</IonLabel>
                    <MDEditor
                        value={description}
                        onChange={value => setDescription(value || '')}
                        preview="edit"
                        height={300}
                    />
                </div>

                <div className="form-buttons">
                    <IonButton expand="block" onClick={handleSave}>
                        Save Task
                    </IonButton>
                </div>
            </IonContent>
        </IonModal>
    );
};

export default TaskForm;
