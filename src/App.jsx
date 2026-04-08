import React, { useState, useEffect, useRef } from 'react';
import { LEVELS, createNewBoard } from './logic/buscaminas';
import { Cell } from './components/Cell';
import { Dashboard } from './components/Dashboard';

function App() {
  const [level, setLevel] = useState(null);
  const [gridConfig, setGridConfig] = useState({ rows: 0, cols: 0, initialMines: 0 });
  const [board, setBoard] = useState([]);
  const [gameState, setGameState] = useState('waiting'); 
  const [minesLeft, setMinesLeft] = useState(0);
  const [time, setTime] = useState(0);
  const [showInstructions, setShowInstructions] = useState(false);
  const [records, setRecords] = useState(() => JSON.parse(localStorage.getItem('buscaminas_records')) || {});

  const topRef = useRef(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowInstructions(true);
    }, 100); 
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    let interval;
    if (gameState === 'playing') interval = setInterval(() => setTime(t => t + 1), 1000);
    return () => clearInterval(interval);
  }, [gameState]);

  useEffect(() => {
    if (gameState === 'won' || gameState === 'lost') {
      setTimeout(() => {
        topRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 100);
    }
  }, [gameState]);

  const initGame = (levelId) => {
    const isMobile = window.innerWidth < 768;
    const config = LEVELS[levelId];
    const [rows, cols, mines] = isMobile ? config.mobile : config.desktop;

    setGridConfig({ rows, cols, initialMines: mines });
    setBoard(createNewBoard(rows, cols, mines));
    setLevel(levelId);
    setGameState('playing');
    setMinesLeft(mines);
    setTime(0);
  };

  const handleReveal = (id) => {
    if (gameState !== 'playing' || board[id].isRevealed || board[id].hasFlag || board[id].hasQuestion) return;
    
    let newBoard = [...board];
    if (newBoard[id].hasMine) {
      setGameState('lost');
      newBoard.forEach(c => { if (c.hasMine) c.isRevealed = true; });
      setBoard(newBoard);
      return;
    }
    const floodFill = (cellId) => {
      if (newBoard[cellId].isRevealed || newBoard[cellId].hasFlag) return;
      newBoard[cellId].isRevealed = true;
      if (newBoard[cellId].neighbors === 0) {
        const cell = newBoard[cellId];
        for (let r = -1; r <= 1; r++) {
          for (let c = -1; c <= 1; c++) {
            const nr = cell.row + r, nc = cell.col + c;
            if (nr >= 0 && nr < gridConfig.rows && nc >= 0 && nc < gridConfig.cols) 
              floodFill(nr * gridConfig.cols + nc);
          }
        }
      }
    };
    floodFill(id);
    setBoard(newBoard);
    const totalCells = gridConfig.rows * gridConfig.cols;
    const revealedCount = newBoard.filter(c => c.isRevealed).length;
    if (revealedCount === totalCells - gridConfig.initialMines) {
      setGameState('won');
      saveRecord(totalCells);
    }
  };

  const handleContextMenu = (e, id) => {
    e.preventDefault();
    if (gameState !== 'playing' || board[id].isRevealed) return;
    let newBoard = [...board];
    const cell = newBoard[id];
    if (!cell.hasFlag && !cell.hasQuestion) { cell.hasFlag = true; setMinesLeft(p => p - 1); }
    else if (cell.hasFlag) { cell.hasFlag = false; cell.hasQuestion = true; setMinesLeft(p => p + 1); }
    else { cell.hasQuestion = false; }
    setBoard(newBoard);
  };

  const saveRecord = (totalCells) => {
    const key = `cells_${totalCells}`;
    if (!records[key] || time < records[key]) {
      const nr = { ...records, [key]: time };
      setRecords(nr);
      localStorage.setItem('buscaminas_records', JSON.stringify(nr));
    }
  };

  return (
    <div className="w-full flex justify-center">
      <main ref={topRef} className="w-full max-w-250 flex flex-col items-center p-4 desktop:mt-12.5">
        
        <Dashboard 
          minesLeft={minesLeft} 
          time={time} 
          records={records} 
          gameState={gameState}
          onResetRecords={() => { localStorage.removeItem('buscaminas_records'); setRecords({}); }}
          onShowInstructions={() => setShowInstructions(true)}
          onNewGame={() => setLevel(null)}
        />

        <section className="w-full flex justify-center pb-10">
          {level && (
            <div className="border-grid-main grid gap-0 w-full tablet:w-fit" style={{ gridTemplateColumns: window.innerWidth < 768 ? `repeat(${gridConfig.cols}, minmax(0, 1fr))` : `repeat(${gridConfig.cols}, 30px)` }}>
              {board.map(cell => (
                <Cell key={cell.id} cell={cell} onClick={() => handleReveal(cell.id)} onContextMenu={(e) => handleContextMenu(e, cell.id)} />
              ))}
            </div>
          )}
        </section>

        <div className={`fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-40 transition-all duration-500 ${!level ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}>
          <div className="bg-white p-12 rounded-lg shadow-2xl flex flex-col gap-6 border-t-8 border-mines-blue text-center w-full max-w-fit">
            <h2 className="text-mines-blue text-3xl font-bold uppercase tracking-tighter">Tamaño del tablero</h2>
            {Object.entries(LEVELS).map(([id, config]) => (
              <button key={id} onClick={() => initGame(id)} className="bg-[#f6f6f6] border border-[#dddddd] px-12 py-5 rounded text-xl text-mines-blue hover:bg-mines-blue hover:text-white transition-all shadow-md font-bold cursor-pointer uppercase">
                {config.name}<br/><span className="text-lg font-normal opacity-60 normal-case">{window.innerWidth < 768 ? `${config.mobile[0]}x${config.mobile[1]}` : `${config.desktop[0]}x${config.desktop[1]}`} celdas</span>
              </button>
            ))}
          </div>
        </div>

        <div className={`fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50 transition-all duration-500 ${showInstructions ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}>
          <div className="bg-white p-8 rounded-lg shadow-2xl max-w-md w-full border-t-8 border-mines-blue text-center">
            <h2 className="text-2xl font-bold mb-6 text-mines-blue uppercase tracking-tighter">Cómo jugar</h2>
            <ul className="text-left text-slate-600 space-y-2 text-lg font-semibold mb-12">
              <li>• Haz clic para descubrir una casilla.</li>
              <li>• Evita las minas ocultas.</li>
              <li>• Los números indican minas alrededor.</li>
              <li>• Clic derecho para bandera o interrogante.</li>
            </ul>
            <button onClick={() => setShowInstructions(false)} className="w-full bg-mines-blue text-white py-4 rounded font-bold cursor-pointer uppercase tracking-tight">Aceptar</button>
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;