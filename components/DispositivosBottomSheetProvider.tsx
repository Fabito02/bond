import React, { createContext, useContext, useRef, useCallback } from "react";
import {
  BottomSheetModal,
  BottomSheetView,
  BottomSheetBackdrop,
} from "@gorhom/bottom-sheet";
import Lucide from "@react-native-vector-icons/lucide";
import myTheme from "@/theme/theme";
import { useState, useEffect } from "react";
import { Text, Button, TouchableRipple } from "react-native-paper";
import {
  StyleSheet,
  View,
  FlatList,
  PermissionsAndroid,
  Platform,
} from "react-native";
import RNBluetoothClassic, {
  BluetoothDevice,
} from "react-native-bluetooth-classic";
import { useBluetooth } from "@/context/BluetoothContext";
import { router } from "expo-router";

const SheetContext = createContext({
  openSheet: () => {},
  closeSheet: () => {},
});

export function useDispositivosSheet() {
  return useContext(SheetContext);
}

export function DispositivosBottomSheetProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const sheetRef = useRef<BottomSheetModal>(null);

  const openSheet = useCallback(() => {
    sheetRef.current?.present();
  }, []);

  const closeSheet = useCallback(() => {
    sheetRef.current?.dismiss();
  }, []);
  const [devices, setDevices] = useState<BluetoothDevice[]>([]);
  const { addDevice } = useBluetooth();

  const requestPermissions = async () => {
    if (Platform.OS === "android") {
      const granted = await PermissionsAndroid.requestMultiple([
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN,
        PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT,
      ]);
      return granted;
    }
    return true;
  };

  const scanDevices = async () => {
    await requestPermissions();
    try {
      const unpaired = (await RNBluetoothClassic.startDiscovery()).filter(
        (device) => device.name === "Bond" || device.name === "HC-05",
      );
      setDevices(unpaired);
    } catch (err: any) {
      console.log(err.message);
    }
  };

  useEffect(() => {
    scanDevices();
  }, []);

  return (
    <SheetContext.Provider value={{ openSheet, closeSheet }}>
      {children}
      <BottomSheetModal
        ref={sheetRef}
        snapPoints={["40%", "100%"]}
        handleIndicatorStyle={{ width: 75 }}
        backdropComponent={(props) => <BottomSheetBackdrop {...props} />}
        backgroundStyle={{ borderRadius: 30, elevation: 10 }}
      >
        <BottomSheetView style={{ flex: 1, padding: 16 }}>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Lucide
              name="radio-tower"
              size={24}
              color={myTheme.colors.primary}
              style={{ marginRight: 8 }}
            />
            <Text
              variant="titleMedium"
              style={{ color: myTheme.colors.primary }}
            >
              Dispositivos Próximos
            </Text>
          </View>
          <View style={{ marginTop: 16, flex: 1, flexDirection: 'row', gap: 8 }}>
            <Button
              style={{
                backgroundColor: myTheme.colors.primary,
                borderRadius: 16,
                flex: 1,
              }}
              icon={() => (
                <Lucide
                  name="refresh-ccw"
                  size={20}
                  color={'#FFFFFF'}
                />
              )}
              labelStyle={{ color: "#FFFFFF" }}
              onPress={() => {
                scanDevices();
              }}
            >
              Atualizar
            </Button>
            <Button
              style={{
                backgroundColor: myTheme.colors.secondary,
                borderRadius: 16,
                flex: 1,
              }}
              icon={() => (
                <Lucide
                  name="archive"
                  size={20}
                  color={'#FFFFFF'}
                />
              )}
              labelStyle={{ color: "#FFFFFF" }}
              onPress={() => {
                router.push("/home/dispensers"), closeSheet()
              }}
            >
              Dispensers
            </Button>
          </View>

          <FlatList
            data={devices}
            keyExtractor={(item) => item.id}
            ListHeaderComponent={<View style={{ marginTop: 16 }}></View>}
            renderItem={({ item }) => (
              <TouchableRipple
                borderless
                style={styles.deviceItem}
                onPress={() => {
                  (addDevice(item), closeSheet());
                }}
              >
                <View>
                  <Text style={styles.deviceName}>
                    {item.name || "Sem Nome"}
                  </Text>
                  <Text style={styles.deviceId}>{item.id}</Text>
                </View>
              </TouchableRipple>
            )}
          />
        </BottomSheetView>
      </BottomSheetModal>
    </SheetContext.Provider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    paddingTop: 50,
    backgroundColor: "#f5f5f5",
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  deviceItem: {
    padding: 15,
    backgroundColor: myTheme.colors.surfaceContainer,
    marginBottom: 10,
    borderRadius: 16,
  },
  deviceName: { fontWeight: "bold", fontSize: 16 },
  deviceId: { color: "gray", fontSize: 12 },
  controlPanel: { gap: 15 },
  connectedText: {
    fontSize: 18,
    color: "green",
    marginBottom: 10,
    textAlign: "center",
  },
  input: {
    backgroundColor: "white",
    padding: 10,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: "#ddd",
  },
  logBox: { marginTop: 20, height: 150, backgroundColor: "#ddd", padding: 5 },
});
