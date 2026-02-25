import { useState, useMemo, useEffect } from 'react';
import Confetti from 'react-confetti';
import SudokuCell from './SudokuCell';
import { generatePuzzle, createEmptyBoard } from '../utils/sudoku';

export default function SudokuGrid({ isPlaying, setIsPlaying }) {
    const [board, setBoard] = useState(createEmptyBoard());
    const [initialPuzzle, setInitialPuzzle] = useState(createEmptyBoard());
    const [selectedCell, setSelectedCell] = useState(null);
    const [showVictory, setShowVictory] = useState(false);
    const [difficulty, setDifficulty] = useState('Medium');
    const [timeElapsed, setTimeElapsed] = useState(0);

    // Timer Logic
    useEffect(() => {
        let timer;
        if (isPlaying && !showVictory) {
            timer = setInterval(() => {
                setTimeElapsed((prev) => prev + 1);
            }, 1000);
        }
        return () => clearInterval(timer);
    }, [isPlaying, showVictory]);

    const formatTime = (seconds) => {
        const m = Math.floor(seconds / 60).toString().padStart(2, '0');
        const s = (seconds % 60).toString().padStart(2, '0');
        return `${m}:${s}`;
    };

    const playVictorySound = () => {
        if (!window.AudioContext && !window.webkitAudioContext) return;
        const ctx = new (window.AudioContext || window.webkitAudioContext)();

        // Retro Arpeggio (A Major chord)
        const notes = [440, 554.37, 659.25, 880];
        notes.forEach((freq, i) => {
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.connect(gain);
            gain.connect(ctx.destination);
            osc.type = 'square';
            osc.frequency.value = freq;

            gain.gain.setValueAtTime(0, ctx.currentTime + i * 0.15);
            gain.gain.linearRampToValueAtTime(0.1, ctx.currentTime + i * 0.15 + 0.05);
            gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + i * 0.15 + 0.3);

            osc.start(ctx.currentTime + i * 0.15);
            osc.stop(ctx.currentTime + i * 0.15 + 0.3);
        });

        // Confetti "pop" noise
        const bufferSize = ctx.sampleRate * 0.5;
        const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
        const data = buffer.getChannelData(0);
        for (let i = 0; i < bufferSize; i++) {
            data[i] = Math.random() * 2 - 1;
        }
        const noise = ctx.createBufferSource();
        noise.buffer = buffer;

        const filter = ctx.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(1200, ctx.currentTime);
        filter.frequency.exponentialRampToValueAtTime(100, ctx.currentTime + 0.5);

        const noiseGain = ctx.createGain();
        noiseGain.gain.setValueAtTime(0.3, ctx.currentTime);
        noiseGain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.3);

        noise.connect(filter);
        filter.connect(noiseGain);
        noiseGain.connect(ctx.destination);
        noise.start(ctx.currentTime);
    };

    const invalidCells = useMemo(() => {
        const invalidSet = new Set();
        for (let r = 0; r < 9; r++) {
            for (let c = 0; c < 9; c++) {
                const val = board[r][c];
                if (val === null) continue;
                // Check Row
                for (let i = 0; i < 9; i++) {
                    if (i !== c && board[r][i] === val) invalidSet.add(`${r}-${c}`);
                }
                // Check Col
                for (let i = 0; i < 9; i++) {
                    if (i !== r && board[i][c] === val) invalidSet.add(`${r}-${c}`);
                }
                // Check Block
                const br = Math.floor(r / 3) * 3, bc = Math.floor(c / 3) * 3;
                for (let i = 0; i < 3; i++) {
                    for (let j = 0; j < 3; j++) {
                        const checkR = br + i, checkC = bc + j;
                        if ((checkR !== r || checkC !== c) && board[checkR][checkC] === val) {
                            invalidSet.add(`${r}-${c}`);
                        }
                    }
                }
            }
        }
        return invalidSet;
    }, [board]);

    const checkWin = (currentBoard) => {
        // check if board is full and valid (i.e. no invalids and no nulls)
        if (invalidCells.size > 0) return false;
        for (let i = 0; i < 9; i++) {
            for (let j = 0; j < 9; j++) {
                if (currentBoard[i][j] === null) return false;
            }
        }
        return true;
    };

    const handleCellChange = (row, col, value) => {
        if (!isPlaying) return;
        if (initialPuzzle[row][col] !== null) return; // Prevent changing initially locked cells

        // Basic validation, allow 1-9 or clear
        if (value === '' || (/^[1-9]$/.test(value))) {
            const newBoard = board.map((r, rIdx) =>
                rIdx === row
                    ? r.map((c, cIdx) => (cIdx === col ? (value === '' ? null : parseInt(value)) : c))
                    : r
            );
            setBoard(newBoard);

            if (value !== '' && checkWin(newBoard)) {
                setShowVictory(true);
                playVictorySound();
            }
        }
    };

    const handlePlay = () => {
        const newPuzzle = generatePuzzle(difficulty);
        setBoard(newPuzzle);
        setInitialPuzzle(newPuzzle);
        setSelectedCell(null);
        setShowVictory(false);
        setTimeElapsed(0);
        setIsPlaying(true);
    };

    const handleReset = () => {
        setBoard(createEmptyBoard());
        setInitialPuzzle(createEmptyBoard());
        setSelectedCell(null);
        setShowVictory(false);
        setTimeElapsed(0);
        setIsPlaying(false);
    };

    const handleMove = (direction) => {
        if (!isPlaying || !selectedCell) return;
        const { row, col } = selectedCell;
        let newRow = row, newCol = col;
        if (direction === 'UP') newRow = Math.max(0, row - 1);
        if (direction === 'DOWN') newRow = Math.min(8, row + 1);
        if (direction === 'LEFT') newCol = Math.max(0, col - 1);
        if (direction === 'RIGHT') newCol = Math.min(8, col + 1);
        setSelectedCell({ row: newRow, col: newCol });
    };

    return (
        <div className="flex flex-col items-center gap-2 sm:gap-4 relative w-full">
            {showVictory && (
                <>
                    <Confetti
                        width={window.innerWidth}
                        height={window.innerHeight}
                        recycle={false}
                        numberOfPieces={500}
                        gravity={0.15}
                        style={{ position: 'fixed', top: 0, left: 0, zIndex: 60, pointerEvents: 'none' }}
                    />
                    <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm rounded-xl">
                        <div className="bg-retro-bg p-6 sm:p-8 border-4 border-black rounded-2xl shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] text-center flex flex-col items-center transform scale-100 hover:scale-105 transition-transform max-w-sm sm:max-w-md w-11/12">
                            <h2 className="text-4xl sm:text-5xl text-white font-bold mb-2 drop-shadow-[3px_3px_0_rgba(0,0,0,1)]">
                                HOORAY!
                            </h2>
                            <p className="text-lg sm:text-xl text-white font-bold mb-6 drop-shadow-[2px_2px_0_rgba(0,0,0,1)] leading-tight bg-black/20 p-4 rounded-xl border-2 border-dashed border-white/50">
                                You have won the game on <span className="text-retro-accent uppercase">{difficulty}</span> mode in <span className="text-retro-selected uppercase">{formatTime(timeElapsed)}</span>! <br /><br /> Can you do better?
                            </p>
                            <div className="flex flex-col sm:flex-row gap-3 w-full">
                                <button
                                    onClick={handlePlay}
                                    className="flex-1 bg-retro-success outline-none text-white font-bold text-lg sm:text-xl px-4 py-3 rounded-xl border-4 border-black shadow-[4px_4px_0_rgba(0,0,0,1)] hover:translate-y-1 hover:shadow-[2px_2px_0_rgba(0,0,0,1)] active:translate-y-2 active:shadow-none transition-all uppercase"
                                >
                                    Play Again
                                </button>
                                <button
                                    onClick={handleReset}
                                    className="flex-1 bg-retro-accent outline-none text-white font-bold text-lg sm:text-xl px-4 py-3 rounded-xl border-4 border-black shadow-[4px_4px_0_rgba(0,0,0,1)] hover:translate-y-1 hover:shadow-[2px_2px_0_rgba(0,0,0,1)] active:translate-y-2 active:shadow-none transition-all uppercase"
                                >
                                    Exit Game
                                </button>
                            </div>
                        </div>
                    </div>
                </>
            )}

            {/* Top Info Bar (Timer) */}
            <div className="flex justify-center w-full max-w-[550px] px-2">
                <div className={`transition-opacity duration-300 ${isPlaying ? 'opacity-100' : 'opacity-0'} bg-white text-black font-bold text-xl px-4 py-1 rounded-full border-[3px] border-black shadow-[3px_3px_0_rgba(0,0,0,1)] flex items-center gap-2`}>
                    ⏱️ {formatTime(timeElapsed)}
                </div>
            </div>

            <div className="w-[min(95vw,60vh)] max-w-[550px] aspect-square bg-retro-border p-1 sm:p-1.5 rounded-xl shadow-[4px_4px_0_0_rgba(0,0,0,1)] sm:shadow-[6px_6px_0_0_rgba(0,0,0,1)] border-[3px] sm:border-4 border-black flex-shrink-0 flex items-center justify-center">
                <div className="grid grid-cols-9 grid-rows-9 gap-[2px] sm:gap-1 w-full h-full bg-retro-border p-[2px] sm:p-1 mx-auto">
                    {board.map((row, rowIndex) => (
                        row.map((cell, colIndex) => {
                            const isRightBorder = (colIndex + 1) % 3 === 0 && colIndex < 8;
                            const isBottomBorder = (rowIndex + 1) % 3 === 0 && rowIndex < 8;
                            const isLocked = !isPlaying || initialPuzzle[rowIndex][colIndex] !== null;
                            const invalid = invalidCells.has(`${rowIndex}-${colIndex}`);

                            return (
                                <SudokuCell
                                    key={`${rowIndex}-${colIndex}`}
                                    value={cell}
                                    row={rowIndex}
                                    col={colIndex}
                                    isRightBorder={isRightBorder}
                                    isBottomBorder={isBottomBorder}
                                    isSelected={selectedCell?.row === rowIndex && selectedCell?.col === colIndex}
                                    isLocked={isLocked}
                                    isInvalid={invalid}
                                    onSelect={() => { if (isPlaying) setSelectedCell({ row: rowIndex, col: colIndex }) }}
                                    onChange={(val) => handleCellChange(rowIndex, colIndex, val)}
                                    onMove={handleMove}
                                />
                            );
                        })
                    ))}
                </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-3 sm:gap-4 mt-1">
                <select
                    value={difficulty}
                    onChange={(e) => setDifficulty(e.target.value)}
                    className="bg-white text-black font-bold text-sm sm:text-lg px-2 py-1 sm:py-2 rounded-xl border-[3px] border-black shadow-[2px_2px_0_rgba(0,0,0,1)] outline-none"
                >
                    <option value="Easy">Easy</option>
                    <option value="Medium">Medium</option>
                    <option value="Hard">Hard</option>
                </select>

                <div className="flex gap-4">
                    <button
                        onClick={handlePlay}
                        className="bg-retro-success text-white font-bold text-sm sm:text-xl px-4 sm:px-6 py-1 sm:py-2 rounded-xl border-[3px] sm:border-4 border-black shadow-[3px_3px_0_rgba(0,0,0,1)] hover:translate-y-1 hover:shadow-[1px_1px_0_rgba(0,0,0,1)] transition-all active:translate-y-2 active:shadow-none uppercase tracking-widest cursor-pointer"
                    >
                        Play
                    </button>
                    <button
                        onClick={handleReset}
                        className="bg-retro-accent text-white font-bold text-sm sm:text-xl px-4 sm:px-6 py-1 sm:py-2 rounded-xl border-[3px] sm:border-4 border-black shadow-[3px_3px_0_rgba(0,0,0,1)] hover:translate-y-1 hover:shadow-[1px_1px_0_rgba(0,0,0,1)] transition-all active:translate-y-2 active:shadow-none uppercase tracking-widest cursor-pointer"
                    >
                        Reset
                    </button>
                </div>
            </div>
        </div>
    );
}
