import { View, StyleSheet, FlatList, RefreshControl } from "react-native";
import myTheme from "@/theme/theme";
import DispenserItem from "@/components/DispenserItem";
import { FAB, Searchbar } from "react-native-paper";
import Lucide from "@react-native-vector-icons/lucide";
import { DispenserType } from "@/types";
import { useDispositivosSheet } from "@/components/DispositivosBottomSheetProvider";
import { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

type DispensersProps = {
  visible: boolean;
};

export default function Dispensers({ visible }: DispensersProps) {
  const { openSheet } = useDispositivosSheet();

  const [dispensers, setDispensers] = useState<DispenserType[]>([]);
  const [refreshing, setRefreshing] = useState(false);

  const getDispensers = async () => {
    try {
      const dispensers = await AsyncStorage.getItem("dispensersData");
      if (dispensers !== null) {
        setDispensers(JSON.parse(dispensers));
      } else {
        setDispensers([]);
      }
    } catch (error) {
      setDispensers([]);
    }
  };

  useEffect(() => {
    getDispensers();
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    await getDispensers();
    setRefreshing(false);
  };

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
          data={dispensers}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              colors={[myTheme.colors.primary]}
            />
          }
          keyExtractor={(item) => String(item.id)}
          renderItem={({ item }) => (
            <DispenserItem item={item as DispenserType} />
          )}
          showsVerticalScrollIndicator={false}
          numColumns={1}
          ListFooterComponent={<View style={{ height: 100 }} />}
        />
      </View>
      <FAB
        color="white"
        icon={({ color, size }) => (
          <Lucide name="plus" color={color} size={size} />
        )}
        onPress={openSheet}
        visible={visible}
        style={[styles.fabStyle]}
      />
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
    borderRadius: 100,
  },
  searchbar: {
    borderRadius: 22,
    marginBottom: 10,
    backgroundColor: myTheme.colors.onPrimaryContainer,
  },
});
