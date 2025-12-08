export type CategoriaType =
  | "cachorro"
  | "gato"
  | "pássaro"
  | "tartaruga"
  | "roedor"
  | "coelho"
  | "outro";

export type DispenserType = {
  id: string;
  title: string | null;
  image: string | null;
  tipo: CategoriaType | null;
  porcao: number | null;
  refeicoes: number | null;
  ativo: boolean | null;
  descricao: string | null;
};

export type UserType = {
  id: number;
  nome: string;
  email: string;
  senha: string;
  dataCadastro: string;
};
