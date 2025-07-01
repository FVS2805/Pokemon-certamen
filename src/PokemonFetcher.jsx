import React, { useState, useEffect } from 'react';
import './PokemonFetcher.css';

const PokemonFetcher = () => {
  const [pokemones, setPokemones] = useState([]);
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState(null);
  const [tipo, setTipo] = useState('fire'); // Tipo por defecto
  const [tiposDisponibles, setTiposDisponibles] = useState([]);

  // Cargar lista de tipos al inicio
  useEffect(() => {
    const fetchTipos = async () => {
      const response = await fetch('https://pokeapi.co/api/v2/type');
      const data = await response.json();
      setTiposDisponibles(data.results.map(t => t.name));
    };
    fetchTipos();
  }, []);

  useEffect(() => {
    const fetchPorTipo = async () => {
      try {
        setCargando(true);
        setError(null);
        const response = await fetch(`https://pokeapi.co/api/v2/type/${tipo}`);
        const data = await response.json();

        const pokemonesTipo = data.pokemon.slice(0, 10); // Limita a 10
        const detalles = await Promise.all(
          pokemonesTipo.map(async (p) => {
            const res = await fetch(p.pokemon.url);
            const data = await res.json();
            return {
              id: data.id,
              nombre: data.name,
              imagen: data.sprites.front_default,
              tipos: data.types.map(t => t.type.name)
            };
          })
        );
        setPokemones(detalles);
      } catch (err) {
        setError(err.message);
      } finally {
        setCargando(false);
      }
    };

    fetchPorTipo();
  }, [tipo]);

  return (
    <div>
      <label htmlFor="tipo">Buscar por tipo:</label>
      <select id="tipo" value={tipo} onChange={(e) => setTipo(e.target.value)}>
        {tiposDisponibles.map(t => (
          <option key={t} value={t}>{t}</option>
        ))}
      </select>

      {cargando && <p>Cargando Pokémon...</p>}
      {error && <p>Error: {error}</p>}

      <div className="pokemon-container">
        {pokemones.map(pokemon => (
          <div key={pokemon.id} className="pokemon-card">
            <img src={pokemon.imagen} alt={pokemon.nombre} />
            <h3>{pokemon.nombre}</h3>
            <p>Tipo: {pokemon.tipos.join(', ')}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PokemonFetcher;
