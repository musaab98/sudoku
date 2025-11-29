'use client';
import { useState, useEffect } from 'react';

type DialogType = {
  message: string;
  type: 'alert' | 'confirm';
  onConfirm?: () => void;
  onCancel?: () => void;
  confirmText?: string;
  cancelText?: string;
} | null;

export default function Home() {
  const [board, setBoard] = useState<number[][]>([]);
  const [initialBoard, setInitialBoard] = useState<number[][]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<[number, number] | null>(null);
  const [checkResult, setCheckResult] = useState<null | boolean>(null);
  const [checking, setChecking] = useState(false);
  const [puzzleId, setPuzzleId] = useState<string | null>(null);
  const [dialog, setDialog] = useState<DialogType>(null);

  // Fetch logic
  useEffect(() => {
    fetch('/api/puzzle')
      .then((res) => res.json())
      .then((data) => {
        setBoard(data.board);
        setInitialBoard(JSON.parse(JSON.stringify(data.board))); // Deep copy
        setPuzzleId(data.puzzleId ?? null);
        setLoading(false);
      });
  }, []);

  const handleChange = (r: number, c: number, val: string) => {
    // Always use the only valid digit 1-9 in the input, or clear if none
    const digits = val.match(/[1-9]/g);
    let num = 0;
    if (digits && digits.length === 1) {
      num = parseInt(digits[0], 10);
    } else if (digits && digits.length > 1) {
      // Prefer the digit that is different from the current value
      const current = board[r][c] ? String(board[r][c]) : '';
      const diff = digits.find(d => d !== current);
      num = diff ? parseInt(diff, 10) : parseInt(digits[digits.length - 1], 10);
    }
    const newBoard = [...board];
    newBoard[r] = [...newBoard[r]];
    newBoard[r][c] = num;
    setBoard(newBoard);
  };

  return (
    <main className="app-root">
      <h1 className="app-title">Sudoku</h1>

      {loading ? (
        <p>Generating Board...</p>
      ) : (
        <div className="board-card">
          <div className="sudoku-board" role="grid" aria-label="sudoku-board">
            {board.flatMap((row, rIndex) => (
              row.map((cell, cIndex) => {
                const isThickBottom = (rIndex + 1) % 3 === 0 && rIndex !== 8;
                const isThickRight = (cIndex + 1) % 3 === 0 && cIndex !== 8;
                const isInitial = initialBoard[rIndex][cIndex] !== 0;

                const isSelected = selected && selected[0] === rIndex && selected[1] === cIndex;
                const classes = [
                  'cell',
                  isInitial ? 'initial' : '',
                  isThickRight ? 'thick-right' : '',
                  isThickBottom ? 'thick-bottom' : '',
                  isSelected ? 'selected' : '',
                ].join(' ');

                return (
                  <input
                    key={`${rIndex}-${cIndex}`}
                    type="text"
                    inputMode="numeric"
                    pattern="[1-9]{1}"
                    maxLength={2}
                    aria-label={`cell-${rIndex}-${cIndex}`}
                    value={cell === 0 ? '' : String(cell).slice(-1)}
                    disabled={isInitial}
                    onFocus={() => setSelected([rIndex, cIndex])}
                    onBlur={() => setSelected(null)}
                    onChange={e => {
                      handleChange(rIndex, cIndex, e.target.value);
                    }}
                    className={classes}
                  />
                );
              })
            ))}
          </div>
        </div>
      )}

      <div className="controls">
        <button onClick={() => window.location.reload()} className="btn">New Game</button>

        <button
          className="btn"
          disabled={checking}
          onClick={async () => {
            // Check if there are any empty squares
            const hasEmptySquares = board.some(row => row.some(cell => cell === 0));
            if (hasEmptySquares) {
              setDialog({
                message: "You haven't finished the game yet. Please fill in all squares.",
                type: 'alert',
                onConfirm: () => setDialog(null),
                confirmText: 'OK'
              });
              return;
            }

            // First confirmation: are you ready to submit?
            setDialog({
              message: 'Are you ready to finalize your board?',
              type: 'confirm',
              onConfirm: async () => {
                setDialog(null);
                
                if (!puzzleId) {
                  console.warn('No puzzleId available for submit');
                  return;
                }
                
                setChecking(true);
                setCheckResult(null);
                try {
                  const res = await fetch('/api/puzzle/check', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ puzzleId, board, initialBoard }),
                  });

                  if (!res.ok) {
                    const errorData = await res.json().catch(() => null);
                    console.error('Submit request failed', res.status, errorData);
                    
                    if (errorData?.shouldRefresh) {
                      setDialog({
                        message: 'The puzzle session expired. Loading a new puzzle...',
                        type: 'alert',
                        onConfirm: () => {
                          setDialog(null);
                          window.location.reload();
                        },
                        confirmText: 'OK'
                      });
                      return;
                    }
                    setCheckResult(null);
                  } else {
                    const data = await res.json();
                    
                    // Log the solved board to console
                    if (data.solution) {
                      console.log('Solved board:');
                      console.table(data.solution);
                    }
                    
                    if (data.status === 'incorrect') {
                      setCheckResult(false);
                      // Board is wrong - ask if they want to continue or start new
                      setDialog({
                        message: 'The board is wrong. Would you like to continue playing?',
                        type: 'confirm',
                        onConfirm: () => setDialog(null),
                        onCancel: () => {
                          setDialog(null);
                          window.location.reload();
                        },
                        confirmText: 'Continue',
                        cancelText: 'New Game'
                      });
                    } else if (data.status === 'solvable') {
                      setCheckResult(true);
                      // Board is correct - congratulate!
                      setDialog({
                        message: '🎉 Congratulations! You won!',
                        type: 'alert',
                        onConfirm: () => setDialog(null),
                        confirmText: 'OK'
                      });
                    } else {
                      console.warn('Unexpected submit response', data);
                      setCheckResult(null);
                    }
                  }
                } catch (err) {
                  console.error('Submit request failed', err);
                  setCheckResult(null);
                } finally {
                  setChecking(false);
                }
              },
              onCancel: () => setDialog(null),
              confirmText: 'Yes',
              cancelText: 'No'
            });
          }}
        >
          {checking ? 'Submitting...' : 'Submit'}
        </button>

        <button onClick={() => {
          setBoard(JSON.parse(JSON.stringify(initialBoard)));
          setCheckResult(null);
        }} className="btn ghost">Reset</button>

        <button
          className="btn ghost"
          disabled={checking}
          onClick={async () => {
            if (!puzzleId) {
              console.warn('No puzzleId available for check');
              return;
            }
            setChecking(true);
            setCheckResult(null);
            try {
              const res = await fetch('/api/puzzle/check', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ puzzleId, board, initialBoard }),
              });

              if (!res.ok) {
                // Log error body (helps debug 4xx/5xx)
                const errorData = await res.json().catch(() => null);
                console.error('Check request failed', res.status, errorData);
                
                // If puzzleId is unknown (due to server restart), reload to get a new puzzle
                if (errorData?.shouldRefresh) {
                  setDialog({
                    message: 'The puzzle session expired. Loading a new puzzle...',
                    type: 'alert',
                    onConfirm: () => {
                      setDialog(null);
                      window.location.reload();
                    },
                    confirmText: 'OK'
                  });
                  return;
                }
                setCheckResult(null);
              } else {
                const data = await res.json();
                
                // Log the solved board to console
                if (data.solution) {
                  console.log('Solved board:');
                  console.table(data.solution);
                }
                
                if (data.status === 'incorrect') {
                  setCheckResult(false);
                } else if (data.status === 'solvable') {
                  setCheckResult(true);
                } else {
                  console.warn('Unexpected check response', data);
                  setCheckResult(null);
                }
              }
            } catch (err) {
              console.error('Check request failed', err);
              setCheckResult(null);
            } finally {
              setChecking(false);
            }
          }}
        >
          {checking ? 'Checking...' : 'Check'}
        </button>

      </div>
      <div style={{ marginTop: 12, minHeight: '24px', fontWeight: 500, color: '#000' }}>
        {checkResult === false && (
          <span><span style={{ color: '#ef4444' }}>❌</span> The board is incorrect</span>
        )}
        {checkResult === true && (
          <span><span style={{ color: '#22c55e' }}>✓</span> The current board is solvable</span>
        )}
      </div>

      {/* Custom Dialog */}
      {dialog && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000
        }}>
          <div style={{
            backgroundColor: 'white',
            padding: '24px',
            borderRadius: '8px',
            maxWidth: '400px',
            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
          }}>
            <p style={{ margin: '0 0 20px 0', fontSize: '16px', color: '#000' }}>{dialog.message}</p>
            <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
              {dialog.type === 'confirm' && dialog.onCancel && (
                <button
                  onClick={dialog.onCancel}
                  className="btn ghost"
                  style={{ minWidth: '80px' }}
                >
                  {dialog.cancelText || 'Cancel'}
                </button>
              )}
              <button
                onClick={dialog.onConfirm}
                className="btn"
                style={{ minWidth: '80px' }}
              >
                {dialog.confirmText || 'OK'}
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}