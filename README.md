# Sudoku Web App

A fully functional Sudoku puzzle game built as a web application, featuring automatic puzzle generation with guaranteed unique solutions, real-time validation, and interactive note-taking with color highlights.

## Technologies Used

This project leverages modern web technologies for a smooth, responsive user experience:

- **Next.js 16.0.5 with Turbopack**: Used for the full-stack framework, enabling server-side rendering, API routes, and fast development with Turbopack's optimized bundling. The app structure follows Next.js App Router with TypeScript for type safety.
- **React 18**: Implemented using functional components and hooks (useState, useEffect) for state management, ensuring a reactive UI that updates in real-time as users interact with the board.
- **TypeScript**: Provides static typing throughout the codebase, reducing bugs and improving maintainability. Custom types are defined for board structures and UI components.
- **Tailwind CSS**: Handles all styling with utility classes, creating a clean, responsive design. Custom CSS variables and classes are used for the Sudoku grid and interactive elements.
- **ESLint**: Configured for code quality and consistency, with rules tailored for TypeScript and React.
- **Custom Sudoku Logic**: Pure TypeScript implementation of Sudoku algorithms, including backtracking solvers for puzzle generation and solution counting to ensure uniqueness.

## Project Description

This is an interactive Sudoku web app where users can play generated puzzles with unique solutions. The app generates new puzzles on load, allows users to input numbers, check their progress, submit solutions, and use color-coded notes for hints. The backend ensures all puzzles have exactly one solution through algorithmic verification.

## Features

- **Automatic Puzzle Generation**: Creates Sudoku boards with guaranteed unique solutions using a backtracking algorithm.
- **Real-time Validation**: Check button validates current board state against the solution.
- **Submit Functionality**: Submit button confirms if the puzzle is completely solved.
- **Interactive Notes**: Color palette for highlighting cells with notes, applied one-time per cell.
- **Responsive UI**: Clean, accessible interface with keyboard and mouse support.
- **Persistent Solutions**: Server-side storage of puzzle solutions for validation.

## Installation and Running

To run this project locally:

1. **Clone the repository**:
   ```bash
   git clone https://github.com/musaab98/sudoku.git
   cd sudoku
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Run the development server**:
   ```bash
   npm run dev
   ```

4. **Open your browser** and navigate to [http://localhost:3000](http://localhost:3000) to start playing.

The app will automatically generate a new Sudoku puzzle on load. Use the mouse or keyboard to select cells and input numbers (1-9). The check and submit buttons provide feedback on your progress.

## Usage

- **Playing**: Click on a cell to select it, then type a number (1-9) to fill it. Only empty cells can be edited.
- **Checking**: Click "Check" to see if your current inputs are correct (green for correct, red for incorrect).
- **Submitting**: Click "Submit" when you think you've solved the puzzle. A dialog will confirm if it's correct.
- **Notes**: Select a cell and choose a color from the palette to highlight it as a note. Notes are visual aids and don't affect validation.
- **New Game**: Refresh the page to generate a new puzzle.

## Contributing

Feel free to open issues or submit pull requests for improvements. The codebase is well-structured and documented for easy contributions.

## License

This project is open-source and available under the MIT License.
