import React, { useEffect, useState } from 'react';
import '../components.css';

interface Game {
  id: number;
  date: string;
  home: {
    name: string;
    score: number;
  };
  away: {
    name: string;
    score: number;
  };
}

interface Team {
  id: number;
  name: string;
  slug: string; 
}

const Yfirlit = () => {
  const [games, setGames] = useState<Game[]>([]);
  const [teams, setTeams] = useState<Team[]>([]);
  const [newGame, setNewGame] = useState({
    homeId: '',
    awayId: '',
    homeScore: '',
    awayScore: '',
    date: '',
  });
  const apiBaseUrl = process.env.REACT_APP_API_BASE_URL;

  useEffect(() => {
    fetch(`${apiBaseUrl}/games`)
            .then(response => response.json())
            .then((data: Game[]) => { 
                const mappedGames = data.map((game: Game) => ({ 
                    id: game.id,
                    date: new Date(game.date).toLocaleDateString("en-US", {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                    }),
                    home: {
                        name: game.home.name,
                        score: game.home.score,
                    },
                    away: {
                        name: game.away.name,
                        score: game.away.score,
                    }
                }));
                setGames(mappedGames);
            })
            .catch(error => console.error('Error fetching data: ', error));

    // Fetch Teams
    fetch(`${apiBaseUrl}/teams`)
      .then(response => response.json())
      .then(data => setTeams(data))
      .catch(error => console.error('Error fetching teams:', error));
  }, [apiBaseUrl]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement> | React.ChangeEvent<HTMLSelectElement>) => {
    setNewGame({ ...newGame, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const { homeId, awayId, homeScore, awayScore, date } = newGame;

    if (!homeId || !awayId || !homeScore || !awayScore || !date) {
      alert('Please fill in all fields.');
      return;
    }

    fetch(`${apiBaseUrl}games`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        home: homeId,
        away: awayId,
        home_score: parseInt(homeScore, 10),
        away_score: parseInt(awayScore, 10),
        date,
      }),
    })
    .then((response) => {
      if (!response.ok) {
        throw new Error('Ekki gekk að búa til leik');
      }
      return response.json();
    })
    .then(() => {
      alert('Leikur búinn til!');
    })
    .catch((error) => {
      console.error('Error creating game:', error);
      alert('Villa við að búa til leik, reyndu aftur.');
    });
  };

  return (
    <div className='grid'>
      <section className='component-section'>
        <h2>Leikir</h2>
        <ul>
            {games.map((game: Game) => ( 
                <li key={game.id}>
                    {game.date} - {game.home.name} {game.home.score} vs. {game.away.name} {game.away.score}
                </li>
            ))}
        </ul>
      </section>
      <section className='component-section'>
        <h2>Lið</h2>
        <ul>
          {teams.map(team => (
            <li key={team.id}>
              {team.id} - {team.name}
            </li>
          ))}
        </ul>
      </section>
      <section className='component-section'>
        <h2>Búa til nýjan leik</h2>
        <form onSubmit={handleSubmit}>
          <select name="homeId" value={newGame.homeId} onChange={handleInputChange} required>
            <option value="">Veldu heimalið</option>
            {teams.map(team => (
              <option key={team.id} value={team.id}>{team.name}</option>
            ))}
          </select>
          <select name="awayId" value={newGame.awayId} onChange={handleInputChange} required>
            <option value="">Veldu gestalið</option>
            {teams.map(team => (
              <option key={team.id} value={team.id}>{team.name}</option>
            ))}
          </select>
          <input
            type="number"
            name="homeScore"
            value={newGame.homeScore}
            onChange={handleInputChange}
            placeholder="Mörk heimaliðs"
            required
          />
          <input
            type="number"
            name="awayScore"
            value={newGame.awayScore}
            onChange={handleInputChange}
            placeholder="Mörk gestana"
            required
          />
          <input
            type="date"
            name="date"
            value={newGame.date}
            onChange={handleInputChange}
            required
          />
          <button type="submit">Búa til leik</button>
        </form>
      </section>
    </div>
  );
};

export default Yfirlit;