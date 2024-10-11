import { retry } from "async";

(async () => {
  console.log("hello");
  await retry({ times: 5, interval: 300 }, async () => {
    Promise.resolve();
  });

  console.log("world");
})();
