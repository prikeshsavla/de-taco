const fetch = (...args) =>
  import("node-fetch").then(({ default: fetch }) => fetch(...args));

async function fetchGraphQL(operationsDoc, operationName, variables) {
  const result = await fetch(process.env.HASURA_URL, {
    method: "POST",
    body: JSON.stringify({
      query: operationsDoc,
      variables: variables,
      operationName: operationName,
    }),
    headers: {
      "x-hasura-admin-secret": process.env.HASURA_SECRET,
      "x-hasura-role": process.env.BOT_ROLE,
    },
  });

  return await result.json();
}

module.exports = {
  fetchGraphQL,
};
