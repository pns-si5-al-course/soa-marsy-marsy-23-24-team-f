from flask import Flask, render_template
from threading import Thread
from queue import Queue
from kafka_consumer import KafkaConsumerService
import os
import logging
from dotenv import load_dotenv
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

load_dotenv()

logging.basicConfig(level=logging.DEBUG)

app = Flask(__name__)
messages = Queue(maxsize=10)


def consume_events():
    def callback(msg):
        logging.info(f"Message received: {msg}")
        if messages.full():
            messages.get()
        messages.put(msg)

    logging.info("Starting Kafka Consumer Service...")
    consumer_service = KafkaConsumerService()
    consumer_service.subscribe_topics(["logs.topic"])
    consumer_service.consume_messages(callback)


@app.route("/")
def index():
    current_messages = list(messages.queue)
    logging.info(f"Rendering messages: {current_messages}")
    return render_template("index.html", messages=current_messages)


@app.route("/test")
def test():
    test_message = "Test message"
    if messages.full():
        messages.get()
    messages.put(test_message)
    return f"Added test message: {test_message}"


@app.route("/fetch-messages")
def fetch_messages():
    current_messages = list(messages.queue)
    logging.info(f"Fetching messages for display: {current_messages}")
    return render_template("messages.html", messages=current_messages)


if __name__ == "__main__":
    Thread(target=consume_events, daemon=True).start()
    app.run(debug=True, host="0.0.0.0", port=int(os.getenv("APP_PORT", 3010)))
