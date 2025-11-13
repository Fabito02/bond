import myTheme from "@/theme/theme";
import { View, Image, StyleSheet } from "react-native";
import { TouchableRipple, Text } from "react-native-paper";
import { useRouter } from "expo-router";
import CategoriaIcon from "./CategoriaIcon";
import Lucide from "@react-native-vector-icons/lucide";
import { DispenserType } from "@/types";

function DispenserItem({ item }: { item: DispenserType }) {
  const router = useRouter();
  const repeticao = item?.tipoRepeticao;
  const hora = item?.hora;

  return (
    <View onTouchEnd={() => {
        router.push(`/dispenser/${item.id}`);
      }} style={{ marginBottom: 16 }}>
      {!item.ativo && (
        <View
          style={{ justifyContent: "center", alignItems: "center" }}
        >
          <Text
            style={{
              position: "absolute",
              zIndex: 2,
              color: "#ffffff",
              fontSize: 18,
              fontFamily: "PoppinsSemiBold",
              transform: [{ translateY: 62 }],
            }}
          >
            Inativo
          </Text>

          <View style={styles.inativo}></View>
        </View>
      )}
      <TouchableRipple
        borderless
        style={styles.dispenser}
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
            <View
              style={{ flexDirection: "row", gap: 4, alignItems: "center" }}
            >
              <Lucide
                name="refresh-cw"
                size={16}
                color={myTheme.colors.primary}
              />
              <Text variant="bodySmall" style={{ marginRight: 6 }}>
                {repeticao.charAt(0).toUpperCase() + repeticao.slice(1) ||
                  "Não programado"}
              </Text>
              <Lucide name="clock" size={16} color={myTheme.colors.primary} />
              <Text variant="bodySmall">{hora || "Não programado"}</Text>
            </View>
          </View>
          <CategoriaIcon
            type={item.tipo}
            size={25}
            style={{ position: "absolute", right: 0, top: 0 }}
          />
        </View>
      </TouchableRipple>
    </View>
  );
}

export default DispenserItem;

const styles = StyleSheet.create({
  inativo: {
    width: "100%",
    height: 124,
    minHeight: 85,
    overflow: "hidden",
    opacity: 0.9,
    backgroundColor: "#a9a9a9",
    zIndex: 1,
    position: "absolute",
    top: 0,
    left: 0,
    borderRadius: 16,
  },
  ativo: {
    display: "none",
  },
  dispenser: {
    borderRadius: 18,
    width: "100%",
    backgroundColor: myTheme.colors.surfaceContainer,
    padding: 12,
    overflow: "hidden",
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
