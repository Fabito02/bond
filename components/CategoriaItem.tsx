import myTheme from "@/theme/theme";
import { StyleSheet } from "react-native";
import { TouchableRipple, Text } from "react-native-paper";
import { useRouter } from "expo-router";
import CategoriaIcon from "@components/CategoriaIcon";
import { CategoriaType } from "@/types";

type Props = {
  categoria: CategoriaType;
  route?: any
};

function CategoriaItem({ categoria, route}: Props) {
  const router = useRouter();

  return (
    <TouchableRipple
      borderless
      style={styles.categoria}
      onPress={() => {
        router.push(route);
      }}
    >
      <>
        <CategoriaIcon type={categoria} size={60} />
        <Text variant="labelMedium">{categoria.charAt(0).toUpperCase() + categoria.slice(1)}</Text>
      </>
    </TouchableRipple>
  );
}

export default CategoriaItem;

const styles = StyleSheet.create({
  categoria: {
    borderRadius: 22,
    borderTopLeftRadius: 55,
    borderTopRightRadius: 55,
    width: 110,
    flex: 1,
    backgroundColor: myTheme.colors.surfaceContainer,
    marginBottom: 16,
    padding: 10,
    gap: 10,
    alignItems: "center",
  },
});
