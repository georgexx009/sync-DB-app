import { fetchPokemons, mapExternalToInternal, updatePokemonsDB, getPokemonsDB } from '../../../utils';
import { syncDb } from '../../../services/sync-db'

export default async (req, res) => {
	const pokemonsExternal = await fetchPokemons({ untilID: parseInt(req.query.untilID) })

	const pokemonList = pokemonsExternal.map((pokemon, i) => {
    const mappedPokemon = mapExternalToInternal({ externalData: pokemon, id: i });
    return mappedPokemon;
  });

	const pokemonsDB = getPokemonsDB();

	const internalPokemons = pokemonsDB.length === 0 ? pokemonList : pokemonsDB;
	const syncResults = await syncDb({ internalData: internalPokemons, externalData: pokemonsExternal });

	// simulates DB, but its just a global var saving data in the heap
	updatePokemonsDB({ pokemonList });

	res.send({
		syncResults,
		pokemonList
	});
}