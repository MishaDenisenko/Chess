import {whitePieces, blackPieces, whiteKing, blackKing, desk, side, selectPiece, changeSide} from "./game_logic.js";

const fieldRows = document.querySelectorAll('.field-row')
const [castlingBtn] = [document.querySelector('#castling')]
let gameField = []
let selectedPiece, selectedCell

const getCellPosition = (position, arrangement=true) => {
    let normalizePosition

    if (arrangement) {
        normalizePosition = position.normalizePosition
        // console.log(normalizePosition)
    }
    else normalizePosition = desk.getNormalizePosition(position)

    return gameField[normalizePosition[0]][normalizePosition[1]]
}

for (let i = fieldRows.length - 1; i >= 0; i--) {
    let cellsRow = []
    for (let cell of fieldRows[i].children) {
        cellsRow.push(cell)
    }
    gameField.push(cellsRow)
}

for (let i = 0; i < whitePieces.length; i++) {
    let cell = getCellPosition(whitePieces[i])
    cell.insertAdjacentHTML('beforeend',
        `<img src=${whitePieces[i].image} alt="" class="chess-icon ${whitePieces[i].color}">`
    )
}

for (let i = 0; i < blackPieces.length; i++) {
    let cell = getCellPosition(blackPieces[i])
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

castlingBtn.onclick = () =>{
    console.log(desk.getCastlingMove(whiteKing, whitePieces[8], whitePieces[8].getPotentialMoves(whitePieces, blackPieces)))
    desk.getCastlingMove(whiteKing, whitePieces[9])
    desk.getCastlingMove(blackKing, blackPieces[8])
    desk.getCastlingMove(blackKing, blackPieces[9])
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
                    outlineCell(this, '#48e8ed')

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
                    outlineCell(this, '#48e8ed')

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

        let cell = getCellPosition(positions[i].position, false)
        if (positions[i].cell === 'empty'){
            cell.insertAdjacentHTML('beforeend',
                `<img src="../img/chess/move/blue-dot.png" alt="" class="pos-icon">`
            )
        }
        else if (positions[i].cell === 'other'){
            cell.insertAdjacentHTML('beforeend',
                `<img src="../img/chess/move/red-dot.png" alt="" class="pos-icon">`
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
    deOutline(true)
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

const outlineCell = (cell, color) => {
    deOutline()
    if (cell.style.borderColor !== 'rgb(216, 53, 53)') cell.style.border = `2px ${color} solid`
}

const deOutline = (newMove) => {
    for (let row of gameField) {
        for (let cell of row) {
            // console.log(cell.style.borderColor)
            if (cell.style.borderColor !== 'rgb(216, 53, 53)' || newMove) cell.style.border = 'none'
        }
    }
}

export const shahOutline = (king) => {
    let cell = getCellPosition(king.position, false)
    outlineCell(cell, '#d83535')
}


