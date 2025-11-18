import { View, StyleSheet, Image, ScrollView } from "react-native";
import myTheme from "@/theme/theme";
import { Appbar, TextInput, Text, Button, Menu } from "react-native-paper";
import { useEffect, useState, useRef } from "react";
import Lucide from "@react-native-vector-icons/lucide";
import { useRouteInfo, useRouter } from "expo-router/build/hooks";
import { DispensersData } from "@/data";
import { CategoriaType, DispenserType, RepeticaoType } from "@/types";
import CategoriaIcon from "@/components/CategoriaIcon";
import DateTimePicker from "@react-native-community/datetimepicker";
import { MaterialSwitchListItem } from "@/components/Material Switch/MaterialSwitchListItem";

export default function Dispenser({}) {
  const routeInfo = useRouteInfo();
  const id = routeInfo.params.id;
  const router = useRouter();

  const formatarHoraParaString = (date: Date): string => {
    const horas = date.getHours().toString().padStart(2, "0");
    const minutos = date.getMinutes().toString().padStart(2, "0");
    return `${horas}:${minutos}`;
  };

  const stringParaDate = (horaString: string): Date => {
    const [horas, minutos] = horaString.split(":").map(Number);
    const date = new Date();
    date.setHours(horas, minutos, 0, 0);
    return date;
  };

  const [dispenser, setDispenser] = useState<DispenserType | undefined>();
  const [date, setDate] = useState(new Date());
  const [time, setTime] = useState(formatarHoraParaString(new Date()));
  const [openData, setOpenData] = useState(false);
  const [openTime, setOpenTime] = useState(false);
  const [repeticao, setRepeticao] = useState<RepeticaoType>();
  const [isActive, setIsActive] = useState(false);
  const [categoria, setCategoria] = useState<CategoriaType | undefined>();
  const [descricao, setDescricao] = useState("");
  const [title, setTitle] = useState("");
  const [visibleCategoria, setVisibleCategoria] = useState(false);
  const [visibleRepeticao, setVisibleRepeticao] = useState(false);
  const [height, setHeight] = useState(0);

  useEffect(() => {
    const dispenser = DispensersData.find(
      (d) => d.id.toString() === id.toString(),
    );
    setDispenser(dispenser);
    setRepeticao(dispenser?.tipoRepeticao || "único");
    setIsActive(dispenser?.ativo || false);
    setCategoria(dispenser?.tipo);
    setTime(dispenser?.hora || formatarHoraParaString(new Date()));
    setDescricao(dispenser?.descricao || "");
    setTitle(dispenser?.title || "");

    const data = dispenser?.data || "";
    if (data) {
      const [ano, mes, dia] = data.split("-").map(Number);
      setDate(new Date(ano, mes - 1, dia));
    }

    setOpenData(false);
    setOpenTime(false);
  }, []);

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
          onPress={() => router.back()}
        />
        <Appbar.Content
          title={dispenser?.title || ""}
          titleStyle={{ justifyContent: "center", alignSelf: "center" }}
        />
        <Appbar.Action
          style={{
            borderWidth: 2,
            borderColor: myTheme.colors.primary,
            marginRight: 16,
          }}
          icon={() => (
            <Lucide name="camera" color={myTheme.colors.primary} size={24} />
          )}
        />
      </Appbar.Header>

      <View style={{ width: "100%", alignItems: "center" }}>
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
            onChangeText={(text) =>
              setTitle(text)
            }
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
              ...styles.input
            }}
            left={
              <TextInput.Icon
                icon={() => (
                  <Lucide
                    name="pencil"
                    color={myTheme.colors.primary}
                    size={24}
                  />
                )}
              />
            }
            outlineStyle={styles.inputOutline}
            placeholder="Nome do seu pet"
            onChangeText={(text) =>
              setDescricao(text)
            }
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
                  style={{ borderRadius: 16, borderWidth: 0, flex: 1 }}
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
              borderRadius: 16,
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

          <MaterialSwitchListItem
            title="Reposição automática"
            selected={isActive}
            fluid
            onPress={() => setIsActive(!isActive)}
            listStyle={{
              backgroundColor: myTheme.colors.onPrimaryContainer,
              borderRadius: 16,
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
                Próxima execução / Ciclo
              </Text>
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  gap: 8,
                }}
              >
                <View style={styles.dataInput}>
                  <Text
                    onPress={() => setOpenData(true)}
                    style={{ textAlign: "center" }}
                  >
                    {date.toLocaleDateString()}
                  </Text>
                  {openData && (
                    <DateTimePicker
                      value={date}
                      mode="date"
                      accentColor={myTheme.colors.primary}
                      display="default"
                      onChange={(event, selectedDate) => {
                        if (selectedDate) {
                          setDate(selectedDate);
                        }
                        setOpenData(false);
                      }}
                    />
                  )}
                </View>

                <Menu
                  visible={visibleRepeticao}
                  onDismiss={() => {
                    setVisibleRepeticao(!visibleRepeticao);
                  }}
                  anchor={
                    <View style={{ width: "auto" }}>
                      <Button
                        onPress={() => {
                          setVisibleRepeticao(!visibleRepeticao);
                        }}
                        mode="outlined"
                        style={{ borderRadius: 16, borderWidth: 0, flex: 1 }}
                        contentStyle={{
                          backgroundColor: myTheme.colors.surfaceContainer,
                          paddingVertical: 6,
                        }}
                        labelStyle={{
                          color: "#000",
                          fontWeight: "300",
                          fontFamily: "InterRegular",
                        }}
                      >
                        {repeticao
                          ? repeticao.charAt(0).toUpperCase() +
                            repeticao.slice(1) +
                            " "
                          : "Selecionar"}

                        <Lucide name="chevron-down" size={18} color="#000" />
                      </Button>
                    </View>
                  }
                  contentStyle={{
                    backgroundColor: myTheme.colors.surfaceContainer,
                    borderRadius: 16,
                    paddingHorizontal: 8,
                    marginBottom: -8,
                  }}
                >
                  <Menu.Item
                    style={styles.menuItem}
                    titleStyle={{ fontSize: 16 }}
                    onPress={() => {
                      setRepeticao("único");
                      setVisibleRepeticao(!visibleRepeticao);
                    }}
                    title="Único"
                  />
                  <Menu.Item
                    style={styles.menuItem}
                    titleStyle={{ fontSize: 16 }}
                    onPress={() => {
                      setRepeticao("diário");
                      setVisibleRepeticao(!visibleRepeticao);
                    }}
                    title="Diário"
                  />
                  <Menu.Item
                    style={styles.menuItem}
                    titleStyle={{ fontSize: 16 }}
                    onPress={() => {
                      setRepeticao("semanal");
                      setVisibleRepeticao(!visibleRepeticao);
                    }}
                    title="Semanal"
                  />
                  <Menu.Item
                    style={styles.menuItem}
                    titleStyle={{ fontSize: 16 }}
                    onPress={() => {
                      setRepeticao("mensal");
                      setVisibleRepeticao(!visibleRepeticao);
                    }}
                    title="Mensal"
                  />
                </Menu>
              </View>

              <Text style={{ color: myTheme.colors.primary }}>
                Hora da execução
              </Text>

              <View style={styles.horaInput}>
                <Text
                  style={{ textAlign: "center" }}
                  onPress={() => setOpenTime(true)}
                >
                  {time}
                </Text>
                {openTime && (
                  <DateTimePicker
                    value={stringParaDate(time)}
                    mode="time"
                    accentColor={myTheme.colors.primary}
                    display="default"
                    onChange={(event, selectedDate) => {
                      if (selectedDate) {
                        setTime(formatarHoraParaString(selectedDate));
                      }
                      setOpenTime(false);
                    }}
                  />
                )}
              </View>
            </>
          )}
        </View>
      </ScrollView>

      <View style={styles.bottom}>
        <Button
          onPress={() => router.push("/home")}
          style={styles.button}
          mode="contained"
          contentStyle={{ paddingVertical: 4 }}
          icon={() => <Lucide color="#ffffff" size={16} name="salad" />}
        >
          Alimentar
        </Button>
        <Button
          onPress={() => router.push("/home")}
          style={styles.button}
          buttonColor={myTheme.colors.error}
          mode="contained"
          contentStyle={{ paddingVertical: 4 }}
          icon={() => <Lucide color="#ffffff" size={16} name="trash" />}
        >
          Deletar
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
  button: { flex: 1, borderRadius: 16 },
  input: {
    backgroundColor: myTheme.colors.onPrimaryContainer,
    width: "100%",
  },
  inputOutline: {
    borderRadius: 16,
    borderWidth: 0,
  },
  dataInput: {
    backgroundColor: myTheme.colors.surfaceContainer,
    borderRadius: 16,
    padding: 16,
    maxWidth: 120,
  },
  horaInput: {
    backgroundColor: myTheme.colors.surfaceContainer,
    borderRadius: 16,
    padding: 16,
    maxWidth: 80,
  },
  select: {
    backgroundColor: myTheme.colors.surfaceContainer,
    borderRadius: 16,
    paddingVertical: 2,
    paddingHorizontal: 10,
    flex: 1,
  },
  bottom: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    padding: 16,
    backgroundColor: myTheme.colors.surfaceContainerLowest,
    bottom: 0,
    width: "100%",
  },
});
