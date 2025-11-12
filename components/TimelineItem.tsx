import myTheme from "@/theme/theme";
import { View, Image, StyleSheet } from "react-native";
import { TouchableRipple, Text } from "react-native-paper";
import { useRouter } from "expo-router";
import { memo } from "react";
import DispenserItem from "./DispenserItem";

type DispenserType = {
  id: string;
  title: string;
  image: any;
  tipo: string;
  data: Date;
  volume: number;
};

type Props = {
  data: DispenserType[];
};

function TimelineItem({ data }: Props) {
  const router = useRouter();

  const inputDate = new Date(data[0].data);
  const agora = new Date();
  inputDate.setSeconds(0, 0);
  agora.setSeconds(0, 0);

  const setBolinhaCor = (data: string) => {
    if (inputDate.getHours() === agora.getHours()) {
      return myTheme.colors.primary;
    } else if (inputDate.getHours() < agora.getHours()) {
      return myTheme.colors.error;
    } else {
      return myTheme.colors.tertiary;
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.left}>
        <View
          style={[
            styles.bolinha,
            {
              backgroundColor: setBolinhaCor(
                data[0].data.toISOString().slice(0, 10),
              ),
            },
          ]}
        />
        <View style={styles.barra} />
      </View>
      <View style={styles.right}>
        <View style={{ flexDirection: "row", gap: 6 }}>
          <Text variant="labelMedium">
            {data[0].data.toLocaleTimeString(undefined, {
              hour: "2-digit"
            })}h
            {(() => {
              return inputDate.getHours() === agora.getHours() ? " -" : "";
            })()}
          </Text>
          <Text variant="labelMedium" style={{ color: myTheme.colors.primary }}>
            {(() => {
              return inputDate.getHours() === agora.getHours()
                ? "Hora Atual"
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
