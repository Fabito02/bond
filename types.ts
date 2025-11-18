export type CategoriaType =
  | "cachorro"
  | "gato"
  | "pássaro"
  | "tartaruga"
  | "roedor"
  | "coelho"
  | "outro";

export type RepeticaoType = "único" | "diário" | "semanal" | "mensal";

export type DispenserType = {
  id: number;
  title: string;
  image: any;
  tipo: CategoriaType;
  volume: number;
  hora: string;
  ativo: boolean;
  tipoRepeticao: RepeticaoType;
  data: string;
  descricao: string;
};
