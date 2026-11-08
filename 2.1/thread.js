const bc = new BroadcastChannel("test_channel");

const slowFunction = (duration) => {
    const start = Date.now();
    let result = 0;
    while (Date.now() - start < duration) {
        result += Math.random();
    }
    return `Результат вычисления: ${result.toFixed(2)}`;
};

self.onmessage = () => {
    const result = slowFunction(3000);
    bc.postMessage(result);
};
