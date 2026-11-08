const slowFunction = (duration) => {
    const start = Date.now();
    let result = 0;
    while (Date.now() - start < duration) {
        result += Math.random();
    }
    return `Результат вычисления: ${result.toFixed(2)}`;
};

self.addEventListener('message', evt => {
    const result = slowFunction(evt.data.timeout || 3000);
    self.postMessage(result);
});
