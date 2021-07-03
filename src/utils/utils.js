export const createElementWithId = (type, thisId, parent) => {
    const element = document.createElement(type)
    element.id = thisId
    if (isElement(parent)) parent.appendChild(element)
    else document.getElementById(parent).appendChild(element)
    return element
}

export const createElementWithClass = (type, thisClassName, parent) => {
    const element = document.createElement(type)
    element.className = thisClassName
    if (isElement(parent)) parent.appendChild(element)
    else document.getElementById(parent).appendChild(element)
    return element
}

const isElement = element =>
    (element instanceof Element || element instanceof HTMLDocument)

export const colorString = ([r, g, b]) => `rgb(${r}, ${g}, ${b})`

export const alphaColorString = ([r, g, b], a) => `rgba(${r}, ${g}, ${b}, ${a})`