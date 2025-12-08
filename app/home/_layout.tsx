import { Tabs } from "expo-router";
import CustomTab from "@components/customTab/CustomTab";
import { View, StyleSheet } from "react-native";
import myTheme from "@/theme/theme";
import { useEffect, useState } from "react";
import { Appbar } from "react-native-paper";
import { useRouteInfo, useRouter } from "expo-router/build/hooks";
import Lucide from "@react-native-vector-icons/lucide";
import React from "react";
import { UserData } from "@/data";
import { useDispositivosSheet } from "@/components/DispositivosBottomSheetProvider";

export default function HomeLayout() {
  const nome = UserData.nome;
  const [title, setTitle] = useState(nome);
  const routeInfo = useRouteInfo();
  const pathname = routeInfo.pathname.split("/")[2];
  const { openSheet } = useDispositivosSheet();
  const router = useRouter()

  useEffect(() => {
    const title =
      pathname === undefined || !isNaN(Number(pathname))
        ? `Olá, ${nome}!👋`
        : pathname.charAt(0).toUpperCase() + pathname.slice(1);
    setTitle(title);
  });

  return (
    <View style={{ flex: 1 }}>
      <Appbar.Header
        style={{
          backgroundColor: myTheme.colors.surfaceContainerLowest,
          marginBottom: 8,
        }}
      >
        <Appbar.Action
          rippleColor={myTheme.colors.primary}
          style={{
            borderWidth: 2,
            borderColor: myTheme.colors.primary,
            marginLeft: 16,
          }}
          icon={() => (
            <Lucide name="plus" color={myTheme.colors.primary} size={24} />
          )}
          onPress={openSheet}
        />
        <Appbar.Content
          title={title}
          titleStyle={{ justifyContent: "center", alignSelf: "center" }}
        />
        <Appbar.Action
        rippleColor={myTheme.colors.primary}
          style={{
            borderWidth: 2,
            borderColor: myTheme.colors.primary,
            marginRight: 16,
          }}
          icon={() => (
            <Lucide name="user" color={myTheme.colors.primary} size={24} />
          )}
          onPress={() => {router.push("/perfil")}}
        />
      </Appbar.Header>
      <View style={[styles.container]}>
        <View style={styles.tabs}>
          <Tabs
            screenOptions={{ headerShown: false, animation: "shift" }}
            tabBar={(props) => <CustomTab {...props} />}
          >
            <Tabs.Screen name="index" options={{ tabBarLabel: "Home" }} />
            <Tabs.Screen
              name="dispensers"
              options={{ tabBarLabel: "Dispensers" }}
            />
          </Tabs>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  tabs: { flex: 1 },
});
