import myTheme from "@/theme/theme";
import { View } from "react-native";
import { useState, useEffect } from "react";
import Lucide from "@react-native-vector-icons/lucide";
import { CategoriaType, DispenserType } from "@/types";
import { StyleProps } from "react-native-reanimated";

type Props = {
  type: CategoriaType
  size?: number;
  style?: StyleProps;
};

function CategoriaIcon({ type, size, style }: Props) {
  const iconMap = {
    cachorro: { cor: "#FF8A8A", icon: "dog" },
    gato: { cor: "#F4E572", icon: "cat" },
    pássaro: { cor: "#F6BF62", icon: "bird" },
    tartaruga: { cor: "#96CE97", icon: "turtle" },
    roedor: { cor: "#B3ABE9", icon: "rat" },
    coelho: { cor: "#97DEDC", icon: "rabbit" },
    outro: { cor: "#6FACE9", icon: "paw-print" },
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
        style as StyleProps,
      ]}
    >
      <Lucide name={icon} size={size || 24} color="#fff" />
    </View>
  );
}

export default CategoriaIcon;
