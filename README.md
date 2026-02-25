# Retro Sudoku 🧩

A fully responsive, retro-cartoon themed Sudoku game built with React and Tailwind CSS. This project was developed as a modern, interactive web application featuring custom difficulty levels, dynamic puzzle generation, and real-time game logic validation.

> **🤖 AI-Assisted Development**
> This application was collaboratively designed and built using **Google's Antigravity AI Agent**, demonstrating a modern AI pair-programming workflow and rapid application development!

## ✨ Features

* **Retro Cartoon Aesthetic**: Custom Tailwind configurations utilizing bold borders, deep drop shadows, and vibrant colors to create a playful, arcade-style experience.
* **Universal Responsiveness**: Engineered using strict CSS viewport constraints (`vmin`, `aspect-ratio`, and `dvh`) to ensure the entire application fits perfectly on heavily constrained laptop screens (1080p) and wide layout 4K screens without requiring a single vertical scrollbar.
* **Dynamic Puzzle Generation**: Includes Easy, Medium, and Hard difficulty curves that mathematically strip a valid Sudoku board to balance the challenge.
* **Game State Management**: The game grid strictly locks cell selection and hover states until the player officially hits "Play", guiding user interaction through pulsing retro header banners.
* **Real-time Validation & Highlighting**: Entering a number instantly checks against standard Sudoku rules (Row, Column, and 3x3 Block constraints). Conflicting cells are immediately visually highlighted in red.
* **Keyboard Navigation**: Native focus bounding with Arrow Keys allows users to effectively "drive" around the grid with their keyboard.
* **Victory Conditions & Polish**: Features a game timer, win-state mathematical verification, and integrates `react-confetti` alongside a retro synthesized Chiptune sound effect upon completing the board!

## 🚀 Built With

* **React (Vite)** - Fast, modern frontend framework
* **Tailwind CSS** - Utility-first CSS framework for rapid UI styling
* **HTML5 Audio API** - For generating customized retro chirps without external sound files
* **React Confetti** - For rewarding victory animations

## ⚙️ Running Locally

1. **Clone the repository:**
   ```bash
   git clone https://github.com/JonathanRosh/retro-sudoku.git
   ```
2. **Navigate to the project directory:**
   ```bash
   cd retro-sudoku
   ```
3. **Install dependencies:**
   ```bash
   npm install
   ```
4. **Start the development server:**
   ```bash
   npm run dev
   ```
5. Open your browser and navigate to `http://localhost:5173/`

## 🧠 Technical Highlights

* **CSS Grid aspect-ratios**: Replaced brittle explicit width/height properties with Flexbox `aspect-square` logic, completely fixing pixel jitter/layout shifts while providing infinitely scalable responsiveness.
* **State Lifting**: Lifted `isPlaying` states to the parent `App` component to dynamically sync the header instruction banner with the `SudokuGrid`'s internal locks.
* **Memoization Optimization**: Computes invalid board states utilizing React's `useMemo` hooks, efficiently rebuilding the `Set` of conflicting Cartesian identifiers only when the board matrix natively changes.
