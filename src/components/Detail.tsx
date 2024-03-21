import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Input from './Input'; 
import Button from './Button';
import Form from './Form';

interface GameSummary {
  id: number;
  date: string;
  home: { name: string };
  away: { name: string };
}

interface GameDetail extends GameSummary {
  home: {
    id: number;
    name: string;
    score: number;
  };
  away: {
    id: number;
    name: string;
    score: number;
  };
}

const Detail = () => {
  const [games, setGames] = useState<GameSummary[]>([]);
  const [selectedGameId, setSelectedGameId] = useState<string>('');
  const [game, setGame] = useState<GameDetail | null>(null);
  const [homeScore, setHomeScore] = useState<string>('');
  const [awayScore, setAwayScore] = useState<string>('');
  const navigate = useNavigate();
  const apiBaseUrl = process.env.REACT_APP_API_BASE_URL;

  useEffect(() => {
    fetch(`${apiBaseUrl}/games`)
      .then(response => response.json())
      .then(data => setGames(data))
      .catch(error => console.error('Error fetching games:', error));
  }, [apiBaseUrl]);

  useEffect(() => {
    if (selectedGameId) {
      fetchGameDetails(selectedGameId);
    }
  }, [selectedGameId, apiBaseUrl]);

  const fetchGameDetails = (gameId: string) => {
    fetch(`${apiBaseUrl}/games/${gameId}`)
      .then(response => response.json())
      .then(data => {
        setGame(data);
        setHomeScore(data.home.score.toString());
        setAwayScore(data.away.score.toString());
      })
      .catch(error => console.error('Error:', error));
  };

  const deleteGame = () => {
    if (!selectedGameId) return;
    fetch(`${apiBaseUrl}/games/${selectedGameId}`, { method: 'DELETE' })
      .then(() => navigate('/'))
      .catch(error => console.error('Error:', error));
  };

  const handleUpdateGame = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedGameId) return;
    const updatedScores = {
      home_score: parseInt(homeScore, 10),
      away_score: parseInt(awayScore, 10),
    };

    fetch(`${apiBaseUrl}/games/${selectedGameId}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updatedScores),
    })
    .then(response => response.json())
    .then(data => {
      setGame(data); 
      alert('Game scores updated successfully');
    })
    .catch(error => console.error('Error updating game scores:', error));
  };

  if (!games.length) return <div>Loading games...</div>;

  return (
    <div className='component-section'>
        <h1>Game Detail</h1>
        <select
          value={selectedGameId}
          onChange={(e) => setSelectedGameId(e.target.value)}
        >
          <option value="">Select a game</option>
          {games.map((game) => (
            <option key={game.id} value={game.id}>
              {game.date} - {game.home.name} vs. {game.away.name}
            </option>
          ))}
        </select>

        {game && (
            <>
                <p>Date: {game.date} - {game.home.name} {game.home.score} vs. {game.away.name} {game.away.score}</p>
                <Form onSubmit={handleUpdateGame}>
                        <Input 
                                value={homeScore}
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setHomeScore(e.target.value)}
                                placeholder="Home team score"
                        />
                        <Input 
                                value={awayScore}
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setAwayScore(e.target.value)}
                                placeholder="Away team score"
                        />
                        <Button onClick={handleUpdateGame}>Update Game</Button>
                </Form>
                <Button onClick={deleteGame}>Delete Game</Button>
            </>
        )}
    </div>
  );
};

export default Detail;
