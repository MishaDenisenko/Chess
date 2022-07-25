import {whitePieces, blackPieces, desk, side, selectPiece, changeSide} from "./game_logic.js";

const fieldRows = document.querySelectorAll('.field-row')
let gameField = []
let selectedPiece, selectedCell

for (let i = fieldRows.length - 1; i >= 0; i--) {
    let cellsRow = []
    for (let cell of fieldRows[i].children) {
        cellsRow.push(cell)
    }
    gameField.push(cellsRow)
}

for (let i = 0; i < whitePieces.length; i++) {
    let normalizePositionW = whitePieces[i].normalizePosition
    let cell = gameField[normalizePositionW[0]][normalizePositionW[1]]
    cell.insertAdjacentHTML('beforeend',
        `<img src=${whitePieces[i].image} alt="" class="chess-icon ${whitePieces[i].color}">`
    )
}

for (let i = 0; i < blackPieces.length; i++) {
    let normalizePositionB = blackPieces[i].normalizePosition
    let cell = gameField[normalizePositionB[0]][normalizePositionB[1]]
    cell.insertAdjacentHTML('beforeend',
        `<img src=${blackPieces[i].image} alt="" class="chess-icon ${blackPieces[i].color}">`
    )
}

for (let i = 0; i < gameField.length; i++) {
    for (let j = 0; j < gameField[i].length; j++) {
        let cell = gameField[i][j]
        cell.addEventListener('click', () => clickOnCell.bind(cell)([i, j]))
    }
}

// let dangerCells = desk.setCellsDanger(whitePieces, blackPieces)
// for (let cell of dangerCells) {
//
//     let normalizePositionB = desk.getNormalizePosition(cell)
//     let cellD = gameField[normalizePositionB[0]][normalizePositionB[1]]
//     cellD.insertAdjacentHTML('beforeend',
//         `<img src="../img/chess/move/blue-dot.png" alt="" class="pos-icon">`
//     )
// }

function clickOnCell(position){
    if (this.children.length) {
        if (this.children[0].classList.contains('pos-icon')) {
            movePiece(this, desk.getDenormalizePosition(position), blackPieces)
        }
        else {
            if (side.white){
                if (this.children[0].classList.contains('chess-icon' && 'white')){
                    selectedCell = this
                    selectedPiece = selectPiece('white', position)
                    let potentialMoves = selectedPiece.getPotentialMoves(whitePieces, blackPieces)

                    showMoves(potentialMoves)
                }
                else if (this.children[0].classList.contains('chess-icon' && 'black') && selectedPiece){
                    if (this.children[1] && this.children[1].classList.contains('pos-icon'))
                        movePiece(this, desk.getDenormalizePosition(position), blackPieces, true)
                }
            }
            else if (side.black) {
                if (this.children[0].classList.contains('chess-icon' && 'black')){
                    selectedCell = this
                    selectedPiece = selectPiece('black', position)
                    let potentialMoves = selectedPiece.getPotentialMoves(blackPieces, whitePieces)

                    showMoves(potentialMoves)
                }
                else if (this.children[0].classList.contains('chess-icon' && 'white') && selectedPiece){
                    if (this.children[1] && this.children[1].classList.contains('pos-icon'))
                        movePiece(this, desk.getDenormalizePosition(position), whitePieces,true)
                }
            }
        }
    }
}

const showMoves = (positions) => {
    removeOldMoves()

    // console.log(positions)
    for (let i = 0; i < positions.length; i++) {
        let cellPos = desk.getNormalizePosition(positions[i].position)
        let cell = gameField[cellPos[0]][cellPos[1]]
        if (positions[i].cell === 'empty'){
            cell.insertAdjacentHTML('beforeend',
                `<img src="../img/chess/move/blue-dot.png" alt="" class="pos-icon">`
            )
        }
        else if (positions[i].cell === 'other'){
            cell.insertAdjacentHTML('beforeend',
                `<img src="../img/chess/move/blue-dot.png" alt="" class="pos-icon other">`
            )
        }
    }

}

const movePiece = (cell, position, otherPieces, eat = false) => {
    removeOldMoves()

    let selectedPieceIcon = selectedCell.firstChild
    selectedCell.removeChild(selectedCell.firstChild)

    selectedPiece.move(position, otherPieces)
    if (eat) {
        cell.removeChild(cell.firstChild)
        cell.appendChild(selectedPieceIcon)
    }
    else cell.appendChild(selectedPieceIcon)
    changeSide()
    selectedPiece = null
    selectedCell = null
}

const removeOldMoves = () => {
    let oldPotentialMoves = document.querySelectorAll('.pos-icon')
    for (let move of oldPotentialMoves) {
        move.parentNode.removeChild(move.parentNode.lastChild)
    }
}

