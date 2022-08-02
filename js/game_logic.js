import Desk from "./classes/desk.js";
import {Bishop, King, Knight, Pawn, Queen, Rook} from "./classes/piece.js";
import {shahOutline} from "./game_view.js";


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
            desk: desk,
            color: 'white',
            position: whiteFirstRow[i],
            isAlive: true
        })
    )
    blackPieces.push(
        new Pawn({
            desk: desk,
            color: 'black',
            position: blackFirstRow[i],
            isAlive: true
        })
    )
}

whitePieces.push(
    new Rook({
        desk: desk,
        color: 'white',
        position: whiteSecondRow[0],
        isAlive: true
    }),
    new Rook({
        desk: desk,
        color: 'white',
        position: whiteSecondRow[7],
        isAlive: true
    }),
    new Knight({
        desk: desk,
        color: 'white',
        position: whiteSecondRow[1],
        isAlive: true
    }),
    new Knight({
        desk: desk,
        color: 'white',
        position: whiteSecondRow[6],
        isAlive: true
    }),
    new Bishop({
        desk: desk,
        color: 'white',
        position: whiteSecondRow[2],
        isAlive: true
    }),
    new Bishop({
        desk: desk,
        color: 'white',
        position: whiteSecondRow[5],
        isAlive: true
    }),
    new Queen({
        desk: desk,
        color: 'white',
        position: whiteSecondRow[3],
        isAlive: true
    }),
    new King({
        desk: desk,
        color: 'white',
        position: whiteSecondRow[4],
        isAlive: true
    }),
)

blackPieces.push(
    new Rook({
        desk: desk,
        color: 'black',
        position: blackSecondRow[0],
        isAlive: true
    }),
    new Rook({
        desk: desk,
        color: 'black',
        position: blackSecondRow[7],
        isAlive: true
    }),
    new Knight({
        desk: desk,
        color: 'black',
        position: blackSecondRow[1],
        isAlive: true
    }),
    new Knight({
        desk: desk,
        color: 'black',
        position: blackSecondRow[6],
        isAlive: true
    }),
    new Bishop({
        desk: desk,
        color: 'black',
        position: blackSecondRow[2],
        isAlive: true
    }),
    new Bishop({
        desk: desk,
        color: 'black',
        position: blackSecondRow[5],
        isAlive: true
    }),
    new Queen({
        desk: desk,
        color: 'black',
        position: blackSecondRow[3],
        isAlive: true
    }),
    new King({
        desk: desk,
        color: 'black',
        position: blackSecondRow[4],
        isAlive: true
    }),
)

export const [whiteKing, blackKing] = [whitePieces[15], blackPieces[15]]

export const selectPiece = (activeColor, clickedPosition) => {
    let position = desk.getDenormalizePosition(clickedPosition)
    switch (activeColor) {
        case 'white':
            for (let piece of whitePieces) {
                if (piece.isAlive && piece.position === position) {
                    piece.select(whitePieces, blackPieces)
                    return piece
                }
            }
            break
        case 'black':
            for (let piece of blackPieces) {
                if (piece.isAlive && piece.position === position) {
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
    let isShah = checkShah()

    // console.log(isShah, side.white ? 'w' : 'b')
    if (isShah) shahOutline(side.white ? whiteKing : blackKing)
    console.log('\n\n-------------------------------------\n\n')
}

const checkShah = () => {
    // console.log(whiteKing, blackKing)
    if (side.white){
        desk.setCellsDanger(whitePieces, blackPieces)
        return whiteKing.isShah()
    }
    desk.setCellsDanger(blackPieces, whitePieces)
    return blackKing.isShah()
}

