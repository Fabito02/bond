import { useEffect, useState } from "react";
import { useRouter } from "expo-router";
import { View, ActivityIndicator } from "react-native";
import myTheme from "@/theme/theme";

export default function Index() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setIsAuthenticated(false);
  }, []);

  useEffect(() => {
    setTimeout(() => {
      if (!isAuthenticated) {
        router.navigate("/login");
      } else {
        router.navigate("/home");
      }
    }, 2000);
  }, [isAuthenticated]);

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <ActivityIndicator size="large" color={myTheme.colors.primary} />
    </View>
  );
}
