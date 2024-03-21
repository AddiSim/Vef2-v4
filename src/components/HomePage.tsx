import React, { useEffect, useState } from 'react';

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

  const HomePage = () => {
    const [games, setGames] = useState<Game[]>([]);
    const [teams, setTeams] = useState<Team[]>([]);
    const [newTeamName, setNewTeamName] = useState('');
    const apiBaseUrl = process.env.REACT_APP_API_BASE_URL;

    useEffect(() => {
        fetch(`${apiBaseUrl}/games`)
            .then(response => response.json())
            .then((data: Game[]) => { 
                const mappedAndSlicedGames = data
                  .map((game: Game) => ({ 
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
                  }))
                  .slice(-5); 
                setGames(mappedAndSlicedGames);
            })
            .catch(error => console.error('Error fetching data: ', error));

        fetch(`${apiBaseUrl}teams`)
            .then(response => response.json())
            .then(data => setTeams(data))
            .catch(error => console.error('Error fetching teams:', error));
    }, [apiBaseUrl]);

    const handleAddTeam = (e: React.FormEvent) => {
        e.preventDefault(); 
    
        const teamData = { name: newTeamName };
        fetch(`${apiBaseUrl}/teams`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(teamData),
        })
        .then(response => response.json())
        .then(() => {
          setNewTeamName(''); 
        })
        .catch(error => console.error('Error adding team:', error));
      };

    return (
    <div>
        <section className='component-section'>
           <h2>Seinustu fimm leikir</h2>
          <ul>
            {games.map((game: Game) => (
                <li key={game.id}>
                {game.date} - {game.home.name} {game.home.score} vs. {game.away.name} {game.away.score}
                </li>
            ))}
           </ul>
        </section>
        <section className='component-section'>
        <h2>Uppfærsla fyrir lið</h2>
        <form onSubmit={handleAddTeam}>
            <input 
            type="text"
            value={newTeamName}
            onChange={(e) => setNewTeamName(e.target.value)}
            placeholder="Nafn liðs"
            />
            <button type="submit">Bæta við liði</button>
        </form>
        
        <ul>
            {teams.map((team) => (
            <li key={team.id}>{team.name}</li> 
            ))}
        </ul>
        </section>
  </div>
);
};

export default HomePage;