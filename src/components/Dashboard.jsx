import React from 'react';
import resetIcon from '../assets/img/reset.svg';

export const Dashboard = ({ 
  minesLeft, 
  time, 
  records, 
  onResetRecords, 
  onShowInstructions, 
  gameState, 
  onNewGame 
}) => {
  const formatTime = (s) => {
    const min = Math.floor(s / 60).toString().padStart(2, '0');
    const sec = (s % 60).toString().padStart(2, '0');
    return `00:${min}:${sec}`;
  };

  const isPlaying = gameState === 'playing' || gameState === 'waiting';

  return (
    <header className="flex flex-col tablet:flex-row gap-2 tablet:gap-1 mb-8 w-full">
      {/* IZQUIERDA: TITULO */}
      <div className="w-full tablet:flex-1 bg-mines-blue-light border border-mines-grey-light rounded-md p-6 flex flex-col items-center justify-center tablet:h-50">
        <h1 className="text-mines-blue text-4xl font-bold tracking-tighter leading-none uppercase">BUSCAMINAS</h1>
        <button 
          onClick={onShowInstructions}
          className="mt-6 bg-[#f6f6f6] border border-[#dddddd] px-6 py-2 rounded text-lg text-mines-blue hover:bg-mines-blue hover:text-white transition-all shadow-sm cursor-pointer font-semibold uppercase"
        >
          Instrucciones
        </button>
      </div>

      {/* CENTRO: INFO/RESULTADO */}
      <div className="w-full tablet:flex-1 bg-mines-blue-light border border-mines-grey-light rounded-md min-h-40 tablet:h-50 relative overflow-hidden text-center">
        <div className={`absolute inset-0 flex flex-col items-center justify-center transition-all duration-500 ${isPlaying ? 'opacity-100' : 'opacity-0 pointer-events-none translate-y-4'}`}>
          <div className="text-left">
            <p className="flex items-center text-lg font-semibold text-slate-700 uppercase leading-none">MINAS RESTANTES: 
              <span className="font-digital text-black text-5xl ml-4 leading-none">{minesLeft}</span>
            </p>
            <p className="flex items-center text-lg font-semibold text-slate-700 mt-4 uppercase leading-none">TIEMPO: 
              <span className="font-digital text-black text-5xl ml-4 leading-none">{formatTime(time)}</span>
            </p>
          </div>
        </div>
        <div className={`absolute inset-0 flex flex-col items-center justify-center transition-all duration-500 ${!isPlaying ? 'opacity-100' : 'opacity-0 pointer-events-none -translate-y-4'}`}>
          <h3 className={`text-3xl font-bold uppercase tracking-tighter mb-4 ${gameState === 'won' ? 'text-green-800' : 'text-red-600'}`}>
            {gameState === 'won' ? '¡Enhorabuena!' : '¡Has fallado!'}
          </h3>
          <button onClick={onNewGame} className="bg-white border border-slate-300 px-6 py-2 rounded text-slate-800 font-bold hover:bg-slate-50 transition-all shadow-sm cursor-pointer uppercase text-sm">
            Nueva Partida
          </button>
        </div>
      </div>

      {/* DERECHA: RECORDS */}
      <div className="w-full tablet:flex-1 bg-mines-blue-light border border-mines-grey-light rounded-md p-6 flex flex-col justify-center tablet:h-50">
        <p className="text-xl font-bold mb-4 flex items-center justify-center gap-4 text-slate-700 uppercase text-center">
          Récords <img src={resetIcon} onClick={onResetRecords} className="w-6 h-6 cursor-pointer hover:rotate-180 transition-transform duration-500" alt="reset" />
        </p>
        <div className="text-slate-700 font-bold text-lg uppercase">
          <div className="flex justify-between items-center border-b border-slate-200">
            <span>9x9:</span> <span className="font-digital text-slate-500 text-3xl tracking-tighter">{formatTime(records.cells_81 || 0)}</span>
          </div>
          <div className="flex justify-between items-center border-b border-slate-200">
            <span>16x16 (32x8):</span> <span className="font-digital text-slate-500 text-3xl tracking-tighter">{formatTime(records.cells_256 || 0)}</span>
          </div>
          <div className="flex justify-between items-center">
            <span>16x30 (70x8):</span> <span className="font-digital text-slate-500 text-3xl tracking-tighter">{formatTime(records.cells_480 || 0)}</span>
          </div>
        </div>
      </div>
    </header>
  );
};