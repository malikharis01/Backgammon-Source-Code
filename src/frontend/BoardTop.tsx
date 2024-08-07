import { rollingDice } from "../logic/events/roll-dice";
import Game from "../logic/models/game";
import Player from "../logic/models/player";
import ThisMove from "../logic/models/this-move";
import Bar from "./components/Bar";
import Board from "./components/Board";
import EndBar from "./components/EndBar";
import Piece from "./components/Piece";

interface BoardProps {
  game: Game;
  thisMove: ThisMove;
  select: any;
}
import React, { useRef, useEffect, useState } from 'react';










export default function BoardTop(props: BoardProps) {
  return (
    <div className="board-top">
      <CreateEndBar
        player={props.game.whitePlayer}
        key={"left-bar"}
        {...props}
      />

      <CreateBoard/>
  
      <CreateEndBar
        player={props.game.blackPlayer}
        key={"right-bar"}
        {...props}
      />
    </div>
  );

  function CreateBoard() {
    return (
      <div className="relative">

      <Board>
        
        {props.game.board.map((bar: string[], barIdx: number) => (
          <CreateBar
            bar={bar}
            barIdx={barIdx}
            key={`${barIdx}-temp`}
            {...props}
          />
        ))}
      </Board>
      <div style={{
        position:'absolute',
        left:'55%',
        top:'41%'
      }}>

      <props.Dice/>
      </div>
      </div>
    );
  }

  interface BarProps extends BoardProps {
    bar: string[];
    barIdx: number;
  }

  function CreateBar(props: BarProps) {
    return (
      <div>
      
      
      <Bar
        isTopRow={props.barIdx > 11}
        onClick={() => props.select(props.barIdx)}
        key={props.barIdx}
        fill={
          (props.thisMove.canGoTo.includes(props.barIdx) && "#61EF76") ||
          (props.barIdx % 2 === 0 && props.barIdx > 11 && "#e44f26") ||
          (props.barIdx % 2 !== 0 && props.barIdx <= 11 && "#e44f26") ||
          (props.barIdx % 2 === 0 && props.barIdx <= 11 && "#e0ded7") ||
          (props.barIdx % 2 !== 0 && props.barIdx > 11 && "#e0ded7") ||
          "Red"
        }
      >
        {props.bar.map(
          (piece: string, pieceIdx: number) =>
            pieceIdx < 6 && (
              <CreatePiece
                piece={piece}
                pieceIdx={pieceIdx}
                key={`${props.barIdx}-${pieceIdx}-temp`}
                border={
                  (props.thisMove.fromBarIdx === props.barIdx &&
                    ((pieceIdx === 0 && props.barIdx > 11) ||
                      (pieceIdx === props.bar.length - 1 &&
                        props.barIdx <= 11)) &&
                    "2px solid #671010") ||
                  (piece == "White"
                    ? props.game.whitePlayer.pieceBorderColor
                    : props.game.blackPlayer.pieceBorderColor)
                }
                {...props}
              />
            )
        )}
      </Bar>
      {/* <Dice/> */}
      </div>
    );
  }

  interface EndBarProps extends BoardProps {
    player: Player;
  }

  function CreateEndBar(props: EndBarProps) {
    return (
      <EndBar
        onClick={() => props.select(props.player.endBarIdx)}
        key={props.player.endBarIdx}
        fill={props.player.name === "White" ? "#e0ded7" : "#e44f26"}
      >
        {props.player.endBar.map((piece, pieceIdx) => (
          <CreatePiece
            key={`${props.player.endBarIdx}-${pieceIdx}-temp`}
            bar={props.player.endBar}
            barIdx={props.player.endBarIdx}
            piece={piece}
            pieceIdx={pieceIdx}
            border={props.player.pieceBorderColor}
          />
        ))}
      </EndBar>
    );
  }

  interface PieceProps {
    bar: string[];
    barIdx: number | string;
    piece: string;
    pieceIdx: number;
    border: string;
  }

  function CreatePiece(props: PieceProps) {
    return (
      <Piece
        key={`${props.barIdx}-${props.pieceIdx}`}
        border={props.border}
        color={props.piece}
      >
        {props.bar.length > 6 &&
          ((props.pieceIdx === 0 && props.barIdx > 11) ||
            (props.pieceIdx === 5 && props.barIdx <= 11)) && (
            <>{props.bar.length - 6}</>
          )}
      </Piece>
    );
  }
}
