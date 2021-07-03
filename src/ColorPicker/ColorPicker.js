import ColorSlider from './components/ColorSlider.js'
import ColorPanel from './components/ColorPanel.js'
import ColorSwatch from './components/ColorSwatch.js'
import { RGBField, HEXField } from './components/ColorFields.js'
import {
    createElementWithId,
    createElementWithClass,
    RGBtoHEX,
    RGBtoHSV,
    colorString
} from './utils/utils.js'

export default class ColorPicker {
    constructor(containerId, color) {
        // Appoint values to object state
        this.element = document.getElementById(containerId)
        this.containerId = containerId
        this.color = color
        // Format the elements
        this.formatElements()
        // State Initialization
        this.initialize()
    }

    initialize = () => document.addEventListener('colorChanged', e => {
        const { color, type } = e.detail
        if (type !== "color picker") {
            let foundExtreme = false
            color.forEach((val, i) => {
                if (val > 255) {
                    color[i] = 255
                    foundExtreme = true
                }
            })
            if (foundExtreme) {
                document.dispatchEvent(new CustomEvent('colorChanged', {
                    detail: { color: color, type: "color picker" }
                }))
                e.stopPropagation()
            }
            this.color = this.colorPanel.getColor()
            this.colorLabel.setColor(this.color)
        }
    })

    formatElements = () => {
        const row1 = createElementWithClass("span", "picker-row one", this.element)
        const row2 = createElementWithClass("span", "picker-row two", this.element)
        const row3 = createElementWithClass("span", "picker-row three", this.element)
        const row4 = createElementWithClass("span", "picker-row four", this.element)
        // Build color fields
        this.buildFields(row1)
        // Implement label
        this.colorLabel = new ColorLabel(row1, this.color)
        // Implement color panel
        this.colorPanel = new ColorPanel({
            containerId: "color-panel-container",
            parent: row2,
            color: this.color
        })
        // Implement color slider
        this.colorSlider = new ColorSlider({
            containerId: "color-slider-container",
            parent: row3,
            color: this.color
        })
        // Build custom swatches
        this.buildSwatches(row4, 14)
    }

    buildFields = parent => {
        const container = createElementWithId("div", "color-field-container", parent),
            controls = createElementWithId("span", "control-button-nav", container),
            rgbButton = createElementWithId("button", "rgb-button", controls),
            hexButton = createElementWithId("button", "hex-button", controls),
            rgbView = createElementWithId("span", "rgb-view", container),
            hexView = createElementWithId("span", "hex-view", container)
        rgbButton.className = "control-buttons"
        hexButton.className = "control-buttons"
        rgbView.className = "field-views"
        hexView.className = "field-views"
        rgbButton.innerHTML = "rgb"
        hexButton.innerHTML = "hex"
        this.rField = new RGBField("r-field", rgbView, this.color, 0, this.getColor)
        this.gField = new RGBField("g-field", rgbView, this.color, 1, this.getColor)
        this.bField = new RGBField("b-field", rgbView, this.color, 2, this.getColor)
        this.hexField = new HEXField("hex-field", hexView, this.color, this.getColor)
        rgbButton.onclick = e => this.switch(e.target)
        hexButton.onclick = e => this.switch(e.target)
    }

    switch = target => {
        const buttons = Array.from(document.getElementsByClassName("control-buttons")),
            views = Array.from(document.getElementsByClassName("field-views"))
        buttons.forEach((button, i) => {
            button.style.background = (button === target) ? "#2C3037" : "none"
            views[i].style.display = (button === target) ? "flex" : "none"
        })
    }

    buildSwatches = (parent, count) => {
        this.swatchContainer = createElementWithId("div", "swatch-container", parent)
        this.swatches = []
        for (let i = 0; i < count; i++)
            this.swatches.push(new ColorSwatch("swatch-containers",
                this.swatchContainer,
                "#2C3037"))
    }

    getColor = () => this.color

    setColor = color => this.color = color
}

class ColorLabel {
    constructor(parent, color) {
        this.parent = parent
        this.color = color
        this.element = createElementWithId("span", "color-label", parent)
        this.element.style.background = colorString(color)
        this.size(this.element)
        this.initialize()
    }

    initialize = () => {
        this.element.onclick = () =>
            navigator.clipboard.writeText("#" + RGBtoHEX(...this.color))
        const rgbText = createElementWithId("span", "", this.element),
            hexText = createElementWithId("span", "", this.element)
        document.addEventListener('colorChanged', e => {
            const { color } = e.detail,
                [, sat, val] = RGBtoHSV(...color)

            rgbText.style.color = (sat <= 0.25 && val >= 0.7) ? "#000000" : "#FFFFFF"
            hexText.style.color = (sat <= 0.25 && val >= 0.7) ? "#000000" : "#FFFFFF"
            rgbText.innerHTML = colorString(this.color)
            hexText.innerHTML = "#" + RGBtoHEX(...this.color)
        })
    }

    size = label => {
        label.style.height = "100%"
        label.style.width = window.getComputedStyle(label).height
    }

    getColor = () => this.color

    setColor = color => {
        this.color = color
        this.element.style.background = colorString(this.color)
    }
}