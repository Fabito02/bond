import { View, Text, Animated } from "react-native";
import { useState, useRef, useEffect } from "react";
import { TouchableRipple } from "react-native-paper";
import myTheme from "@/theme/theme";
import Lucide from "@react-native-vector-icons/lucide";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function MyCustomTabBar({ state, descriptors, navigation }) {
  const insets = useSafeAreaInsets();
  const [expandedIndex, setExpandedIndex] = useState(null);
  const widthAnimsRef = useRef([]);
  if (widthAnimsRef.current.length !== state.routes.length) {
    widthAnimsRef.current = state.routes.map(() => new Animated.Value(60));
  }
  const widthAnims = widthAnimsRef.current;

  useEffect(() => {
    widthAnims.forEach((anim, i) => {
      Animated.timing(anim, {
        toValue: i === state.index ? 140 : 55,
        duration: 200,
        useNativeDriver: false,
      }).start();
    });
  }, [state.index]);

  const handleTamanho = (index, route) => {
    if (state.index !== index) navigation.navigate(route.name);

    widthAnims.forEach((anim, i) => {
      Animated.timing(anim, {
        toValue: i === index ? 140 : 60,
        duration: 200,
        useNativeDriver: false,
      }).start();
    });

    setExpandedIndex(index);
  };

  return (
    <View
      style={{
        width: "100%",
        bottom: 0,
        paddingBottom: insets.bottom,
        overflow: "hidden",
        backgroundColor: "#ffffff",
      }}
    >
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-around",
          borderRadius: 24,
          paddingHorizontal: 16,
          zIndex: 1,
          overflow: "hidden",
        }}
      >
        {state.routes.map((route, index) => {
          const isFocused = state.index === index;
          const label =
            descriptors[route.key].options.tabBarLabel ?? route.name;

          return (
            <TouchableRipple
              key={route.key}
              onPress={() => handleTamanho(index, route)}
              borderless
              style={{
                borderRadius: 16,
                marginVertical: 16,
                backgroundColor: isFocused
                  ? myTheme.colors.primaryContainer
                  : "#00000000",
              }}
              rippleColor={myTheme.colors.primary}
            >
              <Animated.View
                style={[
                  {
                    height: 45,
                    justifyContent: "center",
                    alignItems: "center",
                    flexDirection: "row",
                    marginHorizontal: 6,
                    paddingHorizontal: 12,
                  },
                  { width: widthAnims[index] },
                ]}
              >
                <Lucide
                  name={
                    route.name === "index"
                      ? "house"
                      : route.name === "timeline"
                      ? "refresh-ccw"
                      : "archive"
                  }
                  size={24}
                  color={
                    isFocused
                      ? myTheme.colors.primary
                      : myTheme.colors.onSurfaceVariant
                  }
                />
                {(expandedIndex === index || isFocused) && (
                  <Text
                    style={{
                      color: myTheme.colors.primary,
                      marginLeft: 8,
                      flexShrink: 1,
                      overflow: "hidden",
                      fontSize: 16,
                    }}
                    numberOfLines={1}
                  >
                    {label}
                  </Text>
                )}
              </Animated.View>
            </TouchableRipple>
          );
        })}
      </View>
    </View>
  );
}
