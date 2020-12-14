function pubSubLib() {
  const subscribers = {};
  function publish(eventName, data) {
    if (!Array.isArray(subscribers[eventName])) {
      return;
    }
    subscribers[eventName].forEach(callback => {
      callback(data);
    });
  }

  function subscribe(eventName, callback) {
    if (!Array.isArray(subscribers[eventName])) {
      subscribers[eventName] = [];
    }
    subscribers[eventName].push(callback);
    const index = subscribers[eventName].length - 1;
    return () => {
      subscribers[eventName].splice(index, 1);
    };
  }

  return {
    publish,
    subscribe,
  };
}

// global pubsub listener
const pubsub = pubSubLib();

export { pubSubLib };
export default pubsub;
