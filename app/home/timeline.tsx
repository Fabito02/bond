import {
  View,
  StyleSheet,
  FlatList,
} from "react-native";
import myTheme from "@/theme/theme";
import TimelineItem from "@/components/TimelineItem";
import { Searchbar } from "react-native-paper";
import { useState, useEffect, useRef } from "react";
import Lucide from "@react-native-vector-icons/lucide";
import { dispensersData } from "@/data";

type DispensersProps = {
  title: string;
  data: {
    id: string;
    title: string;
    image: any;
    tipo: string;
    data: Date;
    volume: number;
  }[]
}

export default function Dispensers() {
  const [data, setData] = useState<DispensersProps[]>([]);

  const flatListRef = useRef(null)
  
  useEffect(() => {
    const dispensersPorHora: { [hora: string]: typeof dispensersData } = dispensersData.reduce(
      (acumulador, atual) => {
        const dateObj = atual.data instanceof Date ? atual.data : new Date(atual.data);
        const horaStr = dateObj.toLocaleTimeString(undefined, { hour: '2-digit' });
        if (!acumulador[horaStr]) acumulador[horaStr] = [];
        acumulador[horaStr].push(atual);
        return acumulador;
      },
      {} as { [hora: string]: typeof dispensersData }
    );

    const dispensersOrdenados = Object.entries(dispensersPorHora)
      .sort(([horaA], [horaB]) => {
        const [hA, mA] = horaA.split(':').map(Number);
        const [hB, mB] = horaB.split(':').map(Number);
        return (hA * 60 + mA) - (hB * 60 + mB);
      })
      .map(([hora, items]) => ({ title: hora, data: items }));

    setData(dispensersOrdenados);
  }, []);

  useEffect(() => {
    const hoje = new Date();
    hoje.setHours(0, 0, 0, 0);
    const agora = new Date();
    const horaAtualStr = agora.toLocaleTimeString(undefined, { hour: '2-digit' });
    const indiceAlvo = data.findIndex(item => item.title === horaAtualStr);

    if (indiceAlvo !== -1) {
      setTimeout(() => {
        (flatListRef.current as FlatList<any> | null)?.scrollToIndex({
          animated: true,
          index: indiceAlvo,
          viewPosition: 0.5,
        });
      }, 100);
    }
  }, [data]);

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
    borderRadius: 16,
    marginBottom: 16,
    backgroundColor: myTheme.colors.onPrimaryContainer,
  },
});
