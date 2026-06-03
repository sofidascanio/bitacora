import { useState, useRef, useCallback } from 'react'
import FullCalendar from '@fullcalendar/react'
import dayGridPlugin  from '@fullcalendar/daygrid'
import timeGridPlugin from '@fullcalendar/timegrid'
import interactionPlugin from '@fullcalendar/interaction'
import { useCalendarTasks } from '../features/calendar/hooks/useCalendarTasks.js'
import { useUpdateTask } from '../features/tasks/hooks/useTasks.js'
import { TaskDetail } from '../features/tasks/components/TaskDetail/TaskDetail.jsx'
import { TaskForm }   from '../features/tasks/components/TaskForm/TaskForm.jsx'
import styles from './CalendarPage.module.css'

const PRIORITY_COLORS = {
    HIGH: '#b32822',
    MEDIUM: '#5c5f60',
    LOW: '#939597',
}

export function CalendarPage() {
    const calendarRef = useRef(null)
    const [range, setRange] = useState({ from: null, to: null })
    const [selectedTaskId, setSelectedTaskId] = useState(null)
    const [showForm, setShowForm] = useState(false)
    const [defaultDate, setDefaultDate] = useState(null)

    const { data: tasks = [], isLoading } = useCalendarTasks(range)
    const { mutate: updateTask } = useUpdateTask()

    // convierte las tasks a eventos de FullCalendar
    const events = tasks.map((task) => ({
        id: task.id,
        title: task.title,
        start: task.dueDate,
        allDay: true,
        backgroundColor: PRIORITY_COLORS[task.priority] || PRIORITY_COLORS.MEDIUM,
        borderColor: 'transparent',
        textColor: '#ffffff',
        extendedProps: { task },
        classNames: task.status === 'DONE' ? [styles.eventDone] : [],
    }))

    // cuando cambia el rango visible del calendario
    const handleDatesSet = useCallback((info) => {
        setRange({
            from: info.startStr,
            to: info.endStr,
        })
    }, [])

    // click en un evento -> abrir detalle
    function handleEventClick(info) {
        setSelectedTaskId(info.event.id)
    }

    // drag & drop en el calendariom actualiza dueDate
    function handleEventDrop(info) {
        updateTask({
            id: info.event.id,
            dueDate: info.event.start.toISOString(),
        })
    }

    // click en una fecha vacia, crea tarea con esa fecha
    function handleDateClick(info) {
        setDefaultDate(info.dateStr)
        setShowForm(true)
    }

    return (
        <div style={{ display: 'flex', height: '100vh', overflow: 'hidden' }}>
            <div className={styles.page}>
                <header className={styles.header}>
                    <div>
                        <span className={styles.eyebrow}>Cronograma</span>
                        <h1 className={styles.title}>Calendario</h1>
                    </div>

                    <div className={styles.legend}>
                        {Object.entries(PRIORITY_COLORS).map(([priority, color]) => (
                            <div key={priority} className={styles.legendItem}>
                                <span className={styles.legendDot} style={{ background: color }} />
                                <span className={styles.legendLabel}>{priority}</span>
                            </div>
                        ))}
                        {isLoading && (
                            <span className={styles.loading}>Actualizando...</span>
                        )}
                    </div>
                </header>

                <div className={styles.calendarWrapper}>
                    <FullCalendar ref={calendarRef}
                                plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
                                initialView="dayGridMonth"
                                headerToolbar={{
                                    left: 'prev,next today',
                                    center: 'title',
                                    right: 'dayGridMonth,timeGridWeek',
                                }}
                                events={events}
                                datesSet={handleDatesSet}
                                eventClick={handleEventClick}
                                eventDrop={handleEventDrop}
                                dateClick={handleDateClick}
                                editable={true}
                                droppable={true}
                                dayMaxEvents={3}
                                eventDisplay="block"
                                height="100%"
                                eventClassNames={styles.event}
                    />
                </div>
            </div>

            {selectedTaskId && (
                <TaskDetail taskId={selectedTaskId}
                            onClose={() => setSelectedTaskId(null)}/>
            )}

            {showForm && (
                <TaskForm task={defaultDate ? { dueDate: defaultDate } : null}
                        onClose={() => {
                            setShowForm(false)
                            setDefaultDate(null)
                        }}/>
            )}
        </div>
    )
}