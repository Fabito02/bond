import { UserType } from "@/types";

export const UserData: UserType = {
  id: 1,
  nome: "João",
  email: "joao@email.com",
  senha: "senha123",
  dataCadastro: new Date().toLocaleString(),
};