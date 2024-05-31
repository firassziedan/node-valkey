import { createClient } from 'valkey-v1';
import { once } from 'events';
import { promisify } from 'util';

export default async (host) => {
    const client = createClient({ host }),
        pingAsync = promisify(client.ping).bind(client),
        quitAsync = promisify(client.quit).bind(client);

    await once(client, 'connect');

    return {
        benchmark() {
            return pingAsync();
        },
        teardown() {
            return quitAsync();
        }
    };

};
