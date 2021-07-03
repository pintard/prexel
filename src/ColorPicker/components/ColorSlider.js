import { createElementWithId, RGBtoHSV, colorString } from '../utils/utils.js'

export default class ColorSlider {
    constructor({ containerId, parent, color }) {
        // Set object attributes
        this.containerId = containerId
        this.parent = parent
        this.color = color
        // Builds color slider
        this.container = createElementWithId("div", containerId, parent)
        this.container.style.width = "100%"
        this.width = parseInt(window.getComputedStyle(this.container).width)
        this.height = 16
        const containerHeight = this.height + 14
        this.container.style.height = containerHeight + "px"
        // Builds canvas in slider
        this.canvas = createElementWithId("canvas", "color-slider", this.container)
        this.canvas.width = this.width
        this.canvas.height = this.height
        this.context = this.canvas.getContext("2d")
        // Builds dragger
        this.dragger = createElementWithId("span", "color-slider-thumb", this.container)
        this.dragger.style.width = "10px"
        this.dragger.style.height = containerHeight + "px"
        // State initializations
        this.initialize()
    }

    getColor = () => this.color

    setColor = color => this.color = color

    fillSlider = () => {
        const SOLID_RADIUS = 1 / 1000,
            MID_POINT = (this.height / 2) - 1,
            END_POINT = this.width - 1,
            hueGradient = this.context.createLinearGradient(
                0,
                MID_POINT,
                END_POINT,
                MID_POINT)
        hueGradient.addColorStop(0, "#FF0000")
        hueGradient.addColorStop(0 + (SOLID_RADIUS * 2), "#FF0000")
        hueGradient.addColorStop((1 / 6) - SOLID_RADIUS, "#FFFF00")
        hueGradient.addColorStop((1 / 6) + SOLID_RADIUS, "#FFFF00")
        hueGradient.addColorStop((2 / 6) - SOLID_RADIUS, "#00FF00")
        hueGradient.addColorStop((2 / 6) + SOLID_RADIUS, "#00FF00")
        hueGradient.addColorStop((3 / 6) - SOLID_RADIUS, "#00FFFF")
        hueGradient.addColorStop((3 / 6) + SOLID_RADIUS, "#00FFFF")
        hueGradient.addColorStop((4 / 6) - SOLID_RADIUS, "#0000FF")
        hueGradient.addColorStop((4 / 6) + SOLID_RADIUS, "#0000FF")
        hueGradient.addColorStop((5 / 6) - SOLID_RADIUS, "#FF00FF")
        hueGradient.addColorStop((5 / 6) + SOLID_RADIUS, "#FF00FF")
        hueGradient.addColorStop(1 - (SOLID_RADIUS * 2), "#FF0000")
        hueGradient.addColorStop(1, "#FF0000")
        // Fill the canvas with gradient
        this.context.fillStyle = hueGradient
        this.context.fillRect(0, 0, this.width, this.height)
        // Index named colors
        this.red = this.findFirstIndex([255, 0, 0])
        this.yellow = this.findFirstIndex([255, 255, 0])
        this.green = this.findFirstIndex([0, 255, 0])
        this.cyan = this.findFirstIndex([0, 255, 255])
        this.blue = this.findFirstIndex([0, 0, 255])
        this.magenta = this.findFirstIndex([255, 0, 255])
        this.endRed = this.width - 1
    }

    initialize = () => {
        this.fillSlider()
        const x0 = this.findFirstIndex(this.color)
        this.moveTo(x0)
        this.down()
        document.addEventListener('colorChanged', event => {
            const { color, type } = event.detail
            if (type.includes("field") || type === "color picker") {
                const HSV = RGBtoHSV(...color),
                    x = Math.round((HSV[0] / 360) * (this.width - 1))
                this.moveTo(x, true)
            }
        })
    }

    down = () => {
        const container = this.canvas.getBoundingClientRect()
        this.dragger.onmousedown = () => {
            this.move(container)
            this.release()
        }
        this.canvas.onmousedown = event => {
            const x = event.clientX - container.left
            this.moveTo(x)
            this.move(container)
            this.release()
        }
    }

    move = container => document.body.onmousemove = ev => {
        const x = ev.clientX - container.left
        this.moveTo(x)
    }

    release = () => document.body.onmouseup = () => {
        document.body.onmousemove = null
        document.body.onmouseup = null
        this.report()
    }

    moveTo = (x, dontDispatch) => {
        this.x = x
        if (x >= 0 && x < this.width) this.dragger.style.left = this.positionOf(x)
        if (x >= this.width - 1 || x < 0) this.color = [255, 0, 0]
        else this.color = this.colorAt(x)
        this.dragger.style.background = colorString(this.color)
        if (!dontDispatch) this.dispatch()
    }

    report = () => console.log(
        `RGB\x1b[36m x: ${Math.round(this.x)}\x1b[0m`, this.color)

    dispatch = () => document.dispatchEvent(new CustomEvent('colorChanged', {
        detail: { color: this.color, type: "color slider" }
    }))

    positionOf = x => x - (this.dragger.offsetWidth / 2) + "px"

    colorAt = x => Array.from(
        this.context.getImageData(x, 0, 1, 1).data.slice(0, 3))

    findFirstIndex = color => {
        for (let x = 0; x < this.width; x++)
            if (this.colorAt(x).toString() === color.toString()) return x
        return -1
    }

    findAllIndexes = color => {
        let indexes = []
        for (let x = 0; x < this.width; x++)
            if (this.colorAt(x).toString() === color.toString()) indexes.push(x)
        return indexes
    }

    contains = color => {
        for (let x = 0; x < this.width; x++)
            if (this.colorAt(x).toString() === color.toString()) return true
        return false
    }
}