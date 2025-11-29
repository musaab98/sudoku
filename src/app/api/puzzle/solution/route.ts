import { NextResponse } from 'next/server';
import { getSolution } from '../solutionsStore';

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const puzzleId = url.searchParams.get('puzzleId');
    if (!puzzleId) {
      return NextResponse.json({ status: 'error', error: 'Missing puzzleId' }, { status: 400 });
    }
    const solution = getSolution(puzzleId);
    if (!solution) {
      return NextResponse.json({ status: 'error', error: 'Unknown puzzleId' }, { status: 404 });
    }
    return NextResponse.json({ status: 'ok', solution });
  } catch (e) {
    return NextResponse.json({ status: 'error', error: 'Invalid request' }, { status: 400 });
  }
}
