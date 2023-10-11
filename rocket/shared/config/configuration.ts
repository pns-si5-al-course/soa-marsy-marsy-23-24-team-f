export default () => ({
    port: process.env.APP_PORT,
    kafka_broker: process.env.KAFKA_BROKER,
    intterval: process.env.PUBLISH_INTERVAL,
  });
  