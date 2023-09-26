import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";

require('dotenv').config();

const telemetrieServiceUrl = process.env.TELEMETRIE_SERVICE_URL;
const authToken = process.env.AUTH_TOKEN;


async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await app.listen(3004);
}
bootstrap();

const get = async(url) => {
  try {
      const response = await fetch(url, {
          method: 'GET',
          headers: {
              'Authorization': `${authToken}`
          },
      });

      if (!response.ok) {
          throw new Error(`Erreur de requête HTTP - Code d'état HTTP : ${response.status}`);
      }
      return response.json();
  } catch (error) {
      console.error(error.message);
      throw error; // Vous pouvez gérer l'erreur ici ou la propager
  }
}

async function main() {
  console.log('Gwynne : asking for telemetrics updates');
  const timeout = setInterval(async () => {
    try {
      const res = await get(telemetrieServiceUrl + '/rocket/telemetrics')
      .then(data => {
        console.log('Gwynne : telemetrics updated');
        console.log(data);
      })
    } catch (error) {
        throw error;
    }}, 2000);
}

main();

const sleep = async (milliseconds) => {
  await new Promise(resolve => {
      return setTimeout(resolve, milliseconds)
  });
};

