import { InternalData } from './../../../types/index';
import { mapExternalToInternal } from "../../../utils/mapPokemonData";
import { fetchPokemons } from "../../../utils/fetchPokemons";
import { syncDb } from '../../../services/sync-db'

let pokemonsDB: InternalData[] = [];

export default async (req, res) => {
	const pokemonsExternal = await fetchPokemons({ untilID: parseInt(req.query.untilID) })

	const pokemonList = pokemonsExternal.map((pokemon, i) => {
    const mappedPokemon = mapExternalToInternal({ externalData: pokemon, id: i });
    return mappedPokemon;
  });

	const internalPokemons = pokemonsDB.length === 0 ? pokemonList : pokemonsDB;
	const syncResults = await syncDb({ internalData: internalPokemons, externalData: pokemonsExternal });

	// simulates DB, but its just a global var saving data in the heap
	pokemonsDB = pokemonList;

	res.send({
		syncResults,
		pokemonList
	});
}