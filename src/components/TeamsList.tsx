import React, { useEffect, useState } from 'react';

const TeamsList = () => {
  const [teams, setTeams] = useState([]);
  const apiBaseUrl = process.env.REACT_APP_API_BASE_URL;
  useEffect(() => {
    fetch(`${apiBaseUrl}/teams`)
      .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then(data => setTeams(data))
      .catch(error => console.error('Error fetching data: ', error));
  }, [apiBaseUrl]);
return (
    <div>
        <h1>Teams List</h1>
        <ul>
            {teams.map((team: { id: number, name: string }) => (
                <li key={team.id}>{team.name}</li>
            ))}
        </ul>
    </div>
);
};

export default TeamsList;
