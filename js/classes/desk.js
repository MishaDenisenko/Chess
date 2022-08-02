class Desk {

    _horizontal = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H']
    _vertical = ['1', '2', '3', '4', '5', '6', '7', '8']
    _cells = []
    _dangerCells = []

    constructor() {
        for (let vertical of this._vertical) {
            for (let horizontal of this._horizontal) {
                this._cells.push(new Cell(horizontal + vertical, false))
            }
        }
    }

    setCellsDanger = (selfPieces, otherPieces) => {
        this._dangerCells = []
        for (let cell of this._cells) {
            cell.danger = false
        }

        for (let piece of otherPieces) {
            if (piece.isAlive) {
                let potentialMoves = piece.getMenacingMoves(selfPieces, otherPieces)
                for (let move of potentialMoves) {
                    if (!move.threatens) continue
                    for (let cell of this._cells) {
                        if (cell.coords === move.position) {
                            if (cell.danger) continue

                            cell.danger = true
                            this._dangerCells.push(cell.coords)
                            break
                        }
                    }
                }
                // if (!menacingMoves) continue
                // for (let move of menacingMoves) {
                //     for (let cell of this._cells) {
                //         if (cell.coords === move.position) {
                //             if (cell.danger) continue
                //
                //             cell.danger = true
                //             this._dangerCells.push(cell.coords)
                //             break
                //         }
                //     }
                // }
            }
        }
        // console.log(this._dangerCells)

        return this._dangerCells
    }

    getNormalizePosition = (position) => {
        return [this._vertical.indexOf(position[1]), this._horizontal.indexOf(position[0])]
    }

    getDenormalizePosition = (position) => {
        return this._horizontal[position[1]].concat(this._vertical[position[0]])
    }

    getRight = (position, color, once = false) => {
        let currentPos = this._horizontal.indexOf(position[0])
        let rightPositions = []
        switch (color) {
            case 'white':
                for (let i = currentPos + 1; i < this._horizontal.length; i++) {
                    if (!this._horizontal[i]) break
                    rightPositions.push(this._horizontal[i] + position[1])
                }
                break
            case 'black':
                for (let i = currentPos - 1; i >= 0; i--) {
                    if (!this._horizontal[i]) break
                    rightPositions.push(this._horizontal[i] + position[1])
                }
                break
        }

        return once ? rightPositions.length > 0 ? [rightPositions[0]] : [] : rightPositions
    }

    getLeft = (position, color, once = false) => {
        let currentPos = this._horizontal.indexOf(position[0])
        let leftPositions = []

        switch (color) {
            case 'white':
                for (let i = currentPos - 1; i >= 0; i--) {
                    if (!this._horizontal[i]) break
                    leftPositions.push(this._horizontal[i] + position[1])
                }
                break
            case 'black':
                for (let i = currentPos + 1; i < this._horizontal.length; i++) {
                    if (!this._horizontal[i]) break
                    leftPositions.push(this._horizontal[i] + position[1])
                }
                break
        }

        // if (once) console.log(leftPositions.length + " 9999")
        return once ? leftPositions.length > 0 ? [leftPositions[0]] : [] : leftPositions
    }

    getUp = (position, color, once = false) => {
        let currentPos = this._vertical.indexOf(position[1])
        let upPositions = []

        switch (color) {
            case 'white':
                for (let i = currentPos + 1; i < this._vertical.length; i++) {
                    if (!this._vertical[i]) break
                    upPositions.push(position[0] + this._vertical[i])
                }
                break
            case 'black':
                for (let i = currentPos - 1; i >= 0; i--) {
                    if (!this._vertical[i]) break
                    upPositions.push(position[0] + this._vertical[i])
                }
                break
        }

        return once ? upPositions.length > 0 ? [upPositions[0]] : [] : upPositions
    }

    getDown = (position, color, once = false) => {
        let currentPos = this._vertical.indexOf(position[1])
        let downPositions = []

        switch (color) {
            case 'white':
                for (let i = currentPos - 1; i >= 0; i--) {
                    if (!this._vertical[i]) break
                    downPositions.push(position[0] + this._vertical[i])
                }
                break
            case 'black':
                for (let i = currentPos + 1; i < this._vertical.length; i++) {
                    if (!this._vertical[i]) break
                    downPositions.push(position[0] + this._vertical[i])
                }
                break
        }

        return  once ? downPositions.length > 0 ? [downPositions[0]] : [] : downPositions
    }

    getRightTopDiagonal = (position, color, once = false) => {
        let currentPosH = this._horizontal.indexOf(position[0])
        let currentPosV = this._vertical.indexOf(position[1])
        let rightTopDiagonal = []

        switch (color) {
            case 'white':
                for (let i = currentPosV + 1; i < this._vertical.length; i++) {
                    if (!this._vertical[i] || !this._horizontal[currentPosH+1]) break
                    rightTopDiagonal.push(this._horizontal[++currentPosH] + this._vertical[i])
                }
                break
            case 'black':
                for (let i = currentPosV - 1; i >= 0; i--) {
                    if (!this._vertical[i] || !this._horizontal[currentPosH - 1]) break
                    rightTopDiagonal.push(this._horizontal[--currentPosH] + this._vertical[i])
                }
                break
        }

        return  once ? rightTopDiagonal.length > 0 ? [rightTopDiagonal[0]] : [] : rightTopDiagonal
    }

    getLeftTopDiagonal = (position, color, once = false) => {
        let currentPosH = this._horizontal.indexOf(position[0])
        let currentPosV = this._vertical.indexOf(position[1])
        let leftTopDiagonal = []

        switch (color) {
            case 'white':
                for (let i = currentPosV + 1; i < this._vertical.length; i++) {
                    if (!this._vertical[i] || !this._horizontal[currentPosH-1]) break
                    leftTopDiagonal.push(this._horizontal[--currentPosH] + this._vertical[i])
                }
                break
            case 'black':
                for (let i = currentPosV - 1; i >= 0; i--) {
                    if (!this._vertical[i] || !this._horizontal[currentPosH + 1]) break
                    leftTopDiagonal.push(this._horizontal[++currentPosH] + this._vertical[i])
                }
                break
        }

        return  once ? leftTopDiagonal.length > 0 ? [leftTopDiagonal[0]] : [] : leftTopDiagonal
    }

    getRightBottomDiagonal = (position, color, once = false) => {
        let currentPosH = this._horizontal.indexOf(position[0])
        let currentPosV = this._vertical.indexOf(position[1])
        let rightBottomDiagonal = []

        switch (color) {
            case 'white':
                for (let i = currentPosV - 1; i >= 0; i--) {
                    if (!this._vertical[i] || !this._horizontal[currentPosH + 1]) break
                    rightBottomDiagonal.push(this._horizontal[++currentPosH] + this._vertical[i])
                }
                break
            case 'black':
                for (let i = currentPosV + 1; i < this._vertical.length; i++) {
                    if (!this._vertical[i] || !this._horizontal[currentPosH - 1]) break
                    rightBottomDiagonal.push(this._horizontal[--currentPosH] + this._vertical[i])
                }
                break
        }

        return  once ? rightBottomDiagonal.length > 0 ? [rightBottomDiagonal[0]] : [] : rightBottomDiagonal
    }

    getLeftBottomDiagonal = (position, color, once = false) => {
        let currentPosH = this._horizontal.indexOf(position[0])
        let currentPosV = this._vertical.indexOf(position[1])
        let leftBottomDiagonal = []

        switch (color) {
            case 'white':
                for (let i = currentPosV - 1; i >= 0; i--) {
                    if (!this._vertical[i] || !this._horizontal[currentPosH - 1]) break
                    leftBottomDiagonal.push(this._horizontal[--currentPosH] + this._vertical[i])
                }
                break
            case 'black':
                for (let i = currentPosV + 1; i < this._vertical.length; i++) {
                    if (!this._vertical[i] || !this._horizontal[currentPosH + 1]) break
                    leftBottomDiagonal.push(this._horizontal[++currentPosH] + this._vertical[i])
                }
                break
        }

        return  once ? leftBottomDiagonal.length > 0 ? [leftBottomDiagonal[0]] : [] : leftBottomDiagonal
    }

    getKnightMove = (position, color) => {
        let currentPosH = this._horizontal.indexOf(position[0])
        let currentPosV = this._vertical.indexOf(position[1])
        let knightMove = []
        let posY
        let posX

        switch (color) {
            case 'white':
                posY = [-2, -1, 1, 2]
                posX = [-1, -2, 2, 1]

                break
            case 'black':
                posY = [2, 1, -1, -2]
                posX = [1, 2, -2, -1]

                break
        }

        for (let i = 0; i < posY.length; i++) {
            if (this._horizontal[currentPosH + posX[i]] && this._vertical[currentPosV + posY[i]])
                knightMove.push(this._horizontal[currentPosH + posX[i]] + this._vertical[currentPosV + posY[i]])
            if (this._horizontal[currentPosH - posX[i]] && this._vertical[currentPosV + posY[i]])
                knightMove.push(this._horizontal[currentPosH - posX[i]] + this._vertical[currentPosV + posY[i]])
        }

        return knightMove
    }

    getCastlingMove = (king, rook, rookLine) => {
        // console.log(this.getNormalizePosition(king.position), this.getNormalizePosition(rook.position))
        console.log(rookLine)
        if (!king.isShah() && king._firstMove && rook._firstMove) {
            let [kingPos, rookPos] = [this.getNormalizePosition(king.position)[1], this.getNormalizePosition(rook.position)[1]]
            let hor = king.position[1] - 1
            for (let cell of rookLine) {
                if (cell.position === king.position) {
                    return kingPos > rookPos
                        ? [
                            this.getDenormalizePosition([hor, kingPos-2]),
                            this.getDenormalizePosition([hor, rookPos+3])
                        ]
                        : [
                            this.getDenormalizePosition([hor, kingPos+2]),
                            this.getDenormalizePosition([hor, rookPos-2])
                        ]
                }
            }
        }
    }

    get dangerCells() {
        return this._dangerCells;
    }

}

class Cell {
    coords
    danger


    constructor(coords, danger) {
        this.coords = coords;
        this.danger = danger;
    }
}

export default Desk