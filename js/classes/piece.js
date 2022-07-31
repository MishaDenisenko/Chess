class Piece {
    _select = false
    _firstMove = true
    _menacingMoves = []

    constructor(options) {
        this.desk = options.desk
        this.color = options.color
        this.position = options.position
        this.isAlive = options.isAlive
        this.normalizePosition = this.desk.getNormalizePosition(this.position)
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
                let eatenPiece = this.eat(piece)

                console.log(eatenPiece)
                break
            }
        }
        this.position = position
    }

    eat = (other) => {
        other.destroy()
        return other
    }

    reborn = () => {
        this.isAlive = true
    }

    checkCell = (potentialMoves, direction, selfPieces, otherPieces, checkShah = false, knight=false) => {
        if (direction.length === 0) return

        // console.log(checkShah)
        let selfKing = selfPieces[selfPieces.length - 1]
        for (let i = 0; i < direction.length; i++) {
            if (this.checkSelf(direction[i], selfPieces)) {
                potentialMoves.push({position: direction[i], cell: 'self', threatens: true})
                if (!knight) break
            }
            else {
                let shah
                if (checkShah && (shah = this.checkShah(direction[i], selfKing, selfPieces, otherPieces))) {
                    console.log(shah)

                    continue
                }
                if (this.checkOther(direction[i], otherPieces)){
                    // if (otherKing.position === direction)  otherKing.shah()
                    potentialMoves.push({position: direction[i], cell: 'other', threatens: true})
                    if (!knight) break
                }
                else potentialMoves.push({position: direction[i], cell: 'empty', threatens: true})
            }
        }
    }

    checkShah = (newPosition, king, selfPieces, otherPieces) => {
        let oldPosition = this.position
        let eatenPiece
        this.position = newPosition
        for (let otherPiece of otherPieces) {
            if (otherPiece.isAlive && otherPiece.position === this.position) {
                eatenPiece = this.eat(otherPiece)
                break
            }
        }
        this.desk.setCellsDanger(selfPieces, otherPieces)
        let isShah = king.isShah()
        this.position = oldPosition
        if (eatenPiece) eatenPiece.reborn()

        // console.log(isShah, newPosition)
        return isShah
    }

    destroy = () => {
        this.isAlive = false
        // this.position = -1
    }
}

export class Pawn extends Piece{
    image = `../img/chess/${this.color}/pawn.png`

    weight = 1

    getMenacingMoves = () => {
        return [
            this.desk.getRightTopDiagonal(this.position, this.color, true),
            this.desk.getLeftTopDiagonal(this.position, this.color, true)
        ]
    }

    getPotentialMoves = (selfPieces, otherPieces) => {
        let potentialMoves = []

        let vertical = this.desk.getUp(this.position, this.color)
        let rightTopDiagonal = this.desk.getRightTopDiagonal(this.position, this.color, true)
        let leftTopDiagonal = this.desk.getLeftTopDiagonal(this.position, this.color, true)

        if (this._firstMove){
            for (let i = 0; i < 2; i++) {
                if (vertical[i]){
                    if (this.checkSelf(vertical[i], selfPieces) || this.checkOther(vertical[i], otherPieces)) break
                    if (this.checkShah(vertical[i], selfPieces[selfPieces.length - 1], selfPieces, otherPieces)) break
                    potentialMoves.push({position: vertical[i], cell: 'empty', threatens: false})
                }
                else break
            }
        }
        else {
            if (vertical[0] && !this.checkSelf(vertical[0], selfPieces) && !this.checkOther(vertical[0], otherPieces)) {
                if (!this.checkShah(vertical[0], selfPieces[selfPieces.length - 1], selfPieces, otherPieces))
                    potentialMoves.push({position: vertical[0], cell: 'empty', threatens: false})
            }
        }

        if (leftTopDiagonal[0]){
            this._menacingMoves.push({position: leftTopDiagonal[0], cell: 'empty', threatens: true})

            if (this.checkOther(leftTopDiagonal[0], otherPieces)) {
                if (!this.checkShah(leftTopDiagonal[0], selfPieces[selfPieces.length - 1], selfPieces, otherPieces))
                    potentialMoves.push({position: leftTopDiagonal[0], cell: 'other', threatens: true})
            }
            // else if (this.checkSelf(leftTopDiagonal[0], selfPieces)) potentialMoves.push({position: leftTopDiagonal[0], cell: 'self', threatens: true})
        }
        if (rightTopDiagonal[0]){
            this._menacingMoves.push({position: rightTopDiagonal[0], cell: 'empty', threatens: true})

            if (this.checkOther(rightTopDiagonal[0], otherPieces)){
                if (!this.checkShah(rightTopDiagonal[0], selfPieces[selfPieces.length - 1], selfPieces, otherPieces))
                    potentialMoves.push({position: rightTopDiagonal[0], cell: 'other', threatens: true})
            }
            // else if (rightTopDiagonal[0] && this.checkSelf(rightTopDiagonal[0], selfPieces)) potentialMoves.push({position: rightTopDiagonal[0], cell: 'self', threatens: true})
        }

        return potentialMoves
    }
}

export class Rook extends Piece{
    weight = 5
    image = `../img/chess/${this.color}/rook.png`

    getMenacingMoves = (selfPieces, otherPieces) => {
        return this.getPotentialMoves(selfPieces, otherPieces, false)
    }

    getPotentialMoves = (selfPieces, otherPieces, checkShah=true) => {
        let potentialMoves = []

        let directions = [
            this.desk.getUp(this.position, this.color),
            this.desk.getDown(this.position, this.color),
            this.desk.getRight(this.position, this.color),
            this.desk.getLeft(this.position, this.color)
        ]

        for (let direction of directions) {
            this.checkCell(potentialMoves, direction, selfPieces, otherPieces, checkShah)
        }

        return potentialMoves
    }
}

export class Knight extends Piece{
    weight = 3
    image = `../img/chess/${this.color}/knight.png`

    getMenacingMoves = (selfPieces, otherPieces) => {
        return this.getPotentialMoves(selfPieces, otherPieces, false)
    }

    getPotentialMoves = (selfPieces, otherPieces, checkShah=true) => {
        let potentialMoves = []
        let direction = this.desk.getKnightMove(this.position, this.color)

        // console.log(direction + " ---")
        this.checkCell(potentialMoves, direction, selfPieces, otherPieces, checkShah, true)
            // if (this.checkOther(direction[i], otherPieces)){
            //     potentialMoves.push({position: direction[i], cell: 'other', threatens: true})
            //     break
            // }
            // else if (!this.checkSelf(direction[i], selfPieces)) potentialMoves.push({position: direction[i], cell: 'empty', threatens: true})

        // for (let potentialMove of potentialMoves) {
        //     for (let potentialMoveKey in potentialMove) {
        //         console.log(potentialMoveKey, potentialMove[potentialMoveKey])
        //     }
        // }
        return potentialMoves
    }
}

export class Bishop extends Piece{
    weight = 3
    image = `../img/chess/${this.color}/bishop.png`

    getMenacingMoves = (selfPieces, otherPieces) => {
        return this.getPotentialMoves(selfPieces, otherPieces, false)
    }

    getPotentialMoves = (selfPieces, otherPieces, checkShah=true) => {
        let potentialMoves = []

        let directions = [
            this.desk.getLeftTopDiagonal(this.position, this.color),
            this.desk.getRightTopDiagonal(this.position, this.color),
            this.desk.getRightBottomDiagonal(this.position, this.color),
            this.desk.getLeftBottomDiagonal(this.position, this.color)
        ]

        for (let direction of directions) {
            this.checkCell(potentialMoves, direction, selfPieces, otherPieces, checkShah)
        }

        return potentialMoves
    }
}

export class Queen extends Piece{
    weight = 9
    image = `../img/chess/${this.color}/queen.png`

    getMenacingMoves = (selfPieces, otherPieces) => {
        return this.getPotentialMoves(selfPieces, otherPieces, false)
    }

    getPotentialMoves = (selfPieces, otherPieces, checkShah=true) => {
        let potentialMoves = []

        let directions = [
            this.desk.getUp(this.position, this.color),
            this.desk.getDown(this.position, this.color),
            this.desk.getRight(this.position, this.color),
            this.desk.getLeft(this.position, this.color),

            this.desk.getLeftTopDiagonal(this.position, this.color),
            this.desk.getRightTopDiagonal(this.position, this.color),
            this.desk.getRightBottomDiagonal(this.position, this.color),
            this.desk.getLeftBottomDiagonal(this.position, this.color)
        ]

        for (let direction of directions) {
            this.checkCell(potentialMoves, direction, selfPieces, otherPieces, checkShah)
        }

        // for (let potentialMove of potentialMoves) {
        //     console.log(potentialMove.position + '++++++')
        // }

        return potentialMoves
    }
}

export class King extends Piece{
    weight = Infinity
    image = `../img/chess/${this.color}/king.png`

    getMenacingMoves = (selfPieces, otherPieces) => {
        return this.getPotentialMoves(selfPieces, otherPieces, false)
    }

    getPotentialMoves = (selfPieces, otherPieces, checkShah=true) => {
        let potentialMoves = []
        let directions = [
            this.desk.getUp(this.position, this.color, true),
            this.desk.getDown(this.position, this.color, true),
            this.desk.getRight(this.position, this.color, true),
            this.desk.getLeft(this.position, this.color, true),

            this.desk.getLeftTopDiagonal(this.position, this.color, true),
            this.desk.getRightTopDiagonal(this.position, this.color, true),
            this.desk.getRightBottomDiagonal(this.position, this.color, true),
            this.desk.getLeftBottomDiagonal(this.position, this.color, true)
        ]

        for (let direction of directions) {
            this.checkCell(potentialMoves, direction, selfPieces, otherPieces, checkShah)
        }

        return potentialMoves
    }

    isShah = () => {
        let dangerCells = this.desk.dangerCells
        // console.log(dangerCells, this.position)
        for (let cell of dangerCells) {
            if (this.position === cell) return true
        }
        return false
    }
}