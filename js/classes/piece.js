import Desk from "./desk.js";

class Piece {

    _desk = new Desk()
    _select = false
    _firstMove = true

    constructor(options) {
        this.color = options.color
        this.position = options.position
        this.isAlive = options.isAlive
        this.normalizePosition = this._desk.getNormalizePosition(this.position)
        // this.potentialMove = options.potentialMove
    }

    select = (selfPieces, otherPieces) => {
        for (let piece of [selfPieces, otherPieces]) {
            if (piece === this) this._select = true
            else piece._select = false
        }

        // console.log('selected piece in pos', this.position)
    }

    checkSelf = (position, selfPieces) => {
        for (let piece of selfPieces) {
            if (piece.position === position && piece.isAlive) return true
        }

        return false
    }

    checkOther = (position, otherPieces) => {
        for (let piece of otherPieces) {
            if (piece.position === position && piece.isAlive) return true
        }

        return false
    }

    move = (position, otherPieces) => {
        if (this._firstMove) this._firstMove = false
        for (let piece of otherPieces) {
            if (piece.position === position) {
                this.eat(piece)
                break
            }
        }
        this.position = position
    }

    eat = (other) => {
        other.destroy()
    }

    checkCell = (potentialMoves, direction, selfPieces, otherPieces) => {
        if (direction.length === 0) return

        // console.log(direction)
        for (let i = 0; i < direction.length; i++) {
            console.log(direction[i], this.checkSelf(direction[i], selfPieces))
            if (this.checkSelf(direction[i], selfPieces)) break
            else {
                if (this.checkOther(direction[i], otherPieces)){
                    potentialMoves.push({position: direction[i], cell: 'other'})
                    break
                }
                potentialMoves.push({position: direction[i], cell: 'empty'})

            }
        }
    }

    destroy = () => {
        this.isAlive = false
        this.position = -1
    }
}

export class Pawn extends Piece{
    image = `../img/chess/${this.color}/pawn.png`
    weight = 1

    getPotentialMoves = (selfPieces, otherPieces) => {
        let potentialMoves = []

        let vertical = this._desk.getUp(this.position, this.color)
        let rightTopDiagonal = this._desk.getRightTopDiagonal(this.position, this.color, true)
        let leftTopDiagonal = this._desk.getLeftTopDiagonal(this.position, this.color, true)

        if (this._firstMove){
            for (let i = 0; i < 2; i++) {
                if (vertical[i]){
                    if (this.checkSelf(vertical[i], selfPieces) || this.checkOther(vertical[i], otherPieces)) break
                    else potentialMoves.push({position: vertical[i], cell: 'empty'})
                }
                else break
            }
        }
        else {
            if (vertical[0] && !this.checkSelf(vertical[0], selfPieces) && !this.checkOther(vertical[0], otherPieces)) {
                potentialMoves.push({position: vertical[0], cell: 'empty'})
            }
        }

        if (leftTopDiagonal[0] && this.checkOther(leftTopDiagonal[0], otherPieces))
            potentialMoves.push({position: leftTopDiagonal[0], cell: 'other'})
        if (rightTopDiagonal[0] && this.checkOther(rightTopDiagonal[0], otherPieces))
            potentialMoves.push({position: rightTopDiagonal[0], cell: 'other'})

        return potentialMoves
    }
}

export class Rook extends Piece{
    weight = 5
    image = `../img/chess/${this.color}/rook.png`

    getPotentialMoves = (selfPieces, otherPieces) => {
        let potentialMoves = []

        let directions = [
            this._desk.getUp(this.position, this.color),
            this._desk.getDown(this.position, this.color),
            this._desk.getRight(this.position, this.color),
            this._desk.getLeft(this.position, this.color)
        ]

        for (let direction of directions) {
            this.checkCell(potentialMoves, direction, selfPieces, otherPieces)
        }

        return potentialMoves
    }
}

export class Knight extends Piece{
    weight = 3
    image = `../img/chess/${this.color}/knight.png`

    getPotentialMoves = (selfPieces, otherPieces) => {
        let potentialMoves = []
        let direction = this._desk.getKnightMove(this.position, this.color)

        for (let i = 0; i < direction.length; i++) {
            if (this.checkOther(direction[i], otherPieces)){
                potentialMoves.push({position: direction[i], cell: 'other'})
                break
            }
            else if (!this.checkSelf(direction[i], selfPieces)) potentialMoves.push({position: direction[i], cell: 'empty'})
        }

        // this.checkCell(potentialMoves, direction, selfPieces, otherPieces)
        console.log(potentialMoves)

        return potentialMoves
    }
}

export class Bishop extends Piece{
    weight = 3
    image = `../img/chess/${this.color}/bishop.png`

    getPotentialMoves = (selfPieces, otherPieces) => {
        let potentialMoves = []

        let directions = [
            this._desk.getLeftTopDiagonal(this.position, this.color),
            this._desk.getRightTopDiagonal(this.position, this.color),
            this._desk.getRightBottomDiagonal(this.position, this.color),
            this._desk.getLeftBottomDiagonal(this.position, this.color)
        ]

        for (let direction of directions) {
            this.checkCell(potentialMoves, direction, selfPieces, otherPieces)
        }

        return potentialMoves
    }
}

export class Queen extends Piece{
    weight = 9
    image = `../img/chess/${this.color}/queen.png`

    getPotentialMoves = (selfPieces, otherPieces) => {
        let potentialMoves = []

        let directions = [
            this._desk.getUp(this.position, this.color),
            this._desk.getDown(this.position, this.color),
            this._desk.getRight(this.position, this.color),
            this._desk.getLeft(this.position, this.color),

            this._desk.getLeftTopDiagonal(this.position, this.color),
            this._desk.getRightTopDiagonal(this.position, this.color),
            this._desk.getRightBottomDiagonal(this.position, this.color),
            this._desk.getLeftBottomDiagonal(this.position, this.color)
        ]

        for (let direction of directions) {
            this.checkCell(potentialMoves, direction, selfPieces, otherPieces)
        }

        return potentialMoves
    }
}

export class King extends Piece{
    weight = Infinity
    image = `../img/chess/${this.color}/king.png`

    getPotentialMoves = (selfPieces, otherPieces) => {
        let potentialMoves = []

        let directions = [
            this._desk.getUp(this.position, this.color, true),
            this._desk.getDown(this.position, this.color, true),
            this._desk.getRight(this.position, this.color, true),
            this._desk.getLeft(this.position, this.color, true),

            this._desk.getLeftTopDiagonal(this.position, this.color, true),
            this._desk.getRightTopDiagonal(this.position, this.color, true),
            this._desk.getRightBottomDiagonal(this.position, this.color, true),
            this._desk.getLeftBottomDiagonal(this.position, this.color, true)
        ]

        console.log(directions)
        for (let direction of directions) {
            this.checkCell(potentialMoves, direction, selfPieces, otherPieces)
        }

        return potentialMoves
    }
}