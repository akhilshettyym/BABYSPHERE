import time
import random
import datetime
import threading
from MLX90614 import MLX90614
import RPi.GPIO as GPIO
import firebase_admin
from firebase_admin import credentials, firestore

# Initialize GPIO
GPIO.setwarnings(True)
GPIO.setmode(GPIO.BCM)

# Initialize Firebase
cred = credentials.Certificate('/home/pi/MINI_PROJECT/babysphere-3d697-firebase-adminsdk-bx0hc-a50fd19daf.json')
firebase_admin.initialize_app(cred)
db = firestore.client()

# Shared data variables with initial values
sensor_data = {
    "temperature": None,
    "humidity": None,
    "baby_temperature": None,
    "ambient_temperature": None,
    "heart_rate": None,
    "spo2": None
}

# Lock for thread-safe access to shared data
data_lock = threading.Lock()

def send_to_firebase():
    while True:
        with data_lock:
            # Check if all sensor data is available
            if all(value is not None for value in sensor_data.values()):
                timestamp = datetime.datetime.now()
                try:
                    # Add all sensor data to Firebase
                    db.collection('sensor_data').add({
                        'temperature': sensor_data["temperature"],
                        'humidity': sensor_data["humidity"],
                        'baby_temperature': sensor_data["baby_temperature"],
                        'ambient_temperature': sensor_data["ambient_temperature"],
                        'heart_rate': sensor_data["heart_rate"],
                        'spo2': sensor_data["spo2"],
                        'timestamp': timestamp
                    })
                    print(f"{timestamp} - Data successfully sent to Firestore: {sensor_data}")
                except Exception as e:
                    print(f"Failed to store data in Firestore: {e}")
                finally:
                    # Reset shared data to prepare for the next batch
                    for key in sensor_data:
                        sensor_data[key] = None
        time.sleep(5)

def generate_random_dht22_values():
    temperature = random.uniform(29, 35)
    humidity = random.uniform(60, 90)
    return temperature, humidity

def read_dht22():
    while True:
        temperature, humidity = generate_random_dht22_values()
        with data_lock:
            sensor_data["temperature"] = temperature
            sensor_data["humidity"] = humidity
        timestamp = datetime.datetime.now()
        print(f"{timestamp} - DHT22 - Temperature: {temperature:.1f} C | Humidity: {humidity:.1f}%")
        time.sleep(5)

def read_mlx90614():
    sensor = MLX90614()
    while True:
        try:
            baby_temp = sensor.readObjectTemperature()
            ambient_temp = sensor.readAmbientTemperature()
            with data_lock:
                sensor_data["baby_temperature"] = baby_temp
                sensor_data["ambient_temperature"] = ambient_temp
            timestamp = datetime.datetime.now()
            print(f"{timestamp} - MLX90614 - Baby Temp: {baby_temp:.1f} C | Ambient Temp: {ambient_temp:.1f} C")
        except Exception as e:
            print(f"Error reading MLX90614 sensor: {e}")
        time.sleep(5)

def generate_random_heart_rate():
    return random.uniform(60, 100)  # Normal resting heart rate for adults

def generate_random_spo2():
    return random.uniform(95, 99)  # Normal SpO2 levels for healthy individuals

def read_max30102():
    while True:
        try:
            heart_rate = generate_random_heart_rate()
            spo2 = generate_random_spo2()
            with data_lock:
                sensor_data["heart_rate"] = heart_rate
                sensor_data["spo2"] = spo2
            timestamp = datetime.datetime.now()
            print(f"{timestamp} - MAX30102 - Heart Rate: {heart_rate:.1f} bpm | SpO2: {spo2:.1f}%")
        except Exception as e:
            print(f"Error simulating MAX30102 data: {e}")
        time.sleep(1)

if __name__ == "_main_":
    try:
        # Start threads for reading sensors and sending data to Firebase
        thread1 = threading.Thread(target=read_dht22)
        thread2 = threading.Thread(target=read_mlx90614)
        thread3 = threading.Thread(target=send_to_firebase)
        thread4 = threading.Thread(target=read_max30102)

        thread1.start()
        thread2.start()
        thread3.start()
        thread4.start()

        # Wait for all threads to complete
        thread1.join()
        thread2.join()
        thread3.join()
        thread4.join()
    finally:
        GPIO.cleanup()  # Ensure GPIO cleanup on program exit