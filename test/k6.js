import http from "k6/http";
import { sleep } from "k6";

export const options = {
  vus: 10,
  duration: "30s",
};

// The default exported function is gonna be picked up by k6 as the entry point for the test script. It will be executed repeatedly in "iterations" for the whole duration of the test.
export default function () {
  // Make a GET request to the target URL
  const url =
    "https://ty9n22xoea.execute-api.ap-southeast-1.amazonaws.com/dev/api/auth";
  const payload = JSON.stringify({
    username: "leensea96@gmail.com",
    password: "Iambawmim2609!",
    clientId: "72mbup7jo0vls4gbe5osag0mqu",
  });

  const params = {
    headers: {
      "Content-Type": "application/json",
    },
  };

  http.post(url, payload, params);
  sleep(1);
}
