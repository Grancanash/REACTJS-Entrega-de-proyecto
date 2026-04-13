import React, { useRef } from 'react';
import flagIcon from '../assets/img/flag.svg';
import markIcon from '../assets/img/mark.svg';
import mineIcon from '../assets/img/mine.svg';

export const Cell = ({ cell, onClick, onContextMenu }) => {
  const timerRef = useRef(null);
  
  // Referencias para detectar el movimiento del dedo (Scroll)
  const touchStartPos = useRef({ x: 0, y: 0 });
  const isScrollAction = useRef(false);

  const getNumberColor = (num) => {
    const colors = { 1: "blue", 2: "green", 3: "red", 4: "brown", 5: "navy", 6: "purple", 7: "purple", 8: "purple" };
    return colors[num] || "black";
  };

  // 1. Cuando el dedo toca la pantalla
  const handleTouchStart = (e) => {
    if (cell.isRevealed) return;
    
    // Guardamos la posición inicial
    touchStartPos.current = {
      x: e.touches[0].clientX,
      y: e.touches[0].clientY
    };
    isScrollAction.current = false;
  };

  // 2. Mientras el dedo se mueve por la pantalla
  const handleTouchMove = (e) => {
    if (isScrollAction.current) return;

    const deltaX = Math.abs(e.touches[0].clientX - touchStartPos.current.x);
    const deltaY = Math.abs(e.touches[0].clientY - touchStartPos.current.y);

    // Si se mueve más de 10px en cualquier dirección, es un SCROLL
    if (deltaX > 10 || deltaY > 10) {
      isScrollAction.current = true;
      // Si había un temporizador de click en marcha, lo matamos
      if (timerRef.current) {
        clearTimeout(timerRef.current);
        timerRef.current = null;
      }
    }
  };

  // 3. Cuando el dedo se levanta (aquí decidimos qué hacer)
  const handleTouchEnd = (e) => {
    if (cell.isRevealed || isScrollAction.current) {
      isScrollAction.current = false;
      return; // Si fue scroll, no hacemos NADA
    }

    // Si llegamos aquí, es un toque estático (intención de jugar)
    if (!timerRef.current) {
      // PRIMER TOQUE
      timerRef.current = setTimeout(() => {
        onClick(); // Revelar
        timerRef.current = null;
      }, 200); // Tu tiempo de 250ms
    } else {
      // SEGUNDO TOQUE (Doble tap para bandera)
      clearTimeout(timerRef.current);
      timerRef.current = null;
      onContextMenu(e);
    }
  };

  const handlePointerUp = (e) => {
    // El ratón no suele tener este problema de scroll accidental como el dedo
    if (e.pointerType === 'mouse' && e.button === 0) onClick();
  };

  return (
    <div
      onPointerUp={handlePointerUp}
      onContextMenu={onContextMenu}
      // Eventos táctiles refinados
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      
      className={`
        w-full h-full aspect-square tablet:w-7.5 tablet:h-7.5
        flex items-center justify-center text-xl select-none leading-none
        ${cell.isRevealed 
          ? 'bg-mines-white border border-mines-grey-light' 
          : 'bg-mines-grey-superlight border-cell-normal hover:bg-mines-grey-light active:bg-mines-grey-dark'
        }
      `}
      style={{
        color: cell.isRevealed && !cell.hasMine ? getNumberColor(cell.neighbors) : 'inherit',
        fontWeight: 500
      }}
    >
      {cell.isRevealed ? (
        cell.hasMine ? (
          <img src={mineIcon} className="w-4.5 h-4.5" alt="mine" />
        ) : (
          cell.neighbors || ''
        )
      ) : (
        <>
          {cell.hasFlag && <img src={flagIcon} className="w-4.5 h-4.5" alt="flag" />}
          {cell.hasQuestion && <img src={markIcon} className="w-4.5 h-4.5" alt="mark" />}
        </>
      )}
    </div>
  );
};