import {
  View,
  StyleSheet,
  ScrollView,
  RefreshControl,
  FlatList,
} from "react-native";
import { TouchableRipple, Text, Searchbar } from "react-native-paper";
import myTheme from "@/theme/theme";
import Lucide from "@react-native-vector-icons/lucide";
import CategoriaItem from "@/components/CategoriaItem";
import DispenserItem from "@/components/DispenserItem";
import { DispenserType } from "@/types";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useState, useEffect } from "react";

export default function Home() {
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
        flex: 1,
        backgroundColor: myTheme.colors.surfaceContainerLowest,
      }}
    >
      <Searchbar
        placeholder="Pesquisar..."
        value=""
        icon={({ color, size }) => (
          <Lucide name="search" color={color} size={size} />
        )}
        style={styles.searchbar}
        inputStyle={{ color: myTheme.colors.onSurface }}
        iconColor={myTheme.colors.primary}
        right={() => (
          <TouchableRipple onPress={() => {}} style={{ marginRight: 16 }}>
            <Lucide
              name="sliders-horizontal"
              color={myTheme.colors.primary}
              size={24}
            />
          </TouchableRipple>
        )}
      />
      <View style={styles.container}>
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
          ListEmptyComponent={() => (
            <View
              style={{
                alignItems: "center",
                flexDirection: "row",
                justifyContent: "center",
                height: 100,
              }}
            >
              <Lucide
                name="package-search"
                color={myTheme.colors.onSurfaceVariant}
                size={26}
                style={{ marginRight: 8 }}
              />
              <Text
                variant="titleMedium"
                style={{
                  color: myTheme.colors.onSurfaceVariant,
                  fontSize: 14,
                }}
              >
                Nenhum dispenser encontrado
              </Text>
            </View>
          )}
          ListHeaderComponent={
            <View style={styles.titulo}>
              <Text
                variant="titleMedium"
                style={{ color: myTheme.colors.primary }}
              >
                Meus Dispensers
              </Text>
            </View>
          }
          ListFooterComponent={
            <View>
              <View style={styles.titulo}>
                <Text
                  variant="titleMedium"
                  style={{ color: myTheme.colors.primary }}
                >
                  Categorias
                </Text>
              </View>
              <View>
                <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                  <View
                    style={{ gap: 16, height: "auto", flexDirection: "row" }}
                  >
                    <CategoriaItem categoria="cachorro" />
                    <CategoriaItem categoria="gato" />
                    <CategoriaItem categoria="pássaro" />
                    <CategoriaItem categoria="roedor" />
                    <CategoriaItem categoria="coelho" />
                    <CategoriaItem categoria="tartaruga" />
                    <CategoriaItem categoria="outro" />
                  </View>
                </ScrollView>
              </View>
            </View>
          }
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    width: "100%",
    gap: 16,
  },
  titulo: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 8,
  },
  searchbar: {
    borderRadius: 22,
    marginHorizontal: 16,
    marginBottom: 10,
    backgroundColor: myTheme.colors.onPrimaryContainer,
  },
});
