import { state } from '../prexel.js'
import {
    colorString,
    alphaColorString,
    createElementWithClass
} from './utils.js'

const artboard = document.getElementById("artboard-bg"),
    crosshairButton = document.getElementById("crosshair-button"),
    drawButton = document.getElementById("draw-button"),
    eraserButton = document.getElementById("eraser-button")

const throwSelectionEvent = () =>
    document.dispatchEvent(new CustomEvent('selectionEvent', {
        detail: { type: "cell selection" }
    }))

const populate = () => {

    for (let i = 0; i < state.totalCells(); i++)
        createElementWithClass("span", "cell-background", artboard).classList.add(i)


    const cellBackgrounds = Array.from(document.getElementsByClassName("cell-background"))

    let alternate = false

    for (let i = 0; i < state.totalCells(); i++) {
        let isEven = i % 2 === 0
        if (i % state.WIDTH === 0 && i !== 0) alternate = !alternate
        if (alternate) isEven = !isEven
        if (!isEven) cellBackgrounds[i].classList.add("dark")
        else cellBackgrounds[i].classList.add("light")
        createElementWithClass("span", "cell", cellBackgrounds[i]).classList.add(i)
    }

    const cells = Array.from(document.getElementsByClassName("cell"))
    const cellSelection = new SelectionArea({
        selectables: ['.cell'],
        boundaries: ['#artboard'],
        singleTap: { allow: false }
    })
    cellSelection.on('move', ({ store: { changed: { added, removed } } }) => {
        for (const element of added)
            element.style.background = state.isDrawable ?
                colorString(state.color) : element.classList.add('selected')
        for (const element of removed)
            element.classList.remove('selected')
        artboard.onmouseleave = () => {
            console.log("leaving")
            setTimeout(() => {
                // console.log(changed)
            }, 200)
            // for (const el of added)
            //    el.style.background = "red"
            // inst.cancel()
        }
    }).on('stop', () => cellSelection.keepSelection())

    cells.forEach(cell => {
        cell.onmouseenter = () => cell.classList.add("hover")
        cell.onmouseleave = () => cell.classList.remove("hover")
        cell.onmousedown = () => {
            state.selected = []
            console.log(state.isMutable)
            if (!state.isMutable)
                for (const element of state.selected)
                    element.classList.remove("selected")
            cell.classList.remove("hover")
            cell.classList.add("beingclicked")
        }
        cell.onmouseup = () => {
            setTimeout(() => {
                if (cellSelection.getSelection().length > 1) {
                    state.selected = cellSelection.getSelection()
                    cellSelection.clearSelection()
                } else {
                    state.selected.push(cell)
                }
                cell.classList.remove("beingclicked")
                throwSelectionEvent()
            }, 100)
        }
    })
    // if (state.isGridOn) drawGrid() // TODO why?
    return cells
}

const drawGrid = () => { // TODO
    Array.from(document.getElementsByClassName("crosshair-family")).forEach(item =>
        item.classList.remove("inactive"))
    crosshairButton.classList.add("active")
    state.isGridOn = true
}

const clearGrid = () => {
    Array.from(document.getElementsByClassName("crosshair-family")).forEach(item =>
        item.classList.add("inactive"))
    crosshairButton.classList.remove("active")
    state.isGridOn = false
}

const anyActive = ({ isDrawable, isErasable }) =>
    [isDrawable, isErasable].some(action => action)

const setDrawable = isDrawable => {
    if (!isDrawable) {
        drawButton.classList.remove("active")
        state.isDrawable = false
        if (!anyActive(state)) state.isMutable = false
    } else {
        drawButton.classList.add("active")
        state.isMutable = true
        state.isDrawable = true
        setErasable(false)
    }
}

const setErasable = isErasable => {
    if (!isErasable) {
        eraserButton.classList.remove("active")
        state.isErasable = false
        if (!anyActive(state)) state.isMutable = false
    } else {
        eraserButton.classList.add("active")
        state.isMutable = true
        state.isErasable = true
        setDrawable(false)
    }
}

const clearArtboard = () => state.cells.forEach(cell =>
    cell.style.background = "transparent")

const fillArtboard = () => (state.selected.length > 1) ?
    state.selected.forEach(cell => cell.style.background = colorString(state.color)) :
    state.cells.forEach(cell => cell.style.background = colorString(state.color))

export {
    populate,
    fillArtboard,
    clearArtboard,
    drawGrid,
    clearGrid,
    setDrawable,
    setErasable,
    colorString
}