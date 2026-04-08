import React from 'react';
import flagIcon from '../assets/img/flag.svg';
import markIcon from '../assets/img/mark.svg';
import mineIcon from '../assets/img/mine.svg';

export const Cell = ({ cell, onClick, onContextMenu }) => {
  const getNumberColor = (num) => {
    const colors = { 1: "blue", 2: "green", 3: "red", 4: "brown", 5: "navy", 6: "purple", 7: "purple", 8: "purple" };
    return colors[num] || "black";
  };

  return (
    <div
      onClick={onClick}
      onContextMenu={onContextMenu}
      className={`
        w-full tablet:w-[30px] h-full tablet:h-[30px] aspect-square
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
          <img src={mineIcon} className="w-[65%] h-[65%]" alt="mine" />
        ) : (
          cell.neighbors || ''
        )
      ) : (
        <>
          {cell.hasFlag && <img src={flagIcon} className="w-[65%] h-[65%]" alt="flag" />}
          {cell.hasQuestion && <img src={markIcon} className="w-[65%] h-[65%]" alt="mark" />}
        </>
      )}
    </div>
  );
};