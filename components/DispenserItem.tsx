import myTheme from "@/theme/theme";
import { View, Image, StyleSheet } from "react-native";
import { TouchableRipple, Text } from "react-native-paper";
import { useRouter } from "expo-router";
import CategoriaIcon from "./CategoriaIcon";
import Lucide from "@react-native-vector-icons/lucide";
import { DispenserType } from "@/types";

function DispenserItem({
  item,
}: {
  item: DispenserType;
}) {
  const router = useRouter();

  const dataDispenser = () => {
    const data = item.data;
    const dia = String(data?.getDate()).padStart(2, "0");
    const mes = String(data?.getMonth() + 1).padStart(2, "0");
    const ano = data?.getFullYear();
    return `${dia}/${mes}/${ano}`;
  };

  const horaDispenser = () => {
    const data = item.data;
    const horas = String(data.getHours()).padStart(2, "0");
    const minutos = String(data.getMinutes()).padStart(2, "0");
    return `${horas}:${minutos}`;
  };

  return (
    <TouchableRipple
      borderless
      style={styles.dispenser}
      onPress={() => {
        // router.push(``);
      }}
    >
      <View style={styles.dispenserContent}>
        <Image source={item.image} style={styles.imagem} />
        <View style={{ width: "70%", marginVertical: 4, gap: 3 }}>
          <Text variant="labelLarge" style={{ flex: 1, fontSize: 18 }}>
            {item.title}
          </Text>
          <Text variant="bodySmall">
            {item.tipo.charAt(0).toUpperCase() + item.tipo.slice(1)}
          </Text>
          <Text variant="bodySmall">
            {"Quantidade: " + item.volume || 0} Kg
          </Text>
          <View style={{ flexDirection: "row", gap: 4, alignItems: "center" }}>
            <Lucide name="calendar-days" size={16} color={myTheme.colors.primary} />
            <Text variant="bodySmall" style={{ marginRight: 6 }}>
              {dataDispenser() || "Não programado"}
            </Text>
            <Lucide name="clock" size={16} color={myTheme.colors.primary} />
            <Text variant="bodySmall">
              {horaDispenser() || "Não programado"}
            </Text>
          </View>
        </View>
        <CategoriaIcon
          type={item.tipo }
          size={25}
          style={{ position: "absolute", right: 0, top: 0 }}
        />
      </View>
    </TouchableRipple>
  );
}

export default DispenserItem;

const styles = StyleSheet.create({
  dispenser: {
    borderRadius: 18,
    width: "100%",
    backgroundColor: myTheme.colors.surfaceContainer,
    marginBottom: 16,
    padding: 12,
  },
  dispenserContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
  },
  imagem: {
    width: 100,
    height: "100%",
    minHeight: 90,
    borderRadius: 14,
  },
});
