// This is an example script to connect to a running cluster.
// After connecting to the cluster the code sets and get a value.

// To setup this cluster you can follow the guide here:
// https://valkey.io/docs/manual/scaling/
// In this guide the ports which are being used are 7000 - 7005


import { createCluster } from 'valkey';

const cluster = createCluster({
    rootNodes : [
        {
            url : 'valkey://127.0.0.1:7001'
        },
        {
            url : 'valkey://127.0.0.1:7002'
        },
        {
            url : 'valkey://127.0.0.1:7003'
        }
    ]
});

cluster.on('error', (err) => console.log('Valkey Client Error', err));

await cluster.connect();

await cluster.set('hello', 'cluster');
const value = await cluster.get('hello');
console.log(value);

await cluster.quit();
