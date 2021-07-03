import {
    createElementWithClass as create,
    colorString,
    HEXtoRGB
} from '../utils/utils.js'

export default class Swatch {
    constructor(thisClass, container, color) {
        this.thisClass = thisClass
        this.container = container
        this.defaultColor = color
        this.color = color
        this.swatch = this.buildSwatch()
    }

    setColor = color => {
        this.color = color
        this.swatch.children[1]
            .style.background = colorString(this.color)
    }

    getColor = () => this.color

    buildSwatch = () => {
        const container = create("div", this.thisClass, this.container),
            clearButton = create("span", "swatch-clear-buttons", container),
            background = create("div", "swatches", container),
            defaultRGB = colorString(HEXtoRGB(this.defaultColor.slice(1)))
        background.style.background = defaultRGB
        container.onmouseenter = () => {
            const color = background.style.background
            if (color !== defaultRGB) clearButton.classList.add("show")
        }
        clearButton.onclick = () => {
            background.style.background = defaultRGB
            clearButton.classList.remove("show")
        }
        container.onmouseleave = () => clearButton.classList.remove("show")
        return container
    }
}