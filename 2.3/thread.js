const slowFunction = (duration) => {
    const start = Date.now();
    let result = 0;
    while (Date.now() - start < duration) {
        result += Math.random();
    }
    return `Результат вычисления: ${result.toFixed(2)}`;
};

const cache = {
    result: null
};

const recalculate = (timeout) => {
    cache.result = slowFunction(timeout);
    return cache.result;
}

const getCachedResult = (timeout) => {
    const cachedResult = cache.result;
    if (cachedResult) {
        return cachedResult;
    } else {
        return recalculate(timeout);
    }
}

const broadcast = async (msg) => {
    const clients = await self.clients.matchAll({ includeUncontrolled: true });
    for (const client of clients) {
        client.postMessage(msg);
    }
}

self.addEventListener('activate', async (evt) => {
    console.log('activate', evt);
    evt.waitUntil(self.clients.claim());
});

self.addEventListener('message', evt => {
    console.log('message', evt);
    if (evt.data.type === 'recalculate') {
        const result = recalculate(evt.data.timeout || 3000);
        broadcast({ type: 'result', result, cached: false });
    } else if (evt.data.type === 'getCachedResult') {
        const result = getCachedResult(evt.data.timeout || 3000);
        broadcast({ type: 'result', result, cached: cache.result !== null });
    } else if (evt.data.type === 'unregister') {
        self.registration.unregister();
    }
});
