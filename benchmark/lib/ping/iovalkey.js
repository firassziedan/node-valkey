import Valkey from 'iovalkey';

export default async (host) => {
    const client = new Valkey({
        host,
        lazyConnect: true
    });

    await client.connect();

    return {
        benchmark() {
            return client.ping();
        },
        teardown() {
            return client.disconnect();
        }
    }
};
