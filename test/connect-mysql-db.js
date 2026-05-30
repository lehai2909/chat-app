import mysql from "mysql2/promise";

export const handler = async (event) => {
  //MySQL Connection Test
  try {
    const connection = await mysql.createConnection({
      host: "34.10.194.136",
      user: "root",
      database: "app",
      password: "iambawmim",
    });
    try {
      const [results, fields] = await connection.query(
        "SELECT * FROM `products`"
      );

      console.log(results); // results contains rows returned by server
      console.log(fields); // fields contains extra meta data about results, if available
    } catch (err) {
      console.log(err);
    }
  } catch (err) {
    console.log(err);
  }
  const response = {
    statusCode: 200,
    body: JSON.stringify("Writed to DB!"),
  };
  return response;
};

handler();
