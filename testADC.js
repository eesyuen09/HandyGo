
import { GoogleAuth } from 'google-auth-library';

(async () => {
  try {
    const auth = new GoogleAuth();
    const client = await auth.getClient();
    console.log(' ADC loaded, client type:', client.constructor.name);
  } catch (err) {
    console.error(' ADC error:', err.message);
  }
})();