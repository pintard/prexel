import {
    createElementWithId,
    RGBtoHEX,
    HEXtoRGB
} from '../utils/utils.js'

export class RGBField {
    constructor(thisId, container, color, index, getColor) {
        // Appoint values to object state
        this.thisId = thisId
        this.container = container
        this.color = color
        this.index = index
        // Build field
        this.field = createElementWithId("input", thisId, this.container)
        this.field.className = "rgb-field color-field"
        this.field.value = color[index]
        this.field.onkeypress = event => this.isNumber(event)
        this.field.onkeyup = event => this.dispatch(event)
        this.field.onclick = event => (event.target.value === "0") ?
            event.target.value = "" : 0
        this.field.onblur = event => (event.target.value === "") ?
            event.target.value = 0 : 0
        this.getPickerColor = getColor
        this.initialize()
    }

    getColorValue = () => this.color[this.index]

    setColorValue = colorValue => {
        this.color[this.index] = colorValue
        this.field.value = colorValue
    }

    initialize = () => document.addEventListener('colorChanged', event => {
        const { color, type } = event.detail
        if (type === "color slider" || type === "color panel" || type === "HEX field")
            this.setColorValue(this.getPickerColor()[this.index])
        if (type === "color picker")
            this.setColorValue(color[this.index])
    })

    isNumber = e => (e.target.value.length <= 2
        && (e.keyCode >= 48 && e.keyCode <= 57))

    dispatch = e => {
        this.color[this.index] = Number(e.target.value)
        document.dispatchEvent(new CustomEvent('colorChanged', {
            detail: {
                color: this.color,
                changing: this.index,
                type: "RGB field",
                target: document.getElementById(this.thisId)
            }
        }))
    }
}

export class HEXField {
    constructor(thisId, container, color, getColor) {
        // Appoint values to object state
        this.thisId = thisId
        this.container = container
        this.color = color
        // Build field
        this.field = createElementWithId("input", thisId, this.container)
        this.field.className = "color-field"
        this.field.value = RGBtoHEX(...color)
        this.dispatchTimer = null
        this.field.onkeypress = event => this.isHEX(event)
        this.field.onkeyup = event => this.dispatch(event)
        this.getPickerColor = getColor
        this.initialize()
    }

    getColor = () => this.color

    setColor = color => {
        this.color = color
        this.field.value = RGBtoHEX(...this.color)
    }

    initialize = () => document.addEventListener('colorChanged', event => {
        const { color, type } = event.detail
        if (type === "color slider" || type === "color panel" || type === "RGB field")
            this.setColor(this.getPickerColor())
        if (type === "color picker")
            this.setColor(color)
    })

    isHEX = e => (e.target.value.length <= 5
        && /[0-9A-F]/i.test(String.fromCharCode(e.keyCode)))

    dispatch = e => {
        const tempColor = this.color
        setTimeout(() => { // TODO robust timeout
            try {
                this.color = HEXtoRGB(e.target.value)
            } catch (error) { console.warn("incomplete hex") }
            const changedIndex = tempColor.findIndex((tempVal, i) =>
                (tempVal !== this.color[i]))
            document.dispatchEvent(new CustomEvent('colorChanged', {
                detail: {
                    color: this.color,
                    changing: changedIndex,
                    type: "HEX field",
                    target: document.getElementById(this.thisId)
                }
            }))
        }, 100)
    }
}