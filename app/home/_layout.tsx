import { Tabs, useSegments } from "expo-router";
import CustomTab from "@components/customTab/CustomTab";
import { View, StyleSheet } from "react-native";
import myTheme from "@/theme/theme";
import { useEffect, useState } from "react";
import { DrawerActions } from "@react-navigation/native";
import { Appbar } from "react-native-paper";
import { useRouteInfo } from "expo-router/build/hooks";
import { useNavigation } from "@react-navigation/native";
import Lucide from "@react-native-vector-icons/lucide";

export default function HomeLayout() {
  const segments = useSegments();
  const nome = "User";
  const [title, setTitle] = useState(nome);
  const routeInfo = useRouteInfo();
  const pathname = routeInfo.pathname.split("/")[2];

  useEffect(() => {
    const title =
      pathname === undefined || !isNaN(Number(pathname))
        ? `Olá, ${nome}!👋`
        : pathname.charAt(0).toUpperCase() + pathname.slice(1);
      setTitle(title);
  });

  const navigation = useNavigation();

  const openDrawer = () => {
    navigation.dispatch(DrawerActions.toggleDrawer());
  };

  return (
    <View style={{ flex: 1 }}>
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
            <Lucide name="plus" color={myTheme.colors.primary} size={24} />
          )} onPress={openDrawer} />
        <Appbar.Content title={title} titleStyle={{ justifyContent: 'center', alignSelf: 'center' }} />
        <Appbar.Action
          style={{
            borderWidth: 2,
            borderColor: myTheme.colors.primary,
            marginRight: 16,
          }}
          icon={() => (
            <Lucide name="user" color={myTheme.colors.primary} size={24} />
          )} onPress={openDrawer} />
      </Appbar.Header>
      <View style={[styles.container]}>
        <View style={styles.tabs}>
          <Tabs
            screenOptions={{ headerShown: false, animation: "shift" }}
            tabBar={(props) => <CustomTab {...props} />}
          >
            <Tabs.Screen name="index" options={{ tabBarLabel: "Home" }} />
            <Tabs.Screen name="dispensers" options={{ tabBarLabel: "Dispensers" }} />
            <Tabs.Screen name="timeline" options={{ tabBarLabel: "Timeline" }} />
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
