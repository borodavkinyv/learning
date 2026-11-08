self.addEventListener('message', evt => {
    const subWorker = new Worker("./thread2.js");
    subWorker.addEventListener('message', subEvt => {
        self.postMessage(subEvt.data);
        subWorker.terminate();
    });
    subWorker.postMessage(evt.data);
});
