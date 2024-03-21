import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Input from './Input'; 
import Button from './Button';
import Form from './Form';

interface Game {
  id: number;
  date: string;
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
  const { id } = useParams<string>();
  const [game, setGame] = useState<Game | null>(null);
  const [homeScore, setHomeScore] = useState<string>('');
  const [awayScore, setAwayScore] = useState<string>('');
  const navigate = useNavigate();
  const apiBaseUrl = process.env.REACT_APP_API_BASE_URL;

  useEffect(() => {
    if (id) {
      fetchGameDetails(id);
    }
  }, [id, apiBaseUrl]);

  const fetchGameDetails = (gameId: string) => {
    fetch(`${apiBaseUrl}/games/${gameId}`)
      .then(response => response.json())
      .then(data => {
        console.log(data);
        setGame(data);
        setHomeScore(data.home.score.toString());
        setAwayScore(data.away.score.toString());
      })
      .catch(error => console.error('Error:', error));
  };

  const deleteGame = () => {
    if (!id) return;

    fetch(`${apiBaseUrl}games/${id}`, { method: 'DELETE' })
      .then(() => navigate('/'))
      .catch(error => console.error('Error:', error));
  };

  const handleUpdateGame = (e: React.FormEvent) => {
    e.preventDefault();
    const updatedScores = {
      home_score: parseInt(homeScore, 10),
      away_score: parseInt(awayScore, 10),
    };
  
    fetch(`${apiBaseUrl}games/${id}`, {
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
  

  if (!game) return <div>Loading...</div>;

  const formattedDate = new Date(game.date).toLocaleDateString("en-US", {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    timeZoneName: 'short'
  });

return (
    <div className='component-section'>
        <h1>Game Detail</h1>
        <p>Date: {formattedDate} - {game.home.name} {game.home.score} vs. {game.away.name} {game.away.score}</p>
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
    </div>
);
};

export default Detail;
