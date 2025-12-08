#include <Servo.h>
#include <SoftwareSerial.h>
#include <EEPROM.h>

// Pinos do módulo Bluetooth
#define RX 6
#define TX 7

// Pino do servo
#define SERVO_PIN 9

Servo servoMotor;
SoftwareSerial BT(RX, TX);

struct Configuracao {
  int numPorcoes;
  int automatico;
  int primeiroInicio;
  unsigned long intervaloRefeicoes;
  unsigned long ultimoAutomatico;
};

Configuracao config;

unsigned long inicioLiberacao = 0;
bool liberando = false;

unsigned long inicioLiberacaoAutomatica = 0;
bool liberandoAutomatico = false;

void setup() {

  Serial.begin(9600);
  BT.begin(38400);
  EEPROM.get(0, config);

  if (config.primeiroInicio != 1) {
    Serial.println("Primeira inicalização! Resetando config...");
    config.numPorcoes = 0;
    config.automatico = 0;
    config.primeiroInicio = 1;
    config.intervaloRefeicoes = 0;
    config.ultimoAutomatico = 0;

    EEPROM.put(0, config);
  }

  servoMotor.attach(SERVO_PIN);
  servoMotor.write(0);
}

void loop() {

  atualizarLiberacao();
  atualizarLiberacaoAutomatica();
  verificarAgendamentoAutomatico();

  if (BT.available()) {
    String comando = BT.readStringUntil('\n');
    comando.trim();

    int indiceSeparador = comando.indexOf(':');

    if (indiceSeparador > 0) {
      String tipo = comando.substring(0, indiceSeparador);
      String conteudo = comando.substring(indiceSeparador + 1);

      if (tipo == "CMD") {
        if (conteudo == "ALIMENTAR") {
          Serial.println("Ação: Alimentando...");
          liberarPorcao();
        }
        else if (conteudo == "ABRIR") {
          Serial.println("Ação: Abrindo...");
          servoMotor.write(50);
        }
        else if (conteudo == "FECHAR") {
          Serial.println("Ação: Fechando...");
          servoMotor.write(0);
        }
      }

      else if (tipo == "PORCOES") {
        int porcoes = conteudo.toInt();

        if (porcoes != config.numPorcoes) {
          config.numPorcoes = porcoes;
          EEPROM.put(0, config);
        }

        Serial.print("Novo número de porções salvo na memória: ");
        Serial.println(config.numPorcoes);
      }

      else if (tipo == "REFEICOES") {
        int refeicoes = conteudo.toInt();
        unsigned long msPorDia = 24UL * 60UL * 60UL * 1000UL;
        unsigned long intervalo = msPorDia / refeicoes;


        if (intervalo != config.intervaloRefeicoes) {
          config.intervaloRefeicoes = intervalo;
          EEPROM.put(0, config);
        }

        Serial.print("Novo intervalo de refeições diárias salvo na memória: ");
        Serial.print(config.intervaloRefeicoes);
        Serial.println(" ms");
      }

      else if (tipo == "AUTOMATICO") {
        int automatico = conteudo.toInt();

        if (automatico != config.automatico) {
          config.automatico = automatico;
          EEPROM.put(0, config);
        }

        Serial.print("Novo status da refeição automática salvo na memória: ");
        Serial.println(config.automatico);
      }
    }
  }
}

// pra quando for liberar normalmente ao clicar para alimentar
void atualizarLiberacao() {
  if (liberando) {
    unsigned long atraso = (unsigned long)config.numPorcoes * 1000UL;
    if (millis() - inicioLiberacao >= atraso) {
      servoMotor.write(0);
      Serial.println("Porção liberada!");
      liberando = false;
    }
  }
}

void liberarPorcao() {
  if (!liberando) {
    Serial.println("Liberando alimento...");
    servoMotor.write(50);
    inicioLiberacao = millis();
    liberando = true;
  }
}

// para a reposição automática
void atualizarLiberacaoAutomatica() {
  if (liberandoAutomatico) {
    unsigned long atraso = (unsigned long)config.numPorcoes * 1000UL;
    if (millis() - inicioLiberacaoAutomatica >= atraso) {
      servoMotor.write(0);
      Serial.println("Refeição automática liberada!");
      liberandoAutomatico = false;
    }
  }
}

void liberacaoAutomatica() {
  if (!liberandoAutomatico) {
    Serial.println("Liberando alimento AUTOMATICAMENTE...");
    servoMotor.write(50);
    inicioLiberacaoAutomatica = millis();
    liberandoAutomatico = true;
  }
}

void verificarAgendamentoAutomatico() {
  if (config.automatico == 1 && config.intervaloRefeicoes > 0 && !liberandoAutomatico) {
    unsigned long agora = millis();

    if (agora - config.ultimoAutomatico >= config.intervaloRefeicoes) {
      liberacaoAutomatica();

      config.ultimoAutomatico = agora;
      EEPROM.put(0, config);
    }
  }
}
