import resetIcon from '../assets/img/reset.svg';
import { LEVELS } from '../logic/buscaminas';


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
  const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;

  const rows2 = isMobile ? LEVELS[2]['mobile'][0] : LEVELS[2]['desktop'][0];
  const cols2 = isMobile ? LEVELS[2]['mobile'][1] : LEVELS[2]['desktop'][1];
  const rows3 = isMobile ? LEVELS[3]['mobile'][0] : LEVELS[3]['desktop'][0];
  const cols3 = isMobile ? LEVELS[3]['mobile'][1] : LEVELS[3]['desktop'][1];

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
      <div className="w-full tablet:flex-1 bg-mines-blue-light border border-mines-grey-light rounded-md min-h-40 tablet:h-50 flex flex-col items-center justify-center text-center gap-1 px-4">
        {/* Estadísticas siempre visibles */}
        <div className="text-left">
          <p className="flex items-center text-lg font-semibold text-slate-700 uppercase leading-none">MINAS RESTANTES:
            <span className={`font-digital text-black ml-4 leading-none transition-all duration-500 ${!isPlaying ? 'text-3xl' : 'text-5xl'}`}>{minesLeft}</span>
          </p>
          <p className="flex items-center text-lg font-semibold text-slate-700 mt-4 uppercase leading-none">TIEMPO:
            <span className={`font-digital text-black ml-4 leading-none transition-all duration-500 ${!isPlaying ? 'text-3xl' : 'text-5xl'}`}>{formatTime(time)}</span>
          </p>
        </div>
        {/* Resultado — solo visible al terminar partida */}
        <div className={`transition-all duration-500 overflow-hidden ${!isPlaying ? 'opacity-100 max-h-24 mt-3' : 'opacity-0 max-h-0'}`}>
          <h3 className={`text-2xl font-bold uppercase tracking-tighter mb-2 ${gameState === 'won' ? 'text-green-800' : 'text-red-600'}`}>
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
            <span>{`${rows2}x${cols2}`}:</span> <span className="font-digital text-slate-500 text-3xl tracking-tighter">{formatTime(records["cells_" + (rows2*cols2)] || 0)}</span>
          </div>
          <div className="flex justify-between items-center">
            <span>{`${rows3}x${cols3}`}:</span> <span className="font-digital text-slate-500 text-3xl tracking-tighter">{formatTime(records["cells_" + (rows3*cols3)] || 0)}</span>
          </div>
        </div>
      </div>
    </header>
  );
};