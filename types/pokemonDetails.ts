export interface PokemonDetails {
  name: string;
  types: string[];
  image: string;
  height: number;
  weight: number;
  abilities: PokemonAbility[];
  stats: PokemonStat[];
  crySound: string;
  moves: PokemonMove[];
  pokedexEntry: string;
}

export interface PokemonAbility {
  name: string;
  hidden: boolean;
}

export interface PokemonStat {
  name: string;
  value: number;
}

export interface PokemonMove {
  name: string;
  levelLearnedAt: number;
  MoveLearnMethod: string;
}
