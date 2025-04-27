import React, { useState, useEffect } from 'react';
import Calendar from 'react-calendar';
import { IonBadge } from '@ionic/react';
import { format } from 'date-fns';
import { taskService } from '../services/TaskService';
import { Task } from '../models/Task';
import 'react-calendar/dist/Calendar.css';
import './CalendarView.css';

interface CalendarViewProps {
  onDateSelect: (date: Date) => void;
}

const CalendarView: React.FC<CalendarViewProps> = ({ onDateSelect }) => {
  const [value, setValue] = useState<Date>(new Date());
  const [tasks, setTasks] = useState<Task[]>([]);

  useEffect(() => {
    loadTasks();
  }, []);

  const loadTasks = async () => {
    const allTasks = await taskService.getTasks();
    setTasks(allTasks);
  };

  const onChange = (nextValue: Date) => {
    setValue(nextValue);
    onDateSelect(nextValue);
  };

  const tileContent = ({ date, view }: { date: Date; view: string }) => {
    if (view !== 'month') return null;

    const formattedDate = format(date, 'yyyy-MM-dd');
    const tasksOnDate = tasks.filter(task => task.date === formattedDate);

    if (tasksOnDate.length === 0) return null;

    return (
      <div className="task-indicator">
        <IonBadge color="primary">{tasksOnDate.length}</IonBadge>
      </div>
    );
  };

  return (
    <div className="calendar-container">
      <Calendar
        onChange={onChange}
        //ISSUE: issue is here
        value={value}
        tileContent={tileContent}
      />
    </div>
  );
};

export default CalendarView;