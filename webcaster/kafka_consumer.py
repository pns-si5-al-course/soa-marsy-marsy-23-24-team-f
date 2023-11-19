# kafka_consumer.py
from confluent_kafka import Consumer, KafkaException
from confluent_kafka import KafkaError
import json
import os


class KafkaConsumerService:
    def __init__(self):
        self.consumer = Consumer(
            {
                "bootstrap.servers": os.getenv("KAFKA_BROKER", "localhost:9092"),
                "group.id": "webcaster-group",
                "auto.offset.reset": "earliest",
            }
        )

    def subscribe_topics(self, topics):
        self.consumer.subscribe(topics)

    def consume_messages(self, callback):
        try:
            while True:
                msg = self.consumer.poll(1.0)
                if msg is None:
                    continue
                if msg.error():
                    if msg.error().code() != KafkaError.NO_ERROR:
                        print("Kafka error:", msg.error())
                        continue

                callback(json.loads(msg.value().decode("utf-8")))
        finally:
            self.consumer.close()
