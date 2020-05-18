import { time } from './types'

export function getTimeAgo(then: Date) : string {
    const diff = new Date().getTime() - then.getTime()
    const seconds = diff / 1000
    const minutes = seconds / 60
    const hours = minutes / 60
    const days = hours / 24
    const weeks = days / 7
    const months = weeks / 4
    const years = months / 12

    const roundDown = (val: number) => Math.floor(val)
    const roundUp = (val: number) => Math.ceil(val)

    if (years >= 1) {
        return getTimeMessage(years, 'year', roundDown)
    }

    if (months >= 1) {
        return getTimeMessage(months, 'month', roundDown)
    }

    if (weeks >= 1) {
        return getTimeMessage(weeks, 'week', roundDown)
    }

    if (days >= 1) {
        return getTimeMessage(days, 'day', roundDown)
    }

    if (hours >= 1) {
        return getTimeMessage(hours, 'hour', roundDown)
    }

    if (minutes >= 1) {
        return getTimeMessage(minutes, 'minute', roundDown)
    }

    return getTimeMessage(seconds, 'second', roundUp)
}

function getTimeMessage(value: number, unit: time, round: (val: number) => number) : string {
    const roundedValue = round(value)
    let formattedUnit = unit


    if (roundedValue > 1) {
        formattedUnit += 's'
    }

    return `${roundedValue} ${formattedUnit} ago`
}