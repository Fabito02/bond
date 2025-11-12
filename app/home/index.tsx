import { View, StyleSheet } from "react-native";
import { TouchableRipple, Text, Searchbar } from "react-native-paper";
import myTheme from "@/theme/theme";
import Lucide from "@react-native-vector-icons/lucide";
import CategoriaItem from "@/components/CategoriaItem";
import { ScrollView } from "react-native-gesture-handler";
import DispenserItem from "@/components/DispenserItem";
import { dispensersData } from "@/data";

export default function Home() {

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
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.container}>
          <View style={styles.titulo}>
            <View style={styles.barraTitulo}></View>
            <Text
              variant="titleMedium"
              style={{ color: myTheme.colors.primary }}
            >
              Meus Dispensers
            </Text>
          </View>
          <View>
            <View>
              {dispensersData.map((item) => (
                <DispenserItem key={item.id} item={item} />
              ))}
            </View>
          </View>
          <View style={styles.titulo}>
            <View style={styles.barraTitulo}></View>
            <Text
              variant="titleMedium"
              style={{ color: myTheme.colors.primary }}
            >
              Categorias
            </Text>
          </View>
          <View>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              <View style={{ gap: 16, height: "auto", flexDirection: "row" }}>
                <CategoriaItem categoria="cachorro" />
                <CategoriaItem categoria="gato" />
                <CategoriaItem categoria="peixe" />
                <CategoriaItem categoria="pássaro" />
                <CategoriaItem categoria="roedor" />
                <CategoriaItem categoria="coelho" />
                <CategoriaItem categoria="tartaruga" />
                <CategoriaItem categoria="outro" />
              </View>
            </ScrollView>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    width: "100%",
    gap: 16,
  },
  barraTitulo: {
    width: 5,
    backgroundColor: myTheme.colors.primary,
    borderRadius: 8,
    height: 25,
  },
  titulo: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  searchbar: {
    borderRadius: 16,
    marginHorizontal: 16,
    marginBottom: 16,
    backgroundColor: myTheme.colors.onPrimaryContainer,
  },
});
