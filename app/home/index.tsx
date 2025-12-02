import { View, StyleSheet, ScrollView} from "react-native";
import { TouchableRipple, Text, Searchbar } from "react-native-paper";
import myTheme from "@/theme/theme";
import Lucide from "@react-native-vector-icons/lucide";
import CategoriaItem from "@/components/CategoriaItem";
import DispenserItem from "@/components/DispenserItem";
import { DispensersData } from "@/data";
import { DispenserType } from "@/types";

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
            <Text
              variant="titleMedium"
              style={{ color: myTheme.colors.primary }}
            >
              Meus Dispensers
            </Text>
          </View>
          <View>
            <View>
              {DispensersData.map((item) => (
                <DispenserItem key={item.id} item={item as DispenserType} />
              ))}
            </View>
          </View>
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
              <View style={{ gap: 16, height: "auto", flexDirection: "row" }}>
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
  titulo: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  searchbar: {
    borderRadius: 22,
    marginHorizontal: 16,
    marginBottom: 16,
    backgroundColor: myTheme.colors.onPrimaryContainer,
  },
});
