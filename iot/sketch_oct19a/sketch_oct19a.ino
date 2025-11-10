#include <Arduino.h>
#include <driver/i2s.h>
#include <math.h>

// INMP441 → ESP32 pins
#define PIN_WS  25   // LRCLK
#define PIN_SCK 26   // BCLK
#define PIN_SD  33   // DOUT

#define SAMPLE_RATE 16000
#define SAMPLES     1024

int32_t buffer[SAMPLES];

void setup() {
  Serial.begin(115200);
  delay(500);
  Serial.println("INMP441 → Nível de som (dB aprox) a cada 2s");

  i2s_config_t config = {
    .mode                 = (i2s_mode_t)(I2S_MODE_MASTER | I2S_MODE_RX),
    .sample_rate          = SAMPLE_RATE,
    .bits_per_sample      = I2S_BITS_PER_SAMPLE_32BIT,
    .channel_format       = I2S_CHANNEL_FMT_ONLY_LEFT,
    .communication_format = I2S_COMM_FORMAT_I2S,
    .intr_alloc_flags     = 0,
    .dma_buf_count        = 4,
    .dma_buf_len          = SAMPLES
  };

  i2s_pin_config_t pin_cfg = {
    .bck_io_num   = PIN_SCK,
    .ws_io_num    = PIN_WS,
    .data_out_num = -1,
    .data_in_num  = PIN_SD
  };

  i2s_driver_install(I2S_NUM_0, &config, 0, NULL);
  i2s_set_pin(I2S_NUM_0, &pin_cfg);
  i2s_zero_dma_buffer(I2S_NUM_0);
}

void loop() {
  size_t bytes_read = 0;
  i2s_read(I2S_NUM_0, buffer, sizeof(buffer), &bytes_read, portMAX_DELAY);

  int samples = bytes_read / 4;
  if (samples == 0) return;

  double sum_sq = 0;
  bool has_signal = false;

  for (int i=0; i<samples; i++) {
    int32_t v = buffer[i] >> 8; // 24 bits úteis
    if (v != 0) has_signal = true;
    sum_sq += (double)v * v;
  }

  if (!has_signal) {
    Serial.println("Sem sinal? (verifique conexões)");
    delay(2000);
    return;
  }

  double rms = sqrt(sum_sq / samples);
  if (rms < 1) rms = 1; // evita log(0)

  // dB relativo — vamos calibrar depois com app dB meter
  double db = 20.0 * log10(rms / 50000.0);

  Serial.print("Nível de som: ");
  Serial.print(db, 2);
  Serial.println(" dB");

  delay(2000);
}



