const handlers = []

const addHandler = (handler) => {
  handlers.push(handler);
}

export const ctx = {
  addHandler,
}

const wrapWithHandlers = (fn) => {
  return () => {
    fn();
    handlers.forEach(handler => {
      handler();
    });
  }
}

const app = () => {
  console.log('app');
}

export const start = wrapWithHandlers(app);
