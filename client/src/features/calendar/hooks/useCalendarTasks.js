import { useQuery } from '@tanstack/react-query'
import { tasksApi } from '../../../api/tasks.api.js'
import { taskKeys } from '../../tasks/hooks/useTasks.js'

export function useCalendarTasks({ from, to }) {
    return useQuery({
        queryKey: [...taskKeys.calendar(), from, to],
        queryFn: () => tasksApi.calendar({ from, to }).then((r) => r.data),
        enabled: !!from && !!to,
        staleTime: 1000 * 60 * 5,
    })
}