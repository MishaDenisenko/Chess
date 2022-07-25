import Desk from "./classes/desk.js";
import {Bishop, King, Knight, Pawn, Queen, Rook} from "./classes/piece.js";



export const desk = new Desk()
export const whitePieces = []
export const blackPieces = []
export let side = {
    white: true,
    black: false,
}

let whiteFirstRow = ['A2'].concat(desk.getRight('A2', 'white'))
let whiteSecondRow = ['A1'].concat(desk.getRight('A1', 'white'))
let blackFirstRow = ['A7'].concat(desk.getLeft('A7', 'black'))
let blackSecondRow = ['A8'].concat(desk.getLeft('A8', 'black'))

for (let i = 0; i < 8; i++) {
    whitePieces.push(
        new Pawn({
            color: 'white',
            position: whiteFirstRow[i],
            isAlive: true
        })
    )
    blackPieces.push(
        new Pawn({
            color: 'black',
            position: blackFirstRow[i],
            isAlive: true
        })
    )
}

whitePieces.push(
    new Rook({
        color: 'white',
        position: whiteSecondRow[0],
        isAlive: true
    }),
    new Rook({
        color: 'white',
        position: whiteSecondRow[7],
        isAlive: true
    }),
    new Knight({
        color: 'white',
        position: whiteSecondRow[1],
        isAlive: true
    }),
    new Knight({
        color: 'white',
        position: whiteSecondRow[6],
        isAlive: true
    }),
    new Bishop({
        color: 'white',
        position: whiteSecondRow[2],
        isAlive: true
    }),
    new Bishop({
        color: 'white',
        position: whiteSecondRow[5],
        isAlive: true
    }),
    new Queen({
        color: 'white',
        position: whiteSecondRow[3],
        isAlive: true
    }),
    new King({
        color: 'white',
        position: whiteSecondRow[4],
        isAlive: true
    }),
)

blackPieces.push(
    new Rook({
        color: 'black',
        position: blackSecondRow[0],
        isAlive: true
    }),
    new Rook({
        color: 'black',
        position: blackSecondRow[7],
        isAlive: true
    }),
    new Knight({
        color: 'black',
        position: blackSecondRow[1],
        isAlive: true
    }),
    new Knight({
        color: 'black',
        position: blackSecondRow[6],
        isAlive: true
    }),
    new Bishop({
        color: 'black',
        position: blackSecondRow[2],
        isAlive: true
    }),
    new Bishop({
        color: 'black',
        position: blackSecondRow[5],
        isAlive: true
    }),
    new Queen({
        color: 'black',
        position: blackSecondRow[3],
        isAlive: true
    }),
    new King({
        color: 'black',
        position: blackSecondRow[4],
        isAlive: true
    }),
)

export const selectPiece = (activeColor, clickedPosition) => {
    let position = desk.getDenormalizePosition(clickedPosition)
    switch (activeColor) {
        case 'white':
            for (let piece of whitePieces) {
                if (piece.position === position) {
                    piece.select(whitePieces, blackPieces)
                    return piece
                }
            }
            break
        case 'black':
            for (let piece of blackPieces) {
                if (piece.position === position) {
                    piece.select(blackPieces, whitePieces)
                    return piece
                }
            }
            break
    }
}

export const changeSide = () => {
    if (side.white) {
        side.white = false
        side.black = true
    }
    else {
        side.white = true
        side.black = false
    }
}