export const LEVELS = {
    1: { name: "Principiante", desktop: [9, 9, 10], mobile: [9, 9, 10] },
    2: { name: "Intermedio", desktop: [16, 16, 40], mobile: [32, 8, 40] },
    3: { name: "Experto", desktop: [16, 30, 99], mobile: [60, 8, 99] },
};

export const createNewBoard = (rows, cols, mines) => {
    let cells = Array.from({ length: rows * cols }, (_, i) => ({
        id: i,
        row: Math.floor(i / cols),
        col: i % cols,
        hasMine: false,
        isRevealed: false,
        hasFlag: false,
        hasQuestion: false,
        neighbors: 0
    }));

    // Algoritmo de Fisher-Yates
    let positions = Array.from({ length: rows * cols }, (_, i) => i);
    for (let i = positions.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [positions[i], positions[j]] = [positions[j], positions[i]];
    }

    // Seleccionamos las primeras N posiciones barajadas
    positions.slice(0, mines).forEach(pos => {
        cells[pos].hasMine = true;
    });

    // Calcular números de minas adyacentes
    return cells.map(cell => {
        if (cell.hasMine) return cell;
        let count = 0;
        for (let r = -1; r <= 1; r++) {
            for (let c = -1; c <= 1; c++) {
                const nr = cell.row + r, nc = cell.col + c;
                if (nr >= 0 && nr < rows && nc >= 0 && nc < cols) {
                    if (cells[nr * cols + nc].hasMine) count++;
                }
            }
        }
        return { ...cell, neighbors: count };
    });
};

export const expandRecursive = (newBoard, cellId, rows, cols) => {
    const cell = newBoard[cellId];
    if (cell.isRevealed || cell.hasFlag || cell.hasQuestion) return;

    newBoard[cellId].isRevealed = true;

    if (cell.neighbors === 0) {
        for (let r = -1; r <= 1; r++) {
            for (let c = -1; c <= 1; c++) {
                const nr = cell.row + r, nc = cell.col + c;
                if (nr >= 0 && nr < rows && nc >= 0 && nc < cols) {
                    expandRecursive(newBoard, nr * cols + nc, rows, cols);
                }
            }
        }
    }
};