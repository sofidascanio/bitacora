import { useState, useRef, useCallback } from 'react'
import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import timeGridPlugin from '@fullcalendar/timegrid'
import interactionPlugin from '@fullcalendar/interaction'
import esLocale from '@fullcalendar/core/locales/es'
import { useCalendarTasks } from '../features/calendar/hooks/useCalendarTasks.js'
import { useUpdateTask } from '../features/tasks/hooks/useTasks.js'
import { TaskDetail } from '../features/tasks/components/TaskDetail/TaskDetail.jsx'
import { TaskForm } from '../features/tasks/components/TaskForm/TaskForm.jsx'
import styles from './CalendarPage.module.css'

const PRIORITY_COLORS = {
    HIGH: '#b32822',
    MEDIUM: '#5c5f60',
    LOW: '#939597',
}

const PRIORITY_LABELS = {
    HIGH: 'Alta',
    MEDIUM: 'Media',
    LOW: 'Baja',
}

export function CalendarPage() {
    const calendarRef = useRef(null)
    const [range, setRange] = useState({ from: null, to: null })
    const [selectedTaskId, setSelectedTaskId] = useState(null)
    const [showForm, setShowForm] = useState(false)
    const [defaultDate, setDefaultDate] = useState(null)
    const [defaultTime, setDefaultTime] = useState(null)

    const { data: tasks = [], isLoading } = useCalendarTasks(range)
    const { mutate: updateTask } = useUpdateTask()

    // convierte las tasks a eventos de FullCalendar
    const events = tasks.map((task) => ({
        id: task.id,
        title: task.title,
        start:  task.dueDate,
        allDay: false,
        backgroundColor: PRIORITY_COLORS[task.priority] || PRIORITY_COLORS.MEDIUM,
        borderColor: 'transparent',
        textColor: '#ffffff',
        extendedProps: { task },
        classNames: task.status === 'DONE' ? [styles.eventDone] : [],
    }))

    // cuando cambia el rango visible del calendario
    const handleDatesSet = useCallback((info) => {
        setRange({ from: info.startStr, to: info.endStr })
    }, [])

    // click en un evento -> abrir detalle
    // loguea el id para verificar y usar string explicito
    function handleEventClick(info) {
        const id = info.event.id
        if (!id) return
        setSelectedTaskId(id)
    }

    // drag & drop en el calendariom actualiza dueDate
    function handleEventDrop(info) {
        updateTask({
            id: info.event.id,
            dueDate: info.event.start.toISOString(),
        })
    }

    // click en una fecha vacia, crea tarea con esa fecha
    // captura fecha y hora del click en el calendario
    function handleDateClick(info) {
        const dt = info.date // Date object con la hora del slot clickeado
        const pad = (n) => String(n).padStart(2, '0')
        const date = `${dt.getFullYear()}-${pad(dt.getMonth() + 1)}-${pad(dt.getDate())}`
        const time = `${pad(dt.getHours())}:${pad(dt.getMinutes())}`
        setDefaultDate(date)
        setDefaultTime(time === '00:00' ? '' : time) // si es medianoche, no precarga hora
        setShowForm(true)
    }

    function handleFormClose() {
        setShowForm(false)
        setDefaultDate(null)
        setDefaultTime(null)
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
                                <span className={styles.legendLabel}>{PRIORITY_LABELS[priority]}</span>
                            </div>
                        ))}
                        {isLoading && <span className={styles.loading}>Actualizando...</span>}
                    </div>
                </header>

                <div className={styles.calendarWrapper}>
                    <FullCalendar ref={calendarRef}
                                plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
                                initialView="dayGridMonth"
                                locale={esLocale}
                                titleFormat={(info) => {
                                    const date  = info.date.marker
                                    const month = date.toLocaleString('es', { month: 'long' })
                                    const year  = date.getFullYear()
                                    return month.charAt(0).toUpperCase() + month.slice(1) + ' ' + year
                                }}
                                buttonText={{ today: 'hoy', month: 'mes', week: 'semana' }}
                                headerToolbar={{
                                    left:   'prev,next today',
                                    center: 'title',
                                    right:  'dayGridMonth,timeGridWeek',
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
                                height="100%"/>
                </div>
            </div>

            {selectedTaskId && (
                <TaskDetail
                    taskId={selectedTaskId}
                    onClose={() => setSelectedTaskId(null)}
                />
            )}

            {showForm && (
                <TaskForm
                    task={{
                        date: defaultDate,
                        time: defaultTime,
                    }}
                    onClose={handleFormClose}
                />
            )}
        </div>
    )
}