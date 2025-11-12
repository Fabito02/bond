import React, { useCallback, useMemo, useRef, useEffect } from "react";
import { useRouter } from "expo-router";
import { View, StyleSheet, Image } from "react-native";
import { Button, Text, TextInput } from "react-native-paper";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import {
  BottomSheetModal,
  BottomSheetView,
  BottomSheetModalProvider,
} from "@gorhom/bottom-sheet";
import myTheme from "@/theme/theme";
import { TouchableRipple } from "react-native-paper";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const Login = () => {
  const ModalInicialRef = useRef<BottomSheetModal | null>(null);
  const ModalLoginRef = useRef<BottomSheetModal | null>(null);
  const [visivel, setVisivel] = React.useState(false);

  const insets = useSafeAreaInsets();

  const router = useRouter();

  const snapPoints = useMemo(() => ["100%"], []);

  const handleLogin = useCallback(() => {
    ModalInicialRef.current?.close();
    ModalLoginRef.current?.present();
  }, []);

  const handleCloseLogin = useCallback(() => {
    ModalInicialRef.current?.present();
    ModalLoginRef.current?.close();
  }, []);

  useEffect(() => {
    setTimeout(() => {
      if (ModalInicialRef.current) {
        ModalInicialRef.current.present();
      }
    }, 1000);
  }, []);

  const handleVisibilidadeSenha = () => {
    if (visivel === true) {
      setVisivel(false);
    } else {
      setVisivel(true);
    }
  };

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <BottomSheetModalProvider>
        <BottomSheetModal
          ref={ModalInicialRef}
          index={0}
          snapPoints={snapPoints}
          enablePanDownToClose={false}
          enableContentPanningGesture={false}
          backgroundStyle={{
            borderTopLeftRadius: 48,
            borderTopRightRadius: 48,
            backgroundColor: myTheme.colors.surfaceContainerLowest,
          }}
          handleComponent={null}
        >
          <BottomSheetView
            style={[
              styles.contentContainer,
              {
                paddingBottom: insets.bottom,
              },
            ]}
          >
            <View style={styles.content}>
              <View>
                <Text variant="titleSmall" style={styles.title}>
                  Alimentação automatizada para o seu pet!
                </Text>
                <Text style={styles.text}>
                  Organize a dieta do seu animal de estimação. 
                </Text>
              </View>
              <Button
                onPress={handleLogin}
                style={styles.button}
                mode="contained"
              >
                Começar
              </Button>
            </View>
          </BottomSheetView>
        </BottomSheetModal>

        <BottomSheetModal
          ref={ModalLoginRef}
          index={0}
          snapPoints={snapPoints}
          onDismiss={handleCloseLogin}
          enableContentPanningGesture={true}
          backgroundStyle={{
            borderRadius: 0,
            backgroundColor: myTheme.colors.surfaceContainerLowest,
          }}
        >
          <BottomSheetView
            style={[
              styles.contentContainer,
              {
                paddingBottom: insets.bottom,
              },
            ]}
          >
            <View style={styles.content}>
              <View style={{ flex: 1, gap: 26 }}>
                {/*<Image
                  source={require("@assets/icon.png")}
                  style={styles.logo}
                />*/}
                <Text variant="titleSmall" style={styles.title}>
                  Bem-vindo(a)!
                </Text>
                <Text style={styles.text}>
                  Insira suas credenciais para entrar no sistema
                </Text>
                <View>
                  <TextInput
                    label="Email"
                    defaultValue="teste@email.com"
                    style={styles.input}
                  />
                  <TextInput
                    label="Senha"
                    defaultValue="12345678"
                    secureTextEntry={!visivel}
                    right={
                      <TextInput.Icon
                        icon={visivel ? "eye-off" : "eye"}
                        color={
                          visivel
                            ? myTheme.colors.primary
                            : myTheme.colors.outline
                        }
                        onPress={handleVisibilidadeSenha}
                        rippleColor={myTheme.colors.primary}
                      />
                    }
                    style={styles.input}
                  />
                </View>
                <Button
                  onPress={() => router.push("/home")}
                  style={styles.button}
                  mode="contained"
                >
                  Entrar
                </Button>
                <View
                  style={{
                    alignItems: "center",
                  }}
                >
                  <TouchableRipple
                    onPress={() => {}}
                    rippleColor={myTheme.colors.primary}
                  >
                    <View>
                      <Image
                        source={require("@assets/google.png")}
                        style={{ width: 36, height: 36 }}
                      />
                    </View>
                  </TouchableRipple>
                  <Button
                    style={{ marginTop: 16, borderRadius: 12 }}
                    textColor={myTheme.colors.onSurface}
                    onPress={() => {}}
                  >
                    Não tenho cadastro
                  </Button>
                </View>
                <View style={{ marginTop: "auto" }} />
              </View>
            </View>
          </BottomSheetView>
        </BottomSheetModal>
      </BottomSheetModalProvider>
    </GestureHandlerRootView>
  );
};

const styles = StyleSheet.create({
  image: { width: "100%", height: "100%" },
  contentContainer: {
    flex: 1,
    padding: 24,
    alignItems: "center",
    justifyContent: "center",
  },
  content: {
    gap: 26,
    flex: 1,
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  title: { fontSize: 32, fontFamily: "PoppinsSemiBold", textAlign: "center" },
  text: { textAlign: "center" },
  button: { borderRadius: 16, paddingVertical: 2 },
  input: {
    backgroundColor: "#eeeeeeff",
  },
  logo: { width: 180, height: 180, alignSelf: "center", marginBottom: -20 },
});

export default Login;
