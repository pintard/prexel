import {
    populate,
    fillArtboard,
    clearArtboard,
    drawGrid,
    clearGrid,
    setDrawable,
    setErasable,
    colorString
} from './utils/handler.js'
import ColorPicker from './ColorPicker/ColorPicker.js'
import { savePrexel } from './utils/export.js'

export const state = {
    WIDTH: 40,
    HEIGHT: 14,
    selected: [],
    cells: [],
    color: [255, 149, 0],
    totalCells() {
        return this.WIDTH * this.HEIGHT
    },
    isGridOn: true,
    isMutable: false,
    isDrawable: false,
    isErasable: false
}

const artboard = document.getElementById("artboard-bg"),
    artboardFrame = artboard.parentElement,
    crosshairButton = document.getElementById("crosshair-button"),
    drawButton = document.getElementById("draw-button"),
    eraserButton = document.getElementById("eraser-button"),
    fillallButton = document.getElementById("fillall-button"),
    rowField = document.getElementById("row-field"),
    columnField = document.getElementById("column-field"),
    colorPicker = new ColorPicker("color-picker-area", state.color),
    swatches = colorPicker.swatches,
    save = document.getElementById("save-button"),
    crosshairH = document.getElementById("crosshairH"),
    crosshairV = document.getElementById("crosshairV"),
    reticle = document.getElementById("reticle")

const WAIT = 500
let initClick = 0

window.onload = () => state.cells = populate()

window.onclick = event => {
    const clearSelected = () => {
        for (const el of state.selected) {
            if (el.classList.contains("selected"))
                el.classList.remove("selected")
            if (el.classList.contains("beingclicked"))
                el.classList.remove("beingclicked")
        }
        state.selected = []
    }
    if (!artboard.contains(event.target))
        clearSelected()
    // if (!artboard.contains(event.target) && !state.isMutable
    //    || event.target.tagName === "BUTTON")
}

// Page values initialization
new MutationObserver(() => state.isGridOn ? drawGrid() : clearGrid())
    .observe(artboard, { childList: true }) // TODO
rowField.value = window.getComputedStyle(artboard)
    .gridTemplateRows.split(' ').length
columnField.value = window.getComputedStyle(artboard)
    .gridTemplateColumns.split(' ').length

document.addEventListener('colorChanged', () =>
    state.color = colorPicker.getColor())

document.addEventListener('selectionEvent', () => {
    const { selected, isDrawable, isErasable, color } = state
    console.log("selected", selected)
    if (isDrawable) selected.forEach(cell =>
        cell.style.background = colorString(color))
    if (isErasable) selected.forEach(cell =>
        cell.style.background = "transparent")
})

eraserButton.onmouseup = event => {
    if (WAIT > new Date().getTime() - initClick) {
        event.target.classList.add("flash")
        setTimeout(() => event.target.classList.remove("flash"), 300)
        clearArtboard()
        state.selected = []
        initClick = 0
    } else initClick = new Date().getTime()
}

swatches.forEach(item => item.swatch.children[1].onclick = () => {
    item.swatch.children[0].classList.add("show")
    item.setColor(state.color)
})

artboardFrame.onmouseover = e => {
    // console.log("enter", e.target)
    const container = artboardFrame.getBoundingClientRect()
    crosshairH.style.visibility = "visible"
    crosshairV.style.visibility = "visible"
    reticle.style.visibility = "visible"
    artboardFrame.onmousemove = event => {
        const x = event.pageX - container.left,
            y = event.pageY - container.top
        crosshairV.style.left = x + "px"
        crosshairH.style.top = y + "px"
        reticle.style.left = x - (reticle.offsetWidth / 2) + "px"
        reticle.style.top = y - (reticle.offsetHeight / 2) + "px"
    }
} // TODO random behaviour

artboardFrame.onmouseleave = e => {
    // console.log("leave", e.target)
    crosshairH.style.visibility = "hidden"
    crosshairV.style.visibility = "hidden"
    reticle.style.visibility = "hidden"
    artboardFrame.onmousemove = null
}

const changeArtboard = (code, type) => {
    const field = type === "row" ? rowField : columnField
    if (!(code >= 48 && code <= 57) && code !== 13) return false
    if (code === 13) {
        const MAX = (type === "row") ? 30 : 90
        if (+field.value > MAX) {
            alert("Thats 2 much")
            field.value = (type === "row") ? state.HEIGHT : state.WIDTH
            return false
        } else {
            artboard.innerHTML = ''
            if (type === "column") {
                state.WIDTH = +field.value
                artboard.style.gridTemplateColumns = `repeat(${state.WIDTH}, 1fr)`
            } else {
                state.HEIGHT = +field.value
                artboard.style.gridTemplateRows = `repeat(${state.HEIGHT}, 1fr)`
            }
            state.cells = populate()
            return true
        }
    } else return true
}

rowField.onkeypress = e => changeArtboard(e.keyCode, "row")

columnField.onkeypress = e => changeArtboard(e.keyCode, "column")

crosshairButton.onclick = () => state.isGridOn ? clearGrid() : drawGrid()

drawButton.onclick = () => state.isDrawable ? setDrawable(false) : setDrawable(true)

eraserButton.onclick = () => state.isErasable ? setErasable(false) : setErasable(true)

fillallButton.onclick = () => fillArtboard()

save.onclick = () => savePrexel(state)