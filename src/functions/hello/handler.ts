const hello = async (event) => {
  return {
    message: `Hello ${event.name}, welcome to the exciting Serverless world!`,
    event,
  };
};

export const main = hello;
