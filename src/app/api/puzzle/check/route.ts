import { NextResponse } from 'next/server';
import { getSolution } from '../solutionsStore';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { puzzleId, board, initialBoard } = body ?? {};

    if (!puzzleId || !board || !initialBoard) {
      return NextResponse.json({ status: 'error', error: 'Missing fields' }, { status: 400 });
    }

    const solution = getSolution(String(puzzleId));
    if (!solution) {
      // puzzleId not found (likely due to server restart in dev mode)
      // Return a special status so the client can handle it
      return NextResponse.json({ status: 'error', error: 'Unknown puzzleId', shouldRefresh: true }, { status: 404 });
    }

    // Normalize values to numbers (treat non-numeric as 0)
    const b: number[][] = board.map((row: any[]) => row.map((v: any) => {
      const n = Number(v);
      return Number.isFinite(n) ? n : 0;
    }));
    const init: number[][] = initialBoard.map((row: any[]) => row.map((v: any) => {
      const n = Number(v);
      return Number.isFinite(n) ? n : 0;
    }));

    // Compare only user-entered cells: where initialBoard === 0 AND user entered a value (non-zero)
    for (let r = 0; r < 9; r++) {
      for (let c = 0; c < 9; c++) {
        if (init[r][c] === 0) {
          const userVal = b[r][c];
          if (userVal !== 0 && userVal !== solution[r][c]) {
            return NextResponse.json({ status: 'incorrect', solution });
          }
        }
      }
    }

    return NextResponse.json({ status: 'solvable', solution });
  } catch (err: any) {
    return NextResponse.json({ status: 'error', error: String(err) }, { status: 500 });
  }
}