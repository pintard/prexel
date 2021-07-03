export const savePrexel = state => {
    console.log("saving")
    let data = "", count = 0
    for (let i = 0; i < state.totalCells(); i++) {
        let [r, g, b] = state.cells[i].style.background
            .slice(4, -1).replace(/ /g, '').split(',').map(Number),
            xTermColor = rgbTo256(r, g, b)
        data += `\x1b[48;5;${xTermColor}m \x1b[0m`
        if (++count === state.WIDTH) {
            count = 0
            data += "\n"
        }
    }
    data = data.slice(0, -1)
    console.log(data)
    createDownload(data)
}

const createDownload = data => {
    const FILE = new Blob([data], { type: "text/none" })
    if (window.navigator.msSaveOrOpenBlob)
        window.navigator.msSaveOrOpenBlob(FILE, "prexel")
    else {
        let a = document.createElement("a"),
            url = URL.createObjectURL(FILE)
        a.href = url
        a.download = "prexel"
        document.body.appendChild(a).click()
        setTimeout(() => {
            document.body.removeChild(a)
            window.URL.revokeObjectURL(url)
        }, 0)
    }
}

const rgbTo256 = (r, g, b) => {
    let { round } = Math
    if (r === g === b) {
        if (r < 8) return String(16)
        if (r > 248) return String(231)
        return String(round(((r - 8) / 247) * 24) + 232)
    }
    return String(16 + (36 * round(r / 255 * 5)) +
        (6 * round(g / 255 * 5)) +
        round(b / 255 * 5))
}