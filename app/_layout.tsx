import { Stack } from "expo-router";
import { PaperProvider } from "react-native-paper";
import { useFonts } from "expo-font";
import { Inter_400Regular, Inter_500Medium } from "@expo-google-fonts/inter";
import {
  Poppins_600SemiBold,
  Poppins_500Medium,
  Poppins_700Bold,
} from "@expo-google-fonts/poppins";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";
import { myTheme } from "../theme/theme";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    InterRegular: Inter_400Regular,
    InterMedium: Inter_500Medium,
    PoppinsSemiBold: Poppins_600SemiBold,
    PoppinsMedium: Poppins_500Medium,
    PoppinsBold: Poppins_700Bold,
  });

  useEffect(() => {
    if (fontsLoaded) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) return null;

  return (
    <PaperProvider theme={myTheme}>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <BottomSheetModalProvider>
          <Stack
            screenOptions={{
              headerShown: false,
              animation: "slide_from_right",
            }}
          />
        </BottomSheetModalProvider>
      </GestureHandlerRootView>
    </PaperProvider>
  );
}
