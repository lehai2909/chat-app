import axios from "axios";

/**
 * Call backend search library which returns OpenSearch hits.
 * The backend is expected to return an OpenSearch-style payload where
 * the array of documents is at resp.data.hits.hits. This function
 * returns that array directly.
 *
 * @param {string} keyword
 * @returns {Promise<Array>} array of hit objects (each usually contains _source)
 */
export async function callSearchService(keyword) {
  try {
    // Request 20 items from the backend so it returns a limited set
    const resp = await axios.post("http://localhost:3000/search", {
      keyword,
      size: 20,
    });
    // Expect resp.data.hits.hits to be an array of documents; return only 20
    return (resp?.data?.hits?.hits || []).slice(0, 20);
  } catch (err) {
    const details = err?.response?.data ?? err?.message ?? err;
    throw new Error(
      `Search backend request failed: ${JSON.stringify(details)}`
    );
  }
}
