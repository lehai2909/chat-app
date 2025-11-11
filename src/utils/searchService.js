import axios from "axios";

export async function callSearchService() {
  const resp = await axios.post("http://localhost:3000/search-lib", {
    keyword: "t-shirt",
  });
  console.log(resp.data.hits.hits);
}

//http://localhost:9200/_cluster/health
// const url = "http://localhost:9200/ecommmerce/_search";
// const body = {
//   query: {
//     match: {
//       "products.product_name": "t-shirt",
//     },
//   },
// };

//   try {
//     const resp = await axios.get(url, body, {
//       headers: { "Content-Type": "application/json" },
//     });
//     // Return the full response data so callers can inspect hits, total, etc.
//     console.log(resp.data);
//   } catch (err) {
//     // Normalize error message and rethrow for caller handling
//     const details = err?.response?.data ?? err?.message ?? err;
//     throw new Error(`OpenSearch request failed: ${JSON.stringify(details)}`);
//   }
// }
