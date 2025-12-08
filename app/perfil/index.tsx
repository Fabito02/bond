import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, Button, FlatList, TouchableOpacity, TextInput, Alert, PermissionsAndroid, Platform } from 'react-native';
import RNBluetoothClassic, { BluetoothDevice } from 'react-native-bluetooth-classic';

export default function BluetoothScreen() {
  const [devices, setDevices] = useState<BluetoothDevice[]>([]);
  const [connectedDevice, setConnectedDevice] = useState<BluetoothDevice | null>(null);
  const [message, setMessage] = useState("");
  const [logs, setLogs] = useState<string[]>([]);

  // Função auxiliar para logs na tela
  const addLog = (msg: string) => setLogs(prev => [msg, ...prev]);

  // 1. Pedir permissões (Essencial para Android 12+)
  const requestPermissions = async () => {
    if (Platform.OS === 'android') {
      const granted = await PermissionsAndroid.requestMultiple([
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN,
        PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT,
      ]);
      return granted;
    }
    return true;
  };

  // 2. Escanear dispositivos não pareados
  const scanDevices = async () => {
    await requestPermissions();
    try {
      addLog("Escaneando...");
      // O HC-05 geralmente aparece mais rápido se você listar os PAREADOS primeiro
      // Mas aqui vamos tentar discovery
      const unpaired = await RNBluetoothClassic.startDiscovery();
      setDevices(unpaired);
      addLog(`Encontrados: ${unpaired.length}`);
    } catch (err: any) {
      addLog(`Erro no scan: ${err.message}`);
    }
  };

  // 3. Conectar ao HC-05
  const connectToDevice = async (device: BluetoothDevice) => {
    try {
      addLog(`Tentando conectar em ${device.name}...`);
      const connection = await device.connect();
      
      if (connection) {
        setConnectedDevice(device);
        addLog(`Conectado a ${device.name}!`);
        
        // Listener para receber dados do Arduino (opcional)
        device.onDataReceived((data) => {
           addLog(`Recebido: ${data.data}`);
        });
      }
    } catch (err: any) {
      addLog(`Erro ao conectar: ${err.message}`);
    }
  };

  // 4. Enviar comando serial
  const sendCommand = async () => {
    if (!connectedDevice) {
      Alert.alert("Erro", "Nenhum dispositivo conectado");
      return;
    }
    
    try {
      // O HC-05 lê strings. Adicionei \n caso use readStringUntil no Arduino
      await connectedDevice.write(message + "\n");
      addLog(`Enviado: ${message}`);
      setMessage(""); // Limpa input
    } catch (err: any) {
      addLog(`Erro envio: ${err.message}`);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Controle Dispenser (HC-05)</Text>

      {!connectedDevice ? (
        <>
          <Button title="Procurar Dispositivos" onPress={scanDevices} />
          <FlatList
            data={devices}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <TouchableOpacity 
                style={styles.deviceItem} 
                onPress={() => connectToDevice(item)}
              >
                <Text style={styles.deviceName}>{item.name || "Sem Nome"}</Text>
                <Text style={styles.deviceId}>{item.id}</Text>
              </TouchableOpacity>
            )}
          />
        </>
      ) : (
        <View style={styles.controlPanel}>
          <Text style={styles.connectedText}>Conectado a: {connectedDevice.name}</Text>
          
          <TextInput
            style={styles.input}
            placeholder="Comando (ex: LIBERAR)"
            value={message}
            onChangeText={setMessage}
          />
          <Button title="Enviar Comando" onPress={sendCommand} color="#2ecc71" />
          
          <Button 
            title="Desconectar" 
            color="#e74c3c" 
            onPress={async () => {
              await connectedDevice.disconnect();
              setConnectedDevice(null);
            }} 
          />
        </View>
      )}

      <View style={styles.logBox}>
        <Text style={{fontWeight: 'bold'}}>Logs:</Text>
        {logs.map((log, i) => <Text key={i} style={{fontSize: 10}}>{log}</Text>)}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, paddingTop: 50, backgroundColor: '#f5f5f5' },
  title: { fontSize: 22, fontWeight: 'bold', marginBottom: 20, textAlign: 'center' },
  deviceItem: { padding: 15, backgroundColor: 'white', marginBottom: 10, borderRadius: 8 },
  deviceName: { fontWeight: 'bold', fontSize: 16 },
  deviceId: { color: 'gray', fontSize: 12 },
  controlPanel: { gap: 15 },
  connectedText: { fontSize: 18, color: 'green', marginBottom: 10, textAlign: 'center' },
  input: { backgroundColor: 'white', padding: 10, borderRadius: 5, borderWidth: 1, borderColor: '#ddd' },
  logBox: { marginTop: 20, height: 150, backgroundColor: '#ddd', padding: 5 }
});