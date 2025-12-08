import {
  View,
  StyleSheet,
  Image,
  ScrollView,
  ToastAndroid,
} from "react-native";
import myTheme from "@/theme/theme";
import { Appbar, TextInput, Text, Button, Menu } from "react-native-paper";
import { useEffect, useState } from "react";
import Lucide from "@react-native-vector-icons/lucide";
import { useRouteInfo, useRouter } from "expo-router/build/hooks";
import { CategoriaType, DispenserType } from "@/types";
import CategoriaIcon from "@/components/CategoriaIcon";
import { MaterialSwitchListItem } from "@/components/Material Switch/MaterialSwitchListItem";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useBluetooth } from "@/context/BluetoothContext";
import { useNavigation } from "expo-router";

type NovosValores = {
  title?: string;
  ativo?: boolean;
  porcao?: number;
  refeicoes?: number;
  descricao?: string;
  tipo?: CategoriaType;
};

export default function Dispenser({}) {
  const routeInfo = useRouteInfo();
  const id = routeInfo.params.id;
  const router = useRouter();
  const navigation = useNavigation();

  const [dispenser, setDispenser] = useState<DispenserType | undefined>();
  const [isActive, setIsActive] = useState(false);
  const [categoria, setCategoria] = useState<CategoriaType | undefined>();
  const [descricao, setDescricao] = useState("");
  const [title, setTitle] = useState("");
  const [porcao, setPorcao] = useState(0);
  const [visibleCategoria, setVisibleCategoria] = useState(false);
  const [height, setHeight] = useState(0);
  const [refeicoes, setRefeicoes] = useState(0);
  const [dispensers, setDispensers] = useState<DispenserType[]>([]);

  const getDispenser = async () => {
    try {
      const dispensersString = await AsyncStorage.getItem("dispensersData");
      if (dispensersString) {
        const dispensers: DispenserType[] = JSON.parse(dispensersString);
        setDispensers(dispensers);
        const dispenser = dispensers.find(
          (d: DispenserType) => d.id.toString() === id.toString(),
        );
        setDispenser(dispenser);
        setIsActive(dispenser?.ativo || false);
        setCategoria(dispenser?.tipo || undefined);
        setDescricao(dispenser?.descricao || "");
        setTitle(dispenser?.title || "");
        setPorcao(dispenser?.porcao || 0);
        setRefeicoes(dispenser?.refeicoes || 0);
      }
    } catch (error) {
      ToastAndroid.show(
        `Erro ao buscar dispenser: ${error}`,
        ToastAndroid.SHORT,
      );
    }
  };

  const { connectToDevice, disconnectFromDevice, sendCommand } = useBluetooth();

  useEffect(() => {
    getDispenser();
  }, []);

  useEffect(() => {
    if (dispenser) {
      connectToDevice(dispenser.id);
    }
  }, [dispenser]);

  useEffect(() => {
    const sub = navigation.addListener("beforeRemove", (e) => {
      disconnectFromDevice();
    });
    return sub;
  }, []);

  const salvar = async () => {
    try {
      const novosValores: NovosValores = {
        title: title,
        ativo: isActive,
        porcao: porcao,
        refeicoes: refeicoes,
        descricao: descricao,
        tipo: categoria,
      };

      const dispenserId = dispenser?.id;

      const novosDispensers = dispensers.map((dispenser) => {
        if (dispenser.id === dispenserId) {
          return {
            ...dispenser,
            ...novosValores,
          };
        }
        return dispenser;
      });

      setDispensers(novosDispensers);
      AsyncStorage.setItem("dispensersData", JSON.stringify(novosDispensers));
      let automatico = 0
      if (isActive) {
        automatico = 1;
      } else {
        automatico = 0;
      }
      sendCommand("PORCOES:" + porcao);
      sendCommand("REFEICOES:" + refeicoes);
      sendCommand("AUTOMATICO:" + automatico);
      ToastAndroid.show(
        `Informações salvas`,
        ToastAndroid.SHORT,
      );
    } catch (error) {
      ToastAndroid.show(
        `Erro ao salvar informações: ${error}`,
        ToastAndroid.SHORT,
      );
    }
  };
  
  function intervaloRefeicoes(refeicoes: number) {
    const ms = (24 * 60 * 60 * 1000) / refeicoes;
    const horas = ms / (1000 * 60 * 60);
    return Math.round(horas * 100) / 100;
  }

  return (
    <View style={{ flex: 1, backgroundColor: "#ffffff" }}>
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
          onPress={() => {
            (router.back(), disconnectFromDevice());
          }}
        />
        <Appbar.Content
          title={title}
          titleStyle={{ justifyContent: "center", alignSelf: "center" }}
        />
        <Appbar.Action
          style={{
            borderWidth: 2,
            borderColor: myTheme.colors.error,
            marginRight: 16,
          }}
          icon={() => (
            <Lucide name="trash" color={myTheme.colors.error} size={24} />
          )}
        />
      </Appbar.Header>

      <View style={{ width: "100%", alignItems: "center" }}>
        <View>
          <Image
            source={
              dispenser?.image
                ? { uri: dispenser.image }
                : require("@/assets/placeholder_dispenser.png")
            }
            style={{
              width: 170,
              height: 170,
              borderRadius: 100,
              marginBottom: 16,
            }}
          />
          <CategoriaIcon
            type={categoria as CategoriaType}
            size={28}
            style={{ position: "absolute", top: 0, right: 0 }}
          />
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.container}>
          <Text style={{ color: myTheme.colors.primary }}>Nome</Text>
          <TextInput
            value={title}
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
            placeholder="Nome do seu pet"
            onChangeText={(text) => setTitle(text)}
            style={styles.input}
          />
          <Text style={{ color: myTheme.colors.primary }}>Descrição</Text>
          <TextInput
            value={descricao}
            mode="outlined"
            multiline
            onContentSizeChange={(event) => {
              setHeight(event.nativeEvent.contentSize.height);
            }}
            style={{
              height,
              ...styles.input,
            }}
            left={
              <TextInput.Icon
                icon={() => (
                  <Lucide
                    name="notepad-text"
                    color={myTheme.colors.primary}
                    size={24}
                  />
                )}
              />
            }
            outlineStyle={styles.inputOutline}
            placeholder="Descrição do seu pet"
            onChangeText={(text) => setDescricao(text)}
          />

          <Text style={{ color: myTheme.colors.primary }}>Categoria</Text>

          <Menu
            visible={visibleCategoria}
            onDismiss={() => {
              setVisibleCategoria(!visibleCategoria);
            }}
            anchor={
              <View style={{ width: "auto" }}>
                <Button
                  onPress={() => {
                    setVisibleCategoria(!visibleCategoria);
                  }}
                  mode="outlined"
                  style={{ borderRadius: 22, borderWidth: 0, flex: 1 }}
                  contentStyle={{
                    backgroundColor: myTheme.colors.onPrimaryContainer,
                    paddingVertical: 6,
                  }}
                  labelStyle={{
                    fontWeight: "300",
                    fontFamily: "InterRegular",
                  }}
                >
                  {categoria
                    ? categoria.charAt(0).toUpperCase() +
                      categoria.slice(1) +
                      " "
                    : "Selecionar"}

                  <Lucide
                    name="chevron-down"
                    size={18}
                    color={myTheme.colors.primary}
                  />
                </Button>
              </View>
            }
            contentStyle={{
              backgroundColor: myTheme.colors.surfaceContainer,
              borderRadius: 22,
              paddingHorizontal: 8,
              marginBottom: -8,
            }}
          >
            <Menu.Item
              style={styles.menuItem}
              titleStyle={{ fontSize: 16 }}
              onPress={() => {
                (setCategoria("cachorro"), setVisibleCategoria(!categoria));
              }}
              title="Cachorro"
            />
            <Menu.Item
              style={styles.menuItem}
              titleStyle={{ fontSize: 16 }}
              onPress={() => {
                (setCategoria("gato"), setVisibleCategoria(!categoria));
              }}
              title="Gato"
            />
            <Menu.Item
              style={styles.menuItem}
              titleStyle={{ fontSize: 16 }}
              onPress={() => {
                (setCategoria("pássaro"), setVisibleCategoria(!categoria));
              }}
              title="Pássaro"
            />
            <Menu.Item
              style={styles.menuItem}
              titleStyle={{ fontSize: 16 }}
              onPress={() => {
                (setCategoria("tartaruga"), setVisibleCategoria(!categoria));
              }}
              title="Tartaruga"
            />
            <Menu.Item
              style={styles.menuItem}
              titleStyle={{ fontSize: 16 }}
              onPress={() => {
                (setCategoria("roedor"), setVisibleCategoria(!categoria));
              }}
              title="Roedor"
            />
            <Menu.Item
              style={styles.menuItem}
              titleStyle={{ fontSize: 16 }}
              onPress={() => {
                (setCategoria("coelho"), setVisibleCategoria(!categoria));
              }}
              title="Coelho"
            />
            <Menu.Item
              style={styles.menuItem}
              titleStyle={{ fontSize: 16 }}
              onPress={() => {
                (setCategoria("outro"), setVisibleCategoria(!categoria));
              }}
              title="Outro"
            />
          </Menu>

          <Text style={{ color: myTheme.colors.primary }}>
            Número de porções
          </Text>
          <TextInput
            value={porcao.toString()}
            mode="outlined"
            right={<TextInput.Affix text="Porções" />}
            left={
              <TextInput.Icon
                icon={() => (
                  <Lucide
                    name="weight"
                    color={myTheme.colors.primary}
                    size={24}
                  />
                )}
              />
            }
            outlineStyle={styles.inputOutline}
            keyboardType="numeric"
            placeholder="Peso da porção..."
            onChangeText={(text) => setPorcao(Number(text))}
            style={styles.input}
          />

          <Text style={styles.info}>
            Uma porção equivale a um segundo de liberação do alimento. Ajuste
            como necessário.
          </Text>
          <MaterialSwitchListItem
            title="Reposição automática"
            selected={isActive}
            fluid
            onPress={() => setIsActive(!isActive)}
            listStyle={{
              backgroundColor: myTheme.colors.onPrimaryContainer,
              borderRadius: 22,
            }}
            titleStyle={{ color: myTheme.colors.primary, marginLeft: 6 }}
            leftIcon={() => (
              <Lucide
                name="calendar-clock"
                size={24}
                color={myTheme.colors.primary}
                style={{ transform: "translateX(16px)" }}
              />
            )}
          />

          {isActive && (
            <>
              <Text style={{ color: myTheme.colors.primary }}>
                Refeições por dia
              </Text>
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  gap: 8,
                }}
              >
                <TextInput
                  value={refeicoes.toString()}
                  mode="outlined"
                  right={<TextInput.Affix text={"Intervalo: " + intervaloRefeicoes(refeicoes).toString() + " h"} />}
                  left={
                    <TextInput.Icon
                      icon={() => (
                        <Lucide
                          name="refresh-cw"
                          color={myTheme.colors.onSurfaceVariant}
                          size={24}
                        />
                      )}
                    />
                  }
                  outlineStyle={styles.inputOutline}
                  keyboardType="numeric"
                  placeholder="Número de porções..."
                  onChangeText={(text) => setRefeicoes(Number(text))}
                  style={[styles.input, { backgroundColor: myTheme.colors.surfaceContainer }]}
                />
              </View>
              <Text style={styles.obs}>
                OBS: os intervalos de execução são calculados por meio da
                divisão exata de um dia completo, a partir do horário em que a
                configuração foi salva.
              </Text>
            </>
          )}
        </View>
      </ScrollView>

      <View style={styles.bottom}>
        <Button
          onPress={() => sendCommand("CMD:ALIMENTAR")}
          style={styles.button}
          mode="contained"
          contentStyle={{ paddingVertical: 4 }}
          icon={() => <Lucide color="#ffffff" size={16} name="salad" />}
        >
          Alimentar
        </Button>
        <Button
          onPress={() => salvar()}
          style={styles.button}
          buttonColor={myTheme.colors.secondary}
          mode="contained"
          contentStyle={{ paddingVertical: 4 }}
          icon={() => <Lucide color="#ffffff" size={16} name="check" />}
        >
          Salvar
        </Button>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  menuItem: {
    backgroundColor: myTheme.colors.surfaceContainerLowest,
    borderRadius: 14,
    width: "100%",
    marginBottom: 8,
  },
  container: {
    flex: 1,
    paddingHorizontal: 16,
    width: "100%",
    gap: 12,
  },
  button: { flex: 1, borderRadius: 100 },
  input: {
    backgroundColor: myTheme.colors.onPrimaryContainer,
    width: "100%",
  },
  obs: {
    color: myTheme.colors.error,
    fontSize: 12,
    backgroundColor: myTheme.colors.errorContainer,
    marginVertical: 8,
    padding: 14,
    borderRadius: 16,
  },
  info: {
    color: myTheme.colors.secondary,
    fontSize: 12,
    backgroundColor: myTheme.colors.onSecondaryContainer,
    marginVertical: 8,
    padding: 14,
    borderRadius: 16,
  },
  inputOutline: {
    borderRadius: 22,
    borderWidth: 0,
  },
  select: {
    backgroundColor: myTheme.colors.surfaceContainer,
    borderRadius: 22,
    paddingVertical: 2,
    paddingHorizontal: 10,
    flex: 1,
  },
  bottom: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: myTheme.colors.surfaceContainerLowest,
    bottom: 0,
    width: "100%",
  },
});
