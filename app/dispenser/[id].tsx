import { View, StyleSheet, Image } from "react-native";
import myTheme from "@/theme/theme";
import { Appbar, TextInput } from "react-native-paper";
import { useEffect, useState } from "react";
import Lucide from "@react-native-vector-icons/lucide";
import { useRouteInfo, useRouter } from "expo-router/build/hooks";
import { useEvent } from "react-native-reanimated";
import { DispensersData } from "@/data";
import { CategoriaType, DispenserType } from "@/types";
import CategoriaIcon from "@/components/CategoriaIcon";
import { ScrollView } from "react-native-gesture-handler";
import { Picker } from "@react-native-picker/picker";

export default function Dispenser({}) {
  const routeInfo = useRouteInfo();
  const id = routeInfo.params.id;
  const router = useRouter();

  const [dispenser, setDispenser] = useState<DispenserType | undefined>();

  useEffect(() => {
    const dispenser = DispensersData.find((d) => d.id.toString() === id.toString());
    setDispenser(dispenser);
  }, [id]);

  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      style={{
        backgroundColor: myTheme.colors.surfaceContainerLowest,
        height: "100%",
      }}
    >
      <Appbar.Header
        style={{
          backgroundColor: myTheme.colors.surfaceContainerLowest,
          marginBottom: 8,
        }}
      >
        <Appbar.Action
          style={{
            borderWidth: 2,
            borderColor: myTheme.colors.primary,
            marginLeft: 16,
          }}
          icon={() => (
            <Lucide
              name="arrow-left"
              color={myTheme.colors.primary}
              size={24}
            />
          )}
          onPress={() => router.back()}
        />
        <Appbar.Content
          title={routeInfo.params[1] as string}
          titleStyle={{ justifyContent: "center", alignSelf: "center" }}
        />
        <Appbar.Action
          style={{
            borderWidth: 2,
            borderColor: myTheme.colors.primary,
            marginRight: 16,
          }}
          icon={() => (
            <Lucide name="pencil" color={myTheme.colors.primary} size={24} />
          )}
          // onPress={openDrawer}
        />
      </Appbar.Header>
      <View style={styles.container}>
        <View>
          <Image
            source={dispenser?.image}
            style={{
              width: 170,
              height: 170,
              borderRadius: 100,
              marginBottom: 16,
            }}
          />
          <CategoriaIcon
            type={dispenser?.tipo as CategoriaType}
            size={28}
            style={{ position: "absolute", top: 0, right: 0 }}
          />
        </View>
        <TextInput
          value={dispenser?.title || ""}
          mode="outlined"
          left={
            <TextInput.Icon
              icon={() => (
                <Lucide
                  name="paw-print"
                  color={myTheme.colors.primary}
                  size={24}
                />
              )}
            />
          }
          outlineStyle={styles.inputOutline}
          placeholder="Nome"
          onChangeText={(text) =>
            setDispenser((prev) =>
              prev ? { ...prev, title: text } : undefined,
            )
          }
          style={styles.input}
        />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 16,
    backgroundColor: myTheme.colors.surfaceContainerLowest,
    width: "100%",
    alignItems: "center",
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
  input: {
    backgroundColor: myTheme.colors.onPrimaryContainer,
    width: "100%",
  },
  inputOutline: {
    borderRadius: 14,
    borderWidth: 0,
  },
});
