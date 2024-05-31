import Valkey from 'iovalkey';

export default async (host, { randomString }) => {
    const client = new Valkey({
        host,
        lazyConnect: true
    });

    await client.connect();

    return {
        benchmark() {
            return Promise.all([
                client.set(randomString, randomString),
                client.get(randomString),
                client.del(randomString)
            ]);
        },
        teardown() {
            return client.disconnect();
        }
    }
};
