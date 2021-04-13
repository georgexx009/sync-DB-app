export const fetchPokemons = async ({ untilID = 5 }: { untilID?: number} = {}) => {
  const nArray = [...new Array(untilID)].map((_, i) => i + 1);
  const arrayPromises = nArray.map(async (i) => {
		const res = await fetch('https://pokeapi.co/api/v2/pokemon/' + i);
		const data = await res.json();
  	return data;
  });

  const pokemonsExternal = await Promise.all(arrayPromises);

	return pokemonsExternal;
}