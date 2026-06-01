// client/src/components/common/Input/Input.jsx
import styles from './Input.module.css'

export function Input({
    label,
    error,
    id,
    className = '',
    ...props
}) {
    return (
        <div className={styles.wrapper}>
            {label && ( <label htmlFor={id} className={styles.label}>
                            {label}
                        </label>
            )}
            <input id={id}
                className={`${styles.input} ${error ? styles.inputError : ''} ${className}`}
                {...props}/>
            {error && <span className={styles.error}>{error}</span>}
        </div>
    )
}