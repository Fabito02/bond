import React, { createContext, useState, useContext, ReactNode } from 'react';
import RNBluetoothClassic, { BluetoothDevice } from 'react-native-bluetooth-classic';
import {  ToastAndroid } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { DispenserType } from '@/types';
import { useRouter } from 'expo-router';

interface BluetoothContextData {
  connectedDevice: BluetoothDevice | null;
  connectToDevice: (device: string) => Promise<void>;
  disconnectFromDevice: () => Promise<void>;
  sendCommand: (msg: string) => Promise<void>;
  isConnected: boolean;
  addDevice: (device: BluetoothDevice) => Promise<void>;
}

const BluetoothContext = createContext<BluetoothContextData>({} as BluetoothContextData);

export const BluetoothProvider = ({ children }: { children: ReactNode }) => {
  const [connectedDevice, setConnectedDevice] = useState<BluetoothDevice | null>(null);
  const [dispensers, setDispensers] = useState<any[]>([]);
  const router = useRouter();
  
  const connectToDevice = async (id: string) => {
    try {
      const device = await RNBluetoothClassic.connectToDevice(id);
      
      if (device) {
        setConnectedDevice(device);
        ToastAndroid.show("Conectado com sucesso", ToastAndroid.SHORT);
      }
    } catch (err: any) {
      ToastAndroid.show(err.message, ToastAndroid.SHORT);
    }
  };
  
  const addDevice = async (device: BluetoothDevice) => {
    try {
      const connection = await device.connect();
      
      if (connection) {
        setConnectedDevice(device);
        
        const dadosAntigos = await AsyncStorage.getItem('dispensersData');
        
        if (dadosAntigos) {
          const dispensers = JSON.parse(dadosAntigos);
          if (dispensers.find((dispenser: DispenserType) => dispenser.id === device.id)) {
            ToastAndroid.show("Dispositivo já configurado", ToastAndroid.SHORT);
            router.push(`/dispenser/${device.id}`);
            return
          }
        } else {
          setDispensers([]);
        }
        const novoDispenser: DispenserType = 
          {
            id: device.id,
            title: "Novo Dispenser",
            image: null,
            tipo: null,
            porcao: null,
            ativo: false,
            refeicoes: null,
            descricao: null,
        
          };
        setDispensers([...dispensers, novoDispenser]);
        await AsyncStorage.setItem('dispensersData', JSON.stringify(dispensers));
        ToastAndroid.show("Dispositivo conectado com sucesso", ToastAndroid.SHORT);
        router.push(`/dispenser/${device.id}`);
      }
    } catch (err: any) {
      ToastAndroid.show(err.message, ToastAndroid.SHORT);
    }
  };

  const disconnectFromDevice = async () => {
    if (connectedDevice) {
      await connectedDevice.disconnect();
      setConnectedDevice(null);
      console.log("Dispositivo desconectado com sucesso");
    }
  };

  const sendCommand = async (msg: string) => {
    if (!connectedDevice) {
      ToastAndroid.show("Dispositivo não conectado!", ToastAndroid.SHORT);
      return;
    }
    await connectedDevice.write(msg + "\n");
  };

  return (
    <BluetoothContext.Provider value={{ 
      connectedDevice, 
      connectToDevice, 
      disconnectFromDevice, 
      sendCommand,
      isConnected: !!connectedDevice, 
      addDevice,
    }}>
      {children}
    </BluetoothContext.Provider>
  );
};

export const useBluetooth = () => {
  const context = useContext(BluetoothContext);
  if (!context) throw new Error("useBluetooth deve ser usado dentro de um BluetoothProvider");
  return context;
};