# kafka_consumer.py
import logging
import signal
from confluent_kafka import Consumer, KafkaException
from confluent_kafka import KafkaError
import json
import uuid
import os


class KafkaConsumerService:
    def __init__(self):
        unique_group_id = f"webcaster-group-{uuid.uuid4()}"
        self.consumer = Consumer(
            {
                "bootstrap.servers": os.getenv("KAFKA_BROKER", "kafka:19092"),
                "group.id": unique_group_id,
                "auto.offset.reset": "latest",
            }
        )

    def subscribe_topics(self, topics):
        logging.info(f"Subscribing to Kafka topics: {topics}")
        self.consumer.subscribe(topics)

    def close(self):
        logging.info("Closing Kafka Consumer...")
        self.consumer.close()

    def consume_messages(self, callback):
        try:
            while True:
                msg = self.consumer.poll(1.0)
                if msg is None:
                    continue
                if msg.error():
                    if msg.error().code() != KafkaError.NO_ERROR:
                        logging.error(f"Kafka error: {msg.error()}")
                        continue

                message_data = json.loads(msg.value().decode("utf-8"))
                logging.info(f"Received message: {message_data}")
                callback(message_data)
        finally:
            self.consumer.close()
