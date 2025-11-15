#include <WiFi.h>
#include <PubSubClient.h>
#include <ArduinoJson.h>
#include <WiFiManager.h>   // Biblioteca do WiFiManager

// =============================
// CONFIG WiFi
// =============================
const char* ssid = "Falqueto 2.4G";
const char* password = "@Loki21@";

// =============================
// CONFIG MQTT
// =============================
const char* mqtt_server = "20.80.105.137";   // IP da sua VM Azure com Mosquitto
const int   mqtt_port   = 1883;

WiFiClient espClient;
PubSubClient client(espClient);

bool capturaAtiva = false;
String salaAtual = "";

// =============================
// SENSOR KY-038 / LEDs
// =============================
#define MIC_PIN 34

#define LED_VERDE    27
#define LED_AMARELO  14
#define LED_VERMELHO 12

const int sampleWindow = 100; // 100ms

// =============================
// Funções auxiliares
// =============================
float amplitudeToDb(int amplitude) {
  if (amplitude <= 1) return 0;
  float db = 20 * log10((float)amplitude);
  if (db < 0) db = 0;
  return db;
}

String classifyNoise(float db) {
  if (db < 50) {
    digitalWrite(LED_VERDE, HIGH);
    digitalWrite(LED_AMARELO, LOW);
    digitalWrite(LED_VERMELHO, LOW);
    return "ok";
  } 
  else if (db < 60) {
    digitalWrite(LED_VERDE, LOW);
    digitalWrite(LED_AMARELO, HIGH);
    digitalWrite(LED_VERMELHO, LOW);
    return "alert";
  } 
  else {
    digitalWrite(LED_VERDE, LOW);
    digitalWrite(LED_AMARELO, LOW);
    digitalWrite(LED_VERMELHO, HIGH);
    return "high";
  }
}

// =============================
// CALLBACK MQTT
// =============================
void mqttCallback(char* topic, byte* message, unsigned int length) {
  String payload = "";
  for (int i = 0; i < length; i++) payload += (char)message[i];

  Serial.println("📩 Comando recebido → " + payload);

  if (String(topic) == "ouviot/captura/comando") {
    if (payload == "start") {
      capturaAtiva = true;
      Serial.println("▶️ CAPTURA ATIVADA!");
    }
    if (payload == "stop") {
      capturaAtiva = false;
      Serial.println("⏹ CAPTURA PARADA!");
    }
  }

  if (String(topic) == "ouviot/captura/sala") {
    salaAtual = payload;
    Serial.println("Sala definida: " + salaAtual);
  }
}

// =============================
// CONECTAR MQTT
// =============================
void reconnectMQTT() {
  while (!client.connected()) {
    Serial.print("Conectando ao MQTT...");
    if (client.connect("ESP32_Ouviot")) {
      Serial.println("conectado!");

      client.subscribe("ouviot/captura/comando");
      client.subscribe("ouviot/captura/sala");

    } else {
      Serial.print("falhou, rc=");
      Serial.println(client.state());
      delay(2000);
    }
  }
}

// =============================
// SETUP
// =============================
void setup() {
  Serial.begin(115200);

  pinMode(LED_VERDE, OUTPUT);
  pinMode(LED_AMARELO, OUTPUT);
  pinMode(LED_VERMELHO, OUTPUT);

  // ===== WiFiManager =====
  WiFiManager wm;

  Serial.println("⚙ Iniciando WiFiManager...");
  bool res = wm.autoConnect("OuvIoT-Setup");  // sem senha

  if (!res) {
    Serial.println("❌ Falha ao conectar. Reiniciando...");
    delay(3000);
    ESP.restart();
  }

  Serial.println("📶 WiFi conectado!");
  Serial.println(WiFi.localIP());

  // ===== MQTT =====
  client.setServer(mqtt_server, mqtt_port);
  client.setCallback(mqttCallback);
}

// =============================
// LOOP
// =============================
void loop() {
  if (!client.connected()) reconnectMQTT();
  client.loop();

  if (!capturaAtiva) return;

  unsigned long startTime = millis();

  int signalMax = 0;
  int signalMin = 4095;

  while (millis() - startTime < sampleWindow) {
    int adcValue = analogRead(MIC_PIN);
    if (adcValue > signalMax) signalMax = adcValue;
    if (adcValue < signalMin) signalMin = adcValue;
  }

  int amplitude = signalMax - signalMin;
  float db = amplitudeToDb(amplitude);
  String status = classifyNoise(db);

  // Monta JSON
  StaticJsonDocument<256> doc;
  doc["sala"] = salaAtual;
  doc["db"] = db;
  doc["status"] = status;

  char buffer[256];
  serializeJson(doc, buffer);

  client.publish("ouviot/captura/dados", buffer);

  Serial.printf("📤 Enviado → Sala: %s | dB: %.1f | Estado: %s\n",
                salaAtual.c_str(), db, status.c_str());
}
