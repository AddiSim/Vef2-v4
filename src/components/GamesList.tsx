import React, { useEffect, useState } from 'react';

const GamesList = () => {
    const [games, setGames] = useState<Game[]>([]); 

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
    }, [apiBaseUrl]); 

    return (
        <div>
            <h1>Games List</h1>
            <ul>
                {games.map((game: Game) => ( 
                    <li key={game.id}>
                        {game.date} - {game.home.name} {game.home.score} vs. {game.away.name} {game.away.score}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default GamesList;
