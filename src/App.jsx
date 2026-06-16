import React, { useState, useEffect, useRef, useCallback } from 'react';
import { LEVELS, createNewBoard, expandRecursive } from './logic/buscaminas';
import { Cell } from './components/Cell';
import { Dashboard } from './components/Dashboard';
import { ModalInstructions } from './components/ModalInstructions';
import { ModalDifficulty } from './components/ModalDifficulty';

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
  const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;

  useEffect(() => {
    const timer = setTimeout(() => setShowInstructions(true), 100); 
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    let interval;
    if (gameState === 'playing') interval = setInterval(() => setTime(t => t + 1), 1000);
    return () => clearInterval(interval);
  }, [gameState]);

  useEffect(() => {
    if (gameState === 'won' || gameState === 'lost') {
      setTimeout(() => topRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 100);
    }
  }, [gameState]);

  const initGame = (levelId) => {
    const config = LEVELS[levelId];
    const [rows, cols, mines] = isMobile ? config.mobile : config.desktop;
    setGridConfig({ rows, cols, initialMines: mines });
    setBoard(createNewBoard(rows, cols, mines));
    setLevel(levelId);
    setGameState('playing');
    setMinesLeft(mines);
    setTime(0);
  };

  // Refs sincronizadas vía useEffect para evitar mutaciones durante el render (React 19)
  const timeRef = useRef(time);
  const recordsRef = useRef(records);

  useEffect(() => {
    timeRef.current = time;
  }, [time]);

  useEffect(() => {
    recordsRef.current = records;
  }, [records]);

  const handleReveal = useCallback((id) => {
    if (gameState !== 'playing' || board[id].isRevealed || board[id].hasFlag || board[id].hasQuestion) return;
    
    // Clonar celdas para evitar mutaciones del estado original (necesario para React.memo)
    let newBoard = board.map(c => ({...c}));
    if (newBoard[id].hasMine) {
      setGameState('lost');
      newBoard.forEach(c => { if (c.hasMine) c.isRevealed = true; });
    } else {
      expandRecursive(newBoard, id, gridConfig.rows, gridConfig.cols);
      const totalCells = gridConfig.rows * gridConfig.cols;
      const revealedCount = newBoard.filter(c => c.isRevealed).length;
      if (revealedCount === totalCells - gridConfig.initialMines) {
        setGameState('won');
        const key = `cells_${totalCells}`;
        if (!recordsRef.current[key] || timeRef.current < recordsRef.current[key]) {
          const nr = { ...recordsRef.current, [key]: timeRef.current };
          setRecords(nr);
          localStorage.setItem('buscaminas_records', JSON.stringify(nr));
        }
      }
    }
    setBoard(newBoard);
  }, [gameState, board, gridConfig]);

  const handleContextMenu = useCallback((e, id) => {
    e.preventDefault();
    if (gameState !== 'playing' || board[id].isRevealed) return;
    let newBoard = [...board];
    newBoard[id] = {...newBoard[id]};
    const cell = newBoard[id];
    if (!cell.hasFlag && !cell.hasQuestion) { cell.hasFlag = true; setMinesLeft(p => p - 1); }
    else if (cell.hasFlag) { cell.hasFlag = false; cell.hasQuestion = true; setMinesLeft(p => p + 1); }
    else { cell.hasQuestion = false; }
    setBoard(newBoard);
  }, [gameState, board]);

  return (
    <div className="w-full flex justify-center">
      <main ref={topRef} className="w-full max-w-250 flex flex-col items-center p-4 desktop:mt-12.5">
        <Dashboard 
          minesLeft={minesLeft} time={time} records={records} gameState={gameState}
          onResetRecords={() => { localStorage.removeItem('buscaminas_records'); setRecords({}); }}
          onShowInstructions={() => setShowInstructions(true)}
          onNewGame={() => setLevel(null)}
        />

        <section className="w-full flex justify-center pb-10">
          {level && (
            <div className="border-grid-main grid gap-0 w-full tablet:w-fit" style={{ gridTemplateColumns: isMobile ? `repeat(${gridConfig.cols}, minmax(0, 1fr))` : `repeat(${gridConfig.cols}, 1.875rem)` }}>
              {board.map(cell => (
                <Cell key={cell.id} cell={cell} onReveal={handleReveal} onFlag={handleContextMenu} />
              ))}
            </div>
          )}
        </section>

        <ModalDifficulty isOpen={!level} levels={LEVELS} onSelectLevel={initGame} isMobile={isMobile} />
        <ModalInstructions isOpen={showInstructions} onClose={() => setShowInstructions(false)} />
      </main>
    </div>
  );
}

export default App;