import { View, StyleSheet, Image } from "react-native";
import myTheme from "@/theme/theme";
import { Appbar, TextInput, Text, Button } from "react-native-paper";
import { useEffect, useState } from "react";
import Lucide from "@react-native-vector-icons/lucide";
import { useRouteInfo, useRouter } from "expo-router/build/hooks";
import { DispensersData } from "@/data";
import { CategoriaType, DispenserType } from "@/types";
import CategoriaIcon from "@/components/CategoriaIcon";
import { ScrollView } from "react-native-gesture-handler";
import { Picker } from "@react-native-picker/picker";
import DateTimePicker from "@react-native-community/datetimepicker";
import { MaterialSwitchListItem } from "@/components/Material Switch/MaterialSwitchListItem";

export default function Dispenser({}) {
  const routeInfo = useRouteInfo();
  const id = routeInfo.params.id;
  const router = useRouter();

  const [dispenser, setDispenser] = useState<DispenserType | undefined>();
  const [date, setDate] = useState(new Date());
  const [open, setOpen] = useState(false);
  const [repeticao, setRepeticao] = useState("");
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    const dispenser = DispensersData.find(
      (d) => d.id.toString() === id.toString(),
    );
    setDispenser(dispenser);
    setRepeticao(dispenser?.tipoRepeticao || "");
    setIsActive(dispenser?.ativo || false);

    const data = dispenser?.data || "";
    if (data) {
      const [ano, mes, dia] = data.split("-").map(Number);
      setDate(new Date(ano, mes - 1, dia));
    }
  }, [id]);

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
          // onPress={openDrawer}
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
            type={dispenser?.tipo as CategoriaType}
            size={28}
            style={{ position: "absolute", top: 0, right: 0 }}
          />
        </View>
      </View>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.container}>
          <Text style={{ color: myTheme.colors.primary }}>Nome</Text>
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
            placeholder="Nome do seu pet"
            onChangeText={(text) =>
              setDispenser((prev) =>
                prev ? { ...prev, title: text } : undefined,
              )
            }
            style={styles.input}
          />

          <MaterialSwitchListItem
            title="Reposição automática"
            selected={isActive}
            onPress={() => setIsActive(!isActive)}
            listStyle={{
              backgroundColor: myTheme.colors.onPrimaryContainer,
              borderRadius: 16,
            }}
            titleStyle={{ color: myTheme.colors.primary, marginLeft: 6 }}
            leftIcon={() => <Lucide name="calendar-clock" size={24} color={myTheme.colors.primary} style={{ transform: 'translateX(16px)' }} />}
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
                  paddingBottom: 20,
                }}
              >
                <View style={styles.dataInput}>
                  <Text
                    onPress={() => setOpen(true)}
                    style={{ textAlign: "center" }}
                  >
                    {date.toLocaleDateString("pt-BR")}
                  </Text>
                  {open && (
                    <DateTimePicker
                      value={date}
                      mode="date"
                      accentColor={myTheme.colors.primary}
                      display="default"
                      onChange={(event, selectedDate) => {
                        if (selectedDate) {
                          setDate(selectedDate);
                        }
                        setOpen(false);
                      }}
                    />
                  )}
                </View>
                <View style={styles.select}>
                  <Picker
                    selectedValue={repeticao}
                    onValueChange={(itemValue, itemIndex) =>
                      setRepeticao(itemValue)
                    }
                    style={styles.picker}
                  >
                    <Picker.Item label="Único" value="único" />
                    <Picker.Item label="Diário" value="diário" />
                    <Picker.Item label="Semanal" value="semanal" />
                    <Picker.Item label="Mensal" value="mensal" />
                  </Picker>
                </View>
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
          icon={() => <Lucide color="#ffffff" size={16} name="salad" />}
        >
          Alimentar
        </Button>
        <Button
          onPress={() => router.push("/home")}
          style={styles.button}
          buttonColor={myTheme.colors.error}
          mode="contained"
          icon={() => <Lucide color="#ffffff" size={16} name="trash" />}
        >
          Deletar
        </Button>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  picker: {
    backgroundColor: myTheme.colors.surfaceContainer,
    borderRadius: 16,
    width: "100%",
  },
  container: {
    flex: 1,
    paddingHorizontal: 16,
    width: "100%",
    gap: 12,
  },
  button: { flex: 1, borderRadius: 16, paddingVertical: 4 },
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
    width: 120,
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
