import { useRef, useEffect } from 'react';

export default function SudokuCell({
    value,
    row,
    col,
    isRightBorder,
    isBottomBorder,
    isSelected,
    isLocked,
    isInvalid,
    onSelect,
    onChange,
    onMove
}) {
    const inputRef = useRef(null);

    useEffect(() => {
        if (isSelected && inputRef.current) {
            inputRef.current.focus();
        }
    }, [isSelected]);

    const handleKeyDown = (e) => {
        if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.key)) {
            e.preventDefault(); // Prevents input from moving cursor left/right weirdly
            onMove(e.key.replace('Arrow', '').toUpperCase());
            return;
        }

        if (isLocked) return;
        if (e.key === 'Backspace' || e.key === 'Delete') {
            onChange('');
        } else if (/^[1-9]$/.test(e.key)) {
            onChange(e.key);
        }
        // Prevent default to avoid scrolling when typing numbers if any
    };

    return (
        <div
            className={`
        relative w-full h-full flex items-center justify-center min-w-0 min-h-0
        border border-gray-400
        ${isRightBorder ? 'border-r-[3px] sm:border-r-4 border-r-black' : ''}
        ${isBottomBorder ? 'border-b-[3px] sm:border-b-4 border-b-black' : ''}
        ${isSelected ? 'bg-retro-selected ring-4 ring-inset ring-retro-accent shadow-inner z-10' :
                    (isInvalid ? 'bg-red-200 ring-4 ring-inset ring-red-500' : (isLocked ? 'bg-amber-100/50 text-black' : 'bg-retro-cellBg'))}
        transition-colors duration-100 ease-in-out ${isLocked ? 'cursor-default' : 'cursor-pointer hover:bg-retro-cellHighlight'}
      `}
            onClick={onSelect}
        >
            <input
                ref={inputRef}
                type="text"
                inputMode="numeric"
                value={value || ''}
                onChange={(e) => {
                    if (isLocked) return;
                    // onChange is handled nicely by keydown for strict 1-9, but we catch generic changes here
                    const val = e.target.value.slice(-1);
                    if (val === '' || /^[1-9]$/.test(val)) {
                        onChange(val);
                    }
                }}
                onKeyDown={handleKeyDown}
                className={`w-full h-full text-center bg-transparent outline-none text-lg sm:text-2xl md:text-3xl font-bold ${isInvalid ? 'text-red-700' : (isLocked ? 'text-black' : 'text-retro-text')} selection:bg-transparent ${isLocked ? 'cursor-default pointer-events-none' : 'cursor-pointer'}`}
                readOnly={isLocked} // We handle input primarily through keydown/change manually, and it prevents mobile keyboard weirdness sometimes, wait actually let's not make it readonly so mobile keyboard pops up.
            />
        </div>
    );
}
