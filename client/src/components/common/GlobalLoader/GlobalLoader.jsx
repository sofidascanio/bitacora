import { useIsFetching } from '@tanstack/react-query'
import styles from './GlobalLoader.module.css'

export function GlobalLoader() {
    const isFetching = useIsFetching()
    if (!isFetching) return null

    return <div className={styles.bar} />
}