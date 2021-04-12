import { InternalData } from './../../../types/index';
import { mapExternalToInternal } from "../../../utils/mapPokemonData";
import { syncDb } from '../../../services/sync-db'

let pokemonsDB: InternalData[] = [];

export default async (req, res) => {
	const nArray = [...new Array(parseInt(req.query.untilID))].map((_, i) => i + 1);
  const arrayPromises = nArray.map(async (i) => {
		const res = await fetch('https://pokeapi.co/api/v2/pokemon/' + i);
		const data = await res.json();
  	return data;
  });

  const pokemonsExternal = await Promise.all(arrayPromises);

	const pokemonList = pokemonsExternal.map((pokemon, i) => {
    const mappedPokemon = mapExternalToInternal({ externalData: pokemon, id: i });
    return mappedPokemon;
  });

	const internalPokemons = pokemonsDB.length === 0 ? pokemonList : pokemonsDB;
	const syncResults = await syncDb({ internalData: internalPokemons, externalData: pokemonsExternal });

	// simulates DB, but its just a global var saving data in the heap
	pokemonsDB = pokemonList;

	console.log(syncResults);
	res.send({
		syncResults,
		pokemonList
	});
}