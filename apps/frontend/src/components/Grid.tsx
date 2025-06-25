import React, { type FC, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { type ApiError, type CommitDate, type CommitRequest, type CommitResponse, type EmailsResponse } from '../types/api.types';
import { dayOfYearToDate, isLeapYear } from '../helpers/dates';
import ModalWindow from './InfoWindow';
import type { Action } from '../types/grid.types';

const colors = ['#151B23', '#033A16', '#196C2E', '#2EA043', '#56D364'];
const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

const App: FC = () => {
  const rows = 7;
  const cols = 54;
  const navigate = useNavigate();

  const [year, setYear] = useState<number>(2025);
  const [email, setEmail] = useState<string | undefined>(undefined);
  const [gridState, setGridState] = useState<string[][]>(
    Array(rows).fill(null).map(() => Array(cols).fill(null))
  );
  const [repoUrl, setRepoUrl] = useState<string>('');
  const [emails, setEmails] = useState<EmailsResponse>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [pullRequests, setPullRequests] = useState<string[]>([]); // New state for pull request URLs
  const [selectedColor, setSelectedColor] = useState<string>(colors[0]);
  const [isMouseDown, setIsMouseDown] = useState<boolean>(false);
  const [actions, setActions] = useState<Action[]>([]);

  const daysInYear = isLeapYear(year) ? 366 : 365;

  useEffect(() => {
    const newGrid = Array(rows).fill(null).map(() => Array(cols).fill(null));
    const firstDay = new Date(`${year}-01-01`).getDay();
    for (let day = 0; day < daysInYear; day++) {
      const row = (firstDay + day) % 7;
      const col = Math.floor((firstDay + day) / 7);
      if (col < cols) {
        newGrid[row][col] = '#151B23';
      }
    }
    setGridState(newGrid);
    setActions([]);
  }, [year]);

  const undoAction = () => {
    if (actions.length === 0) return;
    setActions((prevActions) => {
      const newActions = [...prevActions];
      const { cell, before } = newActions.pop()!;
      handleCellChange(cell.row, cell.column, before);
      return newActions;
    });
  };

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if ((event.ctrlKey || event.metaKey) && event.key === 'z') {
        event.preventDefault();
        undoAction();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [actions]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/oauth/emails');
        if (response.status === 401) {
          navigate('/login');
          return;
        }
        if (!response.ok) {
          throw new Error(`Network response was not ok: ${response.status}`);
        }
        const data = await response.json() as EmailsResponse;
        setEmails(data);
        const primaryEmail = data.find((email) => email.primary)?.email;
        setEmail(primaryEmail);
        console.log('Protected data:', data);
      } catch (error) {
        console.error('Fetch error:', error);
        setError(error instanceof Error ? error.message : 'Unknown error');
      }
    };
    fetchData();
  }, [navigate]);

  const getDateForCell = (row: number, col: number): string => {
    const startDate = new Date(`${year}-01-01`);
    const firstDay = startDate.getDay();
    const dayOffset = col * 7 + row - firstDay;
    return dayOfYearToDate(dayOffset, year);
  };

  const handleCellChange = (row: number, col: number, color: string = selectedColor) => {
    if (gridState[row][col] === null) return;
    const newGrid = gridState.map((r, i) =>
      i === row ? r.map((cell, j) => (j === col ? color : cell)) : r
    );
    setGridState(newGrid);
  };

  const drawCell = (row: number, col: number) => {
    const curColor = gridState[row][col];
    if (curColor === selectedColor) return;
    const action: Action = {
      before: gridState[row][col],
      after: selectedColor,
      cell: {
        row,
        column: col,
      },
    };
    handleCellChange(row, col);
    setActions((prevActions) => [...prevActions, action]);
  };

  const getCommitData = (): CommitDate[] => {
    const brightnessMap: { [key: string]: number } = {
      '#033A16': 1,
      '#196C2E': 2,
      '#2EA043': 3,
      '#56D364': 4,
    };
    const data: CommitDate[] = [];
    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        const color = gridState[row][col];
        if (color && color !== '#151B23' && brightnessMap[color]) {
          const date = getDateForCell(row, col);
          if (date) {
            data.push({ date, brightness: brightnessMap[color] });
          }
        }
      }
    }
    return data;
  };

  const handleCommit = async () => {
    if (!email) {
      setError('No primary email found. Please ensure you are logged in.');
      return;
    }
    if (!repoUrl) {
      setError('Please enter a GitHub repository URL.');
      return;
    }

    setIsLoading(true);
    setError(null);
    setSuccessMessage(null);
    setPullRequests([]); // Reset pull requests

    try {
      const commitData: CommitRequest = {
        email,
        repoUrl,
        dates: getCommitData(),
      };

      const response = await fetch('/commits/commit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(commitData),
      });

      if (!response.ok) {
        const errorData: ApiError = await response.json();
        throw new Error(errorData.message || `Request failed with status ${response.status}`);
      }

      const result: CommitResponse = await response.json();
      setPullRequests(result.pullRequest); // Store pull request URLs
      if (result.pullRequest.length === 0) {
        setSuccessMessage('Commits created successfully!');
      }
    } catch (error) {
      console.error('Commit error:', error);
      setError(error instanceof Error ? error.message : 'Failed to create commits');
    } finally {
      setIsLoading(false);
    }
  };

  const years = Array.from({ length: 2025 - 1970 + 1 }, (_, i) => 1970 + i).reverse();

  return (
    <div
      style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '16px' }}
      className="flex flex-col items-center p-4"
      onMouseUp={() => setIsMouseDown(false)}
      onMouseLeave={() => setIsMouseDown(false)}
    >
      <div style={{ display: 'flex', alignItems: 'center', marginBottom: '16px' }}>
        <ModalWindow />
        <h1
          style={{ fontSize: '24px', fontWeight: 'bold', color: '#E5E7EB', marginRight: '16px' }}
          className="text-2xl font-bold text-gray-200"
        >
          CommitDraw
        </h1>
        <select
          value={year}
          onChange={(e) => setYear(parseInt(e.target.value, 10))}
          style={{
            padding: '4px',
            backgroundColor: '#1F2937',
            color: '#E5E7EB',
            border: '1px solid #6B7280',
            borderRadius: '4px',
          }}
          className="text-sm"
        >
          {years.map((y) => (
            <option key={y} value={y}>
              {y}
            </option>
          ))}
        </select>
      </div>
      <div
        style={{ display: 'flex', gap: '8px', marginBottom: '16px' }}
        className="flex space-x-2 mb-4"
      >
        {colors.map((color) => (
          <button
            key={color}
            onClick={() => setSelectedColor(color)}
            style={{
              width: '32px',
              height: '32px',
              borderRadius: '2px',
              border: '2px solid #6B7280',
              backgroundColor: color,
              borderColor: selectedColor === color ? '#FFFFFF' : '#6B7280',
            }}
            className="w-8 h-8 rounded-sm border-2 border-gray-500"
          ></button>
        ))}
      </div>
      {pullRequests.length > 0 ? (
        <div style={{ marginBottom: '16px' }} className="flex flex-col items-center">
          <p style={{ color: '#56D364', marginBottom: '8px' }}>Pull request(s) created:</p>
          {pullRequests.map((url, index) => (
            <a
              key={index}
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: '#56D364', textDecoration: 'underline', marginBottom: '4px' }}
              className="text-green-400 hover:underline"
              aria-label={`Open pull request ${index + 1} in a new tab`}
            >
              Pull Request {index + 1}
            </a>
          ))}
        </div>
      ) : (
        successMessage && (
          <p style={{ color: '#56D364', marginBottom: '16px' }}>{successMessage}</p>
        )
      )}
      {error && (
        <p style={{ color: '#EF4444', marginBottom: '16px' }}>{error}</p>
      )}
      <div style={{ display: 'flex' }}>
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            marginRight: '8px',
            color: '#E5E7EB',
            fontSize: '12px',
          }}
          className="flex flex-col justify-between mr-2 text-gray-200 text-sm"
        >
          {daysOfWeek.map((day, index) => (
            <div
              key={index}
              style={{ height: '16px', display: 'flex', alignItems: 'center' }}
              className="h-4 flex items-center"
            >
              {day}
            </div>
          ))}
        </div>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: `repeat(${cols}, 16px)`,
            gap: '2px',
            padding: '8px',
            backgroundColor: '#0D1117',
          }}
          className="grid p-2"
        >
          {gridState.map((row, rowIndex) =>
            row.map((cell, colIndex) => (
              <div
                key={`${rowIndex}-${colIndex}`}
                onMouseDown={(e: React.MouseEvent) => {
                  if (e.button === 0) {
                    e.preventDefault();
                    setIsMouseDown(true);
                    drawCell(rowIndex, colIndex);
                  }
                }}
                onMouseEnter={() => isMouseDown && drawCell(rowIndex, colIndex)}
                style={{
                  width: '16px',
                  height: '16px',
                  borderRadius: '2px',
                  backgroundColor: cell || '#0D1117',
                }}
                className={`rounded-sm transition-all duration-300 ease-in-out ${cell !== null ? 'cursor-pointer' : 'cursor-default'}`}
                title={getDateForCell(rowIndex, colIndex)}
              ></div>
            ))
          )}
        </div>
      </div>
      <div style={{ padding: '24px' }}>
        <div style={{ display: 'flex', gap: '8px', marginBottom: '10px', alignItems: 'flex-start' }}>
          <h1
            style={{ fontSize: '14px', color: '#E5E7EB', marginRight: '16px', width: '132px' }}
            className="text-2xl font-bold text-gray-200"
          >
            Email used to commit:
          </h1>
          <div style={{ textAlign: 'center' }}>
            <div style={{ width: '300px' }}>
              <select
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={{
                  width: '100%',
                  padding: '8px',
                  backgroundColor: '#1F2937',
                  color: '#E5E7EB',
                  border: '1px solid #6B7280',
                  borderRadius: '4px',
                  maxHeight: '300px',
                }}
                className="text-sm"
              >
                {emails.map(({ email }) => (
                  <option key={email} value={email}>
                    {email}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
        <div style={{ display: 'flex', gap: '8px', marginBottom: '10px', alignItems: 'flex-start' }}>
          <button
            onClick={handleCommit}
            disabled={isLoading || !email || !repoUrl}
            style={{
              padding: '8px 16px',
              backgroundColor: isLoading || !email || !repoUrl ? '#4B5563' : '#1F6FEB',
              color: '#E5E7EB',
              border: '1px solid #6B7280',
              borderRadius: '4px',
              cursor: isLoading || !email || !repoUrl ? 'not-allowed' : 'pointer',
              flexShrink: 0,
            }}
            className="text-sm hover:bg-gray-700"
          >
            {isLoading ? 'Committing...' : 'Commit Changes'}
          </button>
          <div style={{ width: '300px' }}>
            <input
              type="text"
              value={repoUrl}
              onChange={(e) => setRepoUrl(e.target.value)}
              placeholder="https://github.com/username/repo"
              style={{
                width: '100%',
                padding: '8px',
                backgroundColor: '#1F2937',
                color: '#E5E7EB',
                border: '1px solid #6B7280',
                borderRadius: '4px',
              }}
              className="text-sm"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;
