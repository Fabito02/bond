import myTheme from "@/theme/theme";
import { View, Image, StyleSheet } from "react-native";
import { Text } from "react-native-paper";
import { useRouter } from "expo-router";
import { memo } from "react";
import DispenserItem from "./DispenserItem";
import { DispenserType } from "@/types";

type Props = {
  data: DispenserType[];
};

function TimelineItem({ data }: Props) {
  const router = useRouter();

  const inputDate = data[0].data;
  const agora = new Date().toISOString().split("T")[0];

  const setBolinhaCor = (data: string) => {
    if (inputDate === agora) {
      return myTheme.colors.primary;
    } else if (inputDate < agora) {
      return myTheme.colors.error;
    } else {
      return myTheme.colors.tertiary;
    }
  };
  
  const formatarDataLocal = (dataISO: string) => {
    const [ano, mes, dia] = dataISO.split("-").map(Number);
    const data = new Date(ano, mes - 1, dia); // <-- mês começa do 0
    return data.toLocaleDateString();
  };

  return (
    <View style={styles.container}>
      <View style={styles.left}>
        <View
          style={[
            styles.bolinha,
            {
              backgroundColor: setBolinhaCor(
                data[0].data,
              ),
            },
          ]}
        />
        <View style={styles.barra} />
      </View>
      <View style={styles.right}>
        <View style={{ flexDirection: "row", gap: 6 }}>
          <Text variant="labelMedium">
            {formatarDataLocal(data[0].data)}
            {(() => {
              return inputDate === agora ? " -" : "";
            })()}
          </Text>
          <Text variant="labelMedium" style={{ color: myTheme.colors.primary }}>
            {(() => {
              return inputDate === agora
                ? "Data Atual"
                : "";
            })()}
          </Text>
        </View>
        {data.map((dispenser: DispenserType) => (
          <DispenserItem key={dispenser.id} item={dispenser} />
        ))}
      </View>
    </View>
  );
}

export default memo(TimelineItem);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: "100%",
    height: "100%",
    flexDirection: "row",
    marginBottom: 16,
  },
  dispenser: {
    borderRadius: 18,
    width: "100%",
    backgroundColor: myTheme.colors.surfaceContainer,
    paddingRight: 20,
    padding: 10,
  },
  dispenserContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
  },
  imagem: {
    width: 95,
    height: "100%",
    minHeight: 90,
    borderRadius: 14,
  },
  chipArea: {
    backgroundColor: myTheme.colors.tertiary,
    borderRadius: 16,
    padding: 4,
    paddingLeft: 8,
    paddingRight: 8,
    position: "absolute",
    right: 0,
    bottom: 0,
    color: "#ffffff",
  },
  barra: {
    flex: 1,
    width: 5,
    height: "auto",
    backgroundColor: myTheme.colors.outline,
    borderRadius: 18,
    marginRight: 12,
  },
  right: {
    flex: 1,
    flexDirection: "column",
    justifyContent: "space-between",
    gap: 12,
  },
  left: {
    width: 30,
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    gap: 18,
  },
  bolinha: {
    width: 16,
    height: 16,
    borderRadius: "50%",
    transform: [{ translateX: -5.5 }, { translateY: 2 }],
  },
});
