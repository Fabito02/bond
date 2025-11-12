import {
  View,
  StyleSheet,
  NativeSyntheticEvent,
  NativeScrollEvent,
  FlatList,
} from "react-native";
import myTheme from "@/theme/theme";
import DispenserItem from "@/components/DispenserItem";
import { AnimatedFAB, Searchbar } from "react-native-paper";
import { useState } from "react";
import Lucide from "@react-native-vector-icons/lucide";
import { useRouter } from "expo-router";
import { dispensersData } from "@/data";

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
          data={dispensersData}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => <DispenserItem item={item} />}
          showsVerticalScrollIndicator={false}
          numColumns={1}
          onScroll={onScroll}
        />
      </View>
      <AnimatedFAB
        color="white"
        icon={({ color, size }) => (
          <Lucide name="plus" color={color} size={size} />
        )}
        label={"Novo dispositivo"}
        extended={isExtended}
        // onPress={() => router.push("/novo-dispenser")}
        visible={visible}
        iconMode={"dynamic"}
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
  },
  searchbar: {
    borderRadius: 16,
    marginBottom: 16,
    backgroundColor: myTheme.colors.onPrimaryContainer,
  },
});
