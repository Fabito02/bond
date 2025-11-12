import myTheme from "@/theme/theme";
import { View } from "react-native";
import { useState, useEffect } from "react";
import Lucide from "@react-native-vector-icons/lucide";
import { DispenserType } from "@/types";

type Props = {
  type:
    | "cachorro"
    | "gato"
    | "pássaro"
    | "tartaruga"
    | "roedor"
    | "peixe"
    | "coelho"
    | "outro";
  size?: number;
  style?: any;
};

function CategoriaIcon({ type, size, style }: Props) {
  const iconMap = {
    cachorro: { cor: "#FF8A8A", icon: "dog" },
    gato: { cor: "#F4E572", icon: "cat" },
    pássaro: { cor: "#F6BF62", icon: "bird" },
    tartaruga: { cor: "#96CE97", icon: "turtle" },
    roedor: { cor: "#B3ABE9", icon: "rat" },
    peixe: { cor: "#93C9FF", icon: "fish" },
    coelho: { cor: "#97DEDC", icon: "rabbit" },
    outro: { cor: "gray", icon: "paw-print" },
  } as const;

  const { cor, icon } = iconMap[type] || iconMap.outro;

  return (
    <View
      style={[
        {
          width: size ? size + size / 2 : 34,
          height: size ? size + size / 2 : 34,
          borderRadius: size ? size : 34,
          backgroundColor: cor,
          justifyContent: "center",
          alignItems: "center",
        },
        style,
      ]}
    >
      <Lucide name={icon} size={size || 24} color="#fff" />
    </View>
  );
}

export default CategoriaIcon;
