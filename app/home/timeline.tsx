import { View, StyleSheet, FlatList } from "react-native";
import myTheme from "@/theme/theme";
import TimelineItem from "@/components/TimelineItem";
import { Searchbar } from "react-native-paper";
import { useState, useEffect, useRef } from "react";
import Lucide from "@react-native-vector-icons/lucide";
import { DispensersData } from "@/data";
import { DispenserType } from "@/types";

type DispensersProps = {
  title: string;
  data: DispenserType[];
};

export default function Dispensers() {
  const [data, setData] = useState<DispensersProps[]>([]);
  const flatListRef = useRef(null);

  useEffect(() => {
    const dispensersPorData: { [hora: string]: typeof DispensersData } =
      DispensersData.reduce(
        (acumulador, atual) => {
          const dataExecucao = atual.data;
          if (!acumulador[dataExecucao]) acumulador[dataExecucao] = [];
          acumulador[dataExecucao].push(atual);
          return acumulador;
        },
        {} as { [hora: string]: typeof DispensersData },
      );

    const dispensersOrdenados = Object.entries(dispensersPorData)
      .sort(([dataA], [dataB]) => {
        return new Date(dataA).getTime() - new Date(dataB).getTime();
      })
      .map(([data, items]) => ({
        title: data,
        data: items,
      }));

    setData(dispensersOrdenados as DispensersProps[]);
  }, [DispensersData]);

  return (
    <View
      style={{
        backgroundColor: myTheme.colors.surfaceContainer,
        flex: 1,
      }}
    >
      <View style={styles.container}>
        <Searchbar
          placeholder="Pesquisar..."
          value=""
          icon={({ color, size }) => (
            <Lucide name="search" color={color} size={size} />
          )}
          style={styles.searchbar}
          inputStyle={{ color: myTheme.colors.onSurface }}
          iconColor={myTheme.colors.primary}
        />
        <FlatList
          ref={flatListRef}
          data={data}
          keyExtractor={(item) => item.title}
          renderItem={({ item }) => <TimelineItem data={item.data} />}
          showsVerticalScrollIndicator={false}
          numColumns={1}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 16,
    backgroundColor: myTheme.colors.surfaceContainerLowest,
    width: "100%",
  },
  fabStyle: {
    bottom: 16,
    position: "absolute",
    right: 16,
    backgroundColor: myTheme.colors.primary,
  },
  searchbar: {
    borderRadius: 22,
    marginBottom: 16,
    backgroundColor: myTheme.colors.onPrimaryContainer,
  },
});
