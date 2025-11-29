import { NextResponse } from 'next/server';
import { generateSudoku } from '@/lib/sudoku';
import { saveSolution } from './solutionsStore';

export async function GET() {
  // Generate full solved board and playable board
  const { board, solution } = generateSudoku(50);

  // Save the solved board on the server and return a puzzleId
  const puzzleId = saveSolution(solution);

  return NextResponse.json({ board, puzzleId });
}