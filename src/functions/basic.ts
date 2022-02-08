export const getParents = (element: HTMLElement): HTMLElement[] => {
    const parents: HTMLElement[] = [element]
    while (element.parentElement) {
        if (!element.parentElement) break
        parents.push(element.parentElement)
        element = element.parentElement
    }
    return parents
}

export const sleep = (time: number) => (new Promise(resolve => setTimeout(resolve, time)))

export const humanDate = (date: Date) => {
    let month = date.getMonth() + 1
    let day = date.getDate()
    let hour = date.getHours()
    let minute = date.getMinutes()

    return `${date.getFullYear().toString().slice(2)}-${month < 10 ? `0${month}` : month}-${day < 10 ? `0${day}` : day} ${hour < 10 ? `0${hour}` : hour}:${minute < 10 ? `0${minute}` : minute}`
}