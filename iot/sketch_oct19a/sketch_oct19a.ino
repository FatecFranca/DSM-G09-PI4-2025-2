/*
  Projeto: OuvIoT - Teste de Comunicação ESP32
  Descrição:
  Demonstra a integração do ESP32 com o Arduino IDE,
  simulando a leitura de um sensor de som e o envio
  dos valores capturados para um servidor.

*/

int valorSom = 0;      // Variável que simula o valor capturado do som
int contador = 0;      // Contador para exibir número de leituras

void setup() {
  Serial.begin(115200);
  Serial.println("📡 ESP32 conectado com sucesso!");
  Serial.println("🎚️ Iniciando simulação de captura de som...");
  delay(1000);
}

void loop() {
  valorSom = random(30, 90);  // Gera valores fictícios de ruído (em dB)
  contador++;

  //Exibe o valor lido no monitor serial
  Serial.print("📊 Leitura nº ");
  Serial.print(contador);
  Serial.print(": ");
  Serial.print(valorSom);
  Serial.println(" dB");

  //Simula envio dos dados
  Serial.println("🚀 Enviando dados para o servidor...");
  delay(1000);
  Serial.println("✅ Dados enviados com sucesso!\n");

  delay(2000); // Aguarda 2 segundos antes da próxima simulação
}
