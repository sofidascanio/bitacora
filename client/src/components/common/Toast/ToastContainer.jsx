import { useToastStore } from '../../../store/useToastStore.js'
import styles from './ToastContainer.module.css'

export function ToastContainer() {
    const { toasts, remove } = useToastStore()

    return (
        <div className={styles.container}>
            {toasts.map((toast) => (
                <div key={toast.id} className={`${styles.toast} ${styles[toast.type]}`}>
                    <span className="material-symbols-outlined" style={{ fontSize: 18 }}>
                        {toast.type === 'success' ? 'check_circle'
                        : toast.type === 'error' ? 'error'
                        : 'info'}
                    </span>
                    <span className={styles.message}>{toast.message}</span>
                    <button className={styles.closeBtn} onClick={() => remove(toast.id)}>
                        <span className="material-symbols-outlined" style={{ fontSize: 16 }}>close</span>
                    </button>
                </div>
            ))}
        </div>
    )
}