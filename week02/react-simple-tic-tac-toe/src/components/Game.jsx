import { useState } from 'react'
const memoBoard = new Array(9).fill(null);
console.log(memoBoard);
function Square({ value, onClick }) {

    return(
        <div 
            className="border border-black box-border flex justify-center items-center w-16 h-16"
            onClick={onClick}
            >
            {value}
        </div>
    );
}

function Board({ isXNext, board, onPlay }) {
    function handleClick(i) {
        if(board[i] || calculateWinner(board)) return;    
        const nextBoard = board.slice();
        if(isXNext) {
            nextBoard[i] = 'X';
        } else {
            nextBoard[i] = 'O';
        }
        onPlay(nextBoard)
    }

    const winner = calculateWinner(board);
    let status;
    if(winner) {
        status = 'Winner: ' + winner;
    } else {
        status = `Next player: ${isXNext ? 'X' : 'O'}`;
    }
    console.log('board:', board);
    return(
        <>
            <p className='text-2xl font-bold mb-0.5'>{status}</p>
            <div className="grid grid-cols-3 border-black border w-fit">
                {board.map((square, index) => (
                    <Square key={index} onClick={() => handleClick(index)} value={board[index]} />
                ))}
            </div>
        </>
        
    );
}

const Game = () => {
    const [history, setHistory] = useState([Array(9).fill(null)]);
    const [currentMove, setCurrentMove] = useState(0);
    const isXNext = currentMove % 2 === 0;
    const currentBoard = history[currentMove];

    function handlePlay(nextBoard) {
        const nextHistory = [...history.splice(0, currentMove + 1), nextBoard];
        setHistory(nextHistory);
        setCurrentMove(nextHistory.length - 1);
    }

    function jumpTo(nextMove) {
        setCurrentMove(nextMove);
    }

    const moves = history.map((board, move) => {
        let desc;
        if(move > 0) {
            desc = 'Go to #' + move + ' move';
        } else {
            desc = 'Restart game';
        }

        return(
            <li key={move} className='mt-1.5'>
                <button className='border border-black rounded-2xl p-1' onClick={() => jumpTo(move)}>{desc}</button>
            </li>
        );
    });


  return (
    <>
        <div className="flex flex-1 items-center flex-col">
            <Board isXNext={isXNext} board={currentBoard} onPlay={handlePlay}/>
            <ol className='flex justify-center items-center flex-col'>
                {moves}
            </ol>
        </div>
    </>
  );
}

function calculateWinner(board) {
    const winningLines = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6]
    ];
    for(let i=0; i < winningLines.length; i++) {
        const [a, b, c] = winningLines[i];
        if(board[a] && board[a] === board[b] && board[b] === board[c]) {
            return board[a];
        }
    }
    return null;
}

export default Game;