export interface Ability {
	name: string;
	isHidden: boolean;
}

interface ExternalAbility {
	is_hidden: boolean;
	ability: {
		name: string;
	}
}

export interface ExternalData {
	id: number;
	name: string;
	abilities: ExternalAbility[]
}

export interface InternalData {
	id: number;
	externalId: number;
	name: string;
	abilities: Ability[]
}

export interface ResultOperation {
  id: number
  name: string
  status: boolean
}

export interface ApiResponse {
	pokemonList: InternalData[];
	syncResults: {
    deleteResults: ResultOperation[];
    createResults: ResultOperation[];
	}
}
