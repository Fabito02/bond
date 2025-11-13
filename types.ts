export type CategoriaType =
  | "cachorro"
  | "gato"
  | "pássaro"
  | "tartaruga"
  | "roedor"
  | "coelho"
  | "outro";

export type DispenserType = {
  id: number;
  title: string;
  image: any;
  tipo: CategoriaType;
  volume: number;
  hora: string;
  ativo: boolean;
  tipoRepeticao: "único" | "diário" | "semanal" | "mensal";
  data: string;
};
