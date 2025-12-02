import {
  View,
  StyleSheet,
  NativeSyntheticEvent,
  NativeScrollEvent,
  FlatList,
} from "react-native";
import myTheme from "@/theme/theme";
import DispenserItem from "@/components/DispenserItem";
import { FAB, Searchbar } from "react-native-paper";
import { useState } from "react";
import Lucide from "@react-native-vector-icons/lucide";
import { useRouter } from "expo-router";
import { DispensersData } from "@/data";
import { DispenserType } from "@/types";

type DispensersProps = {
  visible: boolean;
};

export default function Dispensers({ visible }: DispensersProps) {
  const [isExtended, setIsExtended] = useState(true);
  const router = useRouter();

  const onScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const currentScrollPosition =
      Math.floor(event.nativeEvent.contentOffset.y) ?? 0;
    setIsExtended(currentScrollPosition <= 0);
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
          data={DispensersData}
          keyExtractor={(item) => String(item.id)}
          renderItem={({ item }) => <DispenserItem item={item as DispenserType} />}
          showsVerticalScrollIndicator={false}
          numColumns={1}
          onScroll={onScroll}
        />
      </View>
      <FAB
        color="white"
        icon={({ color, size }) => (
          <Lucide name="plus" color={color} size={size} />
        )}
        // onPress={() => router.push("/novo-dispenser")}
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
    borderRadius: 100
  },
  searchbar: {
    borderRadius: 22,
    marginBottom: 16,
    backgroundColor: myTheme.colors.onPrimaryContainer,
  },
});
