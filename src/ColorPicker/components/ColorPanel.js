import {
    createElementWithId,
    RGBtoHSV,
    HSVtoRGB,
    colorString
} from '../utils/utils.js'

export default class ColorPanel {
    constructor({ containerId, parent, color }) {
        // Set object attributes
        this.containerId = containerId
        this.parent = parent
        this.color = color
        // Builds color panel
        this.container = createElementWithId("div", containerId, parent)
        this.container.style.width = "100%"
        this.width = parseInt(window.getComputedStyle(this.container).width)
        this.height = Math.round(this.width / 2)
        this.container.style.height = this.height + "px"
        // Builds canvas in color panel
        this.canvas = createElementWithId("canvas", "color-panel", this.container)
        this.canvas.width = this.width
        this.canvas.height = this.height
        this.context = this.canvas.getContext("2d")
        // Builds dragger
        this.dragger = createElementWithId("span", "color-panel-thumb", this.container)
        // State initializations
        this.initialize()
    }

    getColor = () => this.color

    setColor = color => {
        this.fillPanel(color)
        const { x, y } = this.position
        this.color = this.colorAt(x, y)
        this.dragger.style.background = colorString(this.color)
    }

    fillPanel = color => {
        const MID_POINT_H = (this.height / 2) - 1,
            END_POINT_H = this.width - 1,
            MID_POINT_V = (this.width / 2) - 1,
            END_POINT_V = this.height - 1,
            SOLID_RADIUS = 2 / 1000
        // Fill observation color
        this.context.fillStyle = colorString(color)
        this.context.fillRect(0, 0, this.width, this.height)
        // Add saturation gradient
        const saturationGradient = this.context.createLinearGradient(
            0,
            MID_POINT_H,
            END_POINT_H,
            MID_POINT_H)
        saturationGradient.addColorStop(SOLID_RADIUS, "rgba(255, 255, 255, 1)")
        saturationGradient.addColorStop(1, "rgba(255, 255, 255, 0)")
        this.context.fillStyle = saturationGradient
        this.context.fillRect(0, 0, this.width, this.height)
        // Add brightness gradient
        const brightnessGradient = this.context.createLinearGradient(
            MID_POINT_V,
            0,
            MID_POINT_V,
            END_POINT_V)
        brightnessGradient.addColorStop(SOLID_RADIUS, "rgba(0, 0, 0, 0)")
        brightnessGradient.addColorStop(1, "rgba(0, 0, 0, 1)")
        this.context.fillStyle = brightnessGradient
        this.context.fillRect(0, 0, this.width, this.height)
    }

    initialize = () => {
        this.fillPanel(this.color)
        const { x0, y0 } = { x0: this.width - 1, y0: 0 }
        this.moveTo(x0, y0, true)
        this.down()
        document.addEventListener('colorChanged', event => {
            const { type, color } = event.detail
            if (type === "color slider") this.setColor(color)
            if (type === "color picker" || type.includes("field")) {
                const [hue, sat, val] = RGBtoHSV(...color),
                    x = Math.round(sat * (this.width - 1)),
                    y = Math.round((this.height - 1) * (1 - val)),
                    hueColor = HSVtoRGB(hue, 1, 1)
                this.fillPanel(hueColor)
                this.moveTo(x, y, true)
            }
        })
    }

    down = () => {
        const container = this.canvas.getBoundingClientRect()
        this.dragger.onmousedown = () => {
            this.move(container)
            this.leave(container)
            this.release()
        }
        this.canvas.onmousedown = event => {
            const x = event.clientX - container.left,
                y = event.clientY - container.top
            this.moveTo(x, y)
            this.move(container)
            this.leave(container)
            this.release()
        }
    }

    move = container => document.body.onmousemove = ev => {
        const x = ev.clientX - container.left,
            y = ev.clientY - container.top
        if ((x >= 0 && x < this.width) && (y >= 0 && y < this.height))
            this.moveTo(x, y)
    }

    leave = container => {
        this.container.onmouseleave = () => document.body.onmousemove = ev => {
            const x = ev.clientX - container.left,
                y = ev.clientY - container.top // TODO move dragger to outside
            if (x >= 0 && x < this.width)
                this.moveTo(x, y >= this.height ? this.height - 1 : 0)
            else if (y >= 0 && y < this.height)
                this.moveTo(x >= this.width ? this.width - 1 : 0, y)
        }
        this.container.onmouseenter = () => this.move(container)
    }

    release = () => document.body.onmouseup = () => {
        document.body.onmousemove = null
        document.body.onmouseup = null
        this.container.onmouseleave = null
        this.container.onmouseenter = null
        this.report()
    }

    moveTo = (x, y, dontDispatch) => {
        this.dragger.style.left = x - (this.dragger.offsetWidth / 2) + "px"
        this.dragger.style.top = y - (this.dragger.offsetHeight / 2) + "px"
        this.position = { x: x, y: y }
        this.color = this.colorAt(x, y)
        this.dragger.style.background = colorString(this.color)
        if (!dontDispatch) this.dispatch()
    }

    dispatch = () => document.dispatchEvent(new CustomEvent('colorChanged', {
        detail: { color: this.color, type: "color panel" }
    }))

    report = () => {
        const { x, y } = this.position
        console.log("RGB \x1b[36mx: %s, y: %s\x1b[0m", x, y, this.color)
    }

    colorAt = (x, y) => Array.from(
        this.context.getImageData(x, y, 1, 1).data.slice(0, 3))

    findFirstCoordinate = color => {
        for (let x = 0; x < this.width; x++)
            for (let y = 0; y < this.height; y++)
                if (this.colorAt(x, y).toString() === color.toString())
                    return { x: x, y: y }
        return null
    }

    findAllCoordinates = color => {
        let coords = []
        for (let x = 0; x < this.width; x++)
            for (let y = 0; y < this.height; y++)
                if (this.colorAt(x, y).toString() === color.toString())
                    coords.push({ x: x, y: y })
        return coords
    }

    contains = color => {
        for (let x = 0; x < this.width; x++)
            for (let y = 0; y < this.height; y++)
                if (this.colorAt(x, y).toString() === color.toString())
                    return true
        return false
    }
}