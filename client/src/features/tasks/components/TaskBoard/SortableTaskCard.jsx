import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { TaskCard } from '../TaskCard/TaskCard.jsx'
import styles from './SortableTaskCard.module.css'

export function SortableTaskCard({ task, onSelect }) {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({
        id: task.id,
        data: { task },
    })

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.4 : 1,
        zIndex: isDragging ? 50 : 'auto',
    }

    return (
        <div ref={setNodeRef} style={style} className={styles.wrapper}>
            {/* handle de drag separado para que no interfiera con clicks */}
            <div className={styles.dragHandle}
                {...attributes}
                {...listeners}
                title="Drag to reorder">
                    <span className="material-symbols-outlined" style={{ fontSize: 16 }}>
                    drag_indicator
                    </span>
            </div>
            <div className={styles.cardWrapper}>
                <TaskCard task={task} onEdit={() => onSelect(task.id)} />
            </div>
        </div>
    )
}