import React, { useRef } from 'react';
import flagIcon from '../assets/img/flag.svg';
import markIcon from '../assets/img/mark.svg';
import mineIcon from '../assets/img/mine.svg';

export const Cell = ({ cell, onClick, onContextMenu }) => {
  const timerRef = useRef(null);

  const getNumberColor = (num) => {
    const colors = { 1: "blue", 2: "green", 3: "red", 4: "brown", 5: "navy", 6: "purple", 7: "purple", 8: "purple" };
    return colors[num] || "black";
  };

  const handleTouchStart = (e) => {
    if (cell.isRevealed) return;
    if (e.cancelable) e.preventDefault(); 
    if (!timerRef.current) {
      timerRef.current = setTimeout(() => {
        onClick(); 
        timerRef.current = null;
      }, 250); // Margen de 250ms
    } else {
      clearTimeout(timerRef.current);
      timerRef.current = null;
      onContextMenu(e);
    }
  };

  const handlePointerUp = (e) => {
    if (e.pointerType === 'mouse' && e.button === 0) onClick();
  };

  return (
    <div
      onPointerUp={handlePointerUp}
      onContextMenu={onContextMenu}
      onTouchStart={handleTouchStart}
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