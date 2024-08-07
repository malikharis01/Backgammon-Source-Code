import { useEffect, useRef, useState } from "react";
import { toast } from "react-hot-toast";
import "./App.css";
import { backgammon, startingGame } from "./logic/events/start-game";
import { rollingDice } from "./logic/events/roll-dice";
import { selecting } from "./logic/events/select";
import BoardBottom from "./frontend/BoardBottom";
import ThisTurn from "./logic/models/this-turn";
import Game from "./logic/models/game";
import ThisMove from "./logic/models/this-move";
import BoardTop from "./frontend/BoardTop";
import { checkCantMove } from "./logic/calculations/calc-possible-moves";

export const toastStyle = (thisTurn: ThisTurn) => {
  return {
    style: {
      borderRadius: "10px",
      background: thisTurn.turnPlayer.name,
      color: thisTurn.opponentPlayer.name,
      border:
        thisTurn.turnPlayer.name === "White"
          ? "2px solid black"
          : "2px solid white",
    },
  };
};

function App() {
  const Dice: React.FC<{ diceValues: number[] }> = ({ diceValues }) => {
    const canvasRef1 = useRef<HTMLCanvasElement>(null);
    const canvasRef2 = useRef<HTMLCanvasElement>(null);
  
    const drawDice = (ctx: CanvasRenderingContext2D, value: number) => {
      ctx.clearRect(0, 0, 70, 70);
      ctx.fillStyle = 'white';
      ctx.fillRect(0, 0, 70, 70);
      ctx.strokeRect(0, 0, 70, 70);
      ctx.fillStyle = 'black';
  
      const drawDot = (x: number, y: number) => {
        ctx.beginPath();
        ctx.arc(x, y, 5, 0, Math.PI * 2);
        ctx.fill();
      };
  
      switch (value) {
        case 1:
          drawDot(35, 35);
          break;
        case 2:
          drawDot(17.5, 17.5);
          drawDot(52.5, 52.5);
          break;
        case 3:
          drawDot(17.5, 17.5);
          drawDot(35, 35);
          drawDot(52.5, 52.5);
          break;
        case 4:
          drawDot(17.5, 17.5);
          drawDot(52.5, 17.5);
          drawDot(17.5, 52.5);
          drawDot(52.5, 52.5);
          break;
        case 5:
          drawDot(17.5, 17.5);
          drawDot(52.5, 17.5);
          drawDot(35, 35);
          drawDot(17.5, 52.5);
          drawDot(52.5, 52.5);
          break;
        case 6:
          drawDot(17.5, 17.5);
          drawDot(52.5, 17.5);
          drawDot(17.5, 35);
          drawDot(52.5, 35);
          drawDot(17.5, 52.5);
          drawDot(52.5, 52.5);
          break;
        default:
          break;
      }
    };
  
    useEffect(() => {
      const ctx1 = canvasRef1.current?.getContext('2d');
      const ctx2 = canvasRef2.current?.getContext('2d');
  
      if (ctx1 && ctx2) {
        drawDice(ctx1, diceValues[0] && diceValues[0]);
        drawDice(ctx2, diceValues[1] && diceValues[1]);
      }
    }, [diceValues]);
  
    return (
      <div>
        <canvas ref={canvasRef1} width={70} height={70} style={{ borderRadius: '10px', border: '1px solid black' }}></canvas>
        <canvas ref={canvasRef2} width={70} height={70} style={{ borderRadius: '10px', border: '1px solid black' }}></canvas>
      </div>
    );
  };
  
  
  const [game, setGame] = useState(Game.new);
  const [thisTurn, setThisTurn] = useState(ThisTurn.new);
  const [thisMove, setThisMove] = useState(ThisMove.new);
  const [diceValues, setDiceValues] = useState<number[]>([1, 1]);


  window.onload = () => backgammon();

  function startGame() {
    const tempGame = Game.new();
    tempGame.gameOn = true;
    setGame(tempGame);

    const tempThisTurn = startingGame(game.clone());
    setThisTurn(tempThisTurn);

    const tempThisMove = ThisMove.new();
    setThisMove(tempThisMove);
  }

  function rollDice() {
    if (thisTurn.rolledDice) {
      toast.error(
        `Play your move first
          ${thisTurn.turnPlayer.icon} 🎲 ${thisTurn.dices} 🎲`,
        toastStyle(thisTurn)
      );

      return;
    }

    const { thisTurn: returnedThisTurn, rolledDices } = rollingDice(thisTurn.clone());
    let m = returnedThisTurn
    if (returnedThisTurn.rolledDice) {
      m = checkCantMove(game, returnedThisTurn.clone());
    }

    setThisTurn(m);
    setDiceValues(rolledDices);
  }

  function select(index: number | string) {
    const [returnedGame, returnedThisTurn, returnedThisMove] = selecting(
      index,
      game.clone(),
      thisTurn.clone(),
      thisMove.clone()
    );

    setGame(returnedGame);
    setThisTurn(returnedThisTurn);
    setThisMove(returnedThisMove);
  }

  return (
    <>
      <BoardTop game={game} thisMove={thisMove} select={select} Dice={() => <Dice diceValues={diceValues} />} />

    
      <BoardBottom
        game={game}
        thisMove={thisMove}
        rollDice={rollDice}
        startGame={startGame}
        select={select}

      />
    </>
  );
}

export default App;
