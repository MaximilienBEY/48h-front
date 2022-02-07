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