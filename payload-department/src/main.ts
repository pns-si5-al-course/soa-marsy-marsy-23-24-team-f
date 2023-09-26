require('dotenv').config();

const telemetrieServiceUrl = process.env.TELEMETRIE_SERVICE_URL;
const authToken = process.env.AUTH_TOKEN;

const get = async(url) => {
  try {
      const response = await fetch(url, {
          method: 'GET',
          headers: {
              'Content-Type': 'application/json',
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
  do 
    try {
      const data = await get(telemetrieServiceUrl + '/rocket/telemetrics');
      console.log(data);
      await sleep(5000);
    } catch (error) {
        throw error;
    }
  while (true)
      
}

main();

const sleep = async (milliseconds) => {
  await new Promise(resolve => {
      return setTimeout(resolve, milliseconds)
  });
};

