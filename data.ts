import { DispenserType } from "@/types";

const hoje = new Date();
const formatarData = (data: Date) => data.toISOString().split("T")[0];

export const DispensersData: DispenserType[] = [
  {
    id: 1,
    title: "Sol",
    image: require("@assets/sol.png"),
    tipo: "gato",
    volume: 0.07,
    hora: "08:00",
    ativo: true,
    tipoRepeticao: "diário",
    data: formatarData(new Date(hoje)),
  },
  {
    id: 2,
    title: "Algodão",
    image: require("@assets/algodao.png"),
    tipo: "coelho",
    volume: 0.05,
    hora: "08:10",
    ativo: true,
    tipoRepeticao: "mensal",
    data: formatarData(new Date(hoje.getFullYear(), hoje.getMonth(), hoje.getDate() + 2)),
  },
  {
    id: 3,
    title: "Aurora",
    image: require("@assets/aurora.png"),
    tipo: "pássaro",
    volume: 0.02,
    hora: "08:05",
    ativo: false,
    tipoRepeticao: "semanal",
    data: formatarData(new Date(hoje.getFullYear(), hoje.getMonth(), hoje.getDate() + 7)),
  },
  {
    id: 4,
    title: "Teddy",
    image: require("@assets/teddy.png"),
    tipo: "cachorro",
    volume: 0.25,
    hora: "08:03",
    ativo: true,
    tipoRepeticao: "único",
    data: formatarData(new Date(hoje)),
  },
  {
    id: 5,
    title: "Mestre Oogway",
    image: require("@assets/mestre-oogway.png"),
    tipo: "tartaruga",
    volume: 0.03,
    hora: "08:07",
    ativo: true,
    tipoRepeticao: "diário",
    data: formatarData(new Date(hoje.getFullYear(), hoje.getMonth(), hoje.getDate() + 1)),
  }
];
