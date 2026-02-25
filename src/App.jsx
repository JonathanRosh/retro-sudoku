import { useState } from 'react';
import SudokuGrid from './components/SudokuGrid';

function App() {
  const [isPlaying, setIsPlaying] = useState(false);
  return (
    <div className="h-[100dvh] w-screen flex flex-col items-center justify-between py-2 sm:py-4 overflow-hidden relative bg-retro-bg">
      {/* Decorative cartoon elements */}
      <div className="absolute top-2 left-4 w-[15vmin] h-[15vmin] bg-blue-400 rounded-full mix-blend-multiply filter blur-xl opacity-60 animate-blob pointer-events-none"></div>
      <div className="absolute top-2 right-4 w-[15vmin] h-[15vmin] bg-pink-400 rounded-full mix-blend-multiply filter blur-xl opacity-60 animate-blob animation-delay-2000 pointer-events-none"></div>
      <div className="absolute -bottom-4 left-10 w-[15vmin] h-[15vmin] bg-yellow-400 rounded-full mix-blend-multiply filter blur-xl opacity-60 animate-blob animation-delay-4000 pointer-events-none"></div>

      <div className="z-10 text-center flex-none mt-1 sm:mt-2">
        <h1 className="text-[5vh] lg:text-[7vh] font-bold tracking-wider text-white drop-shadow-[3px_3px_0_rgba(0,0,0,1)] uppercase -rotate-2 transform hover:rotate-2 transition-transform duration-300 leading-none">
          Sudoku
        </h1>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-4 mt-2 sm:mt-4">
          <p className="text-[2vh] lg:text-[2.2vh] font-bold text-retro-text bg-white px-4 py-1 rounded-full border-2 border-black shadow-[3px_3px_0_rgba(0,0,0,1)] rotate-1">
            Retro Cartoon Edition
          </p>
          <p className={`text-[2vh] lg:text-[2.2vh] font-bold text-white px-4 py-1 rounded-full border-[3px] sm:border-4 border-black shadow-[3px_3px_0_rgba(0,0,0,1)] -rotate-1 tracking-wide uppercase ${isPlaying ? 'bg-retro-accent' : 'animate-colorFlicker'}`}>
            {isPlaying ? '⌨️ Select a cell & Type!' : '▶️ Hit Play To Start!'}
          </p>
        </div>
      </div>

      <div className="z-10 flex-1 flex flex-col justify-center items-center min-h-0 w-full overflow-hidden shrink py-2">
        <SudokuGrid isPlaying={isPlaying} setIsPlaying={setIsPlaying} />
      </div>
    </div>
  );
}

export default App;
