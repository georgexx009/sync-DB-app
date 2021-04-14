import { InternalData } from "../types";

let pokemonsDB: InternalData[] = [];

export const updatePokemonsDB = ({ pokemonList }: { pokemonList: InternalData[]}) => {
	pokemonsDB = pokemonList;
}

export const getPokemonsDB = () => pokemonsDB;