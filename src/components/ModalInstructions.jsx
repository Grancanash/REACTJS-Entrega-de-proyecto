import React from 'react';

export const ModalInstructions = ({ isOpen, onClose }) => {
  return (
    <div className={`fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50 transition-all duration-500 ${isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}>
      <div className="bg-white p-8 rounded-lg shadow-2xl max-w-md w-full border-t-8 border-mines-blue text-center">
        <h2 className="text-2xl font-bold mb-6 text-mines-blue uppercase tracking-tighter">Cómo jugar</h2>
        <ul className="text-left text-slate-600 space-y-4 text-lg font-semibold mb-12 list-disc pl-6">
          <li>Haz clic para descubrir una casilla.</li>
          <li>Evita las minas ocultas.</li>
          <li>Los números indican minas alrededor.</li>
          <li>Clic derecho para marcar la celda con banderas o interrogantes (Doble click en pantallas táctiles).</li>
        </ul>
        <button 
          onClick={onClose} 
          className="w-full bg-mines-blue text-white py-4 rounded font-bold cursor-pointer uppercase tracking-tight"
        >
          Aceptar
        </button>
      </div>
    </div>
  );
};