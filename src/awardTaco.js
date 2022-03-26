const { fetchGraphQL } = require("./hasura");

const operationsDoc = `
  mutation AwardTaco($from: String, $to: String) {
    insert_trades(objects: {from: $from, to: $to}) {
      affected_rows
    }
  }
`;

function executeAwardTaco(from, to) {
  return fetchGraphQL(operationsDoc, "AwardTaco", {
    from: from,
    to: to,
  });
}

async function awardTaco(from, to) {
  const { errors, data } = await executeAwardTaco(from, to);

  if (errors) {
    // handle those errors like a pro
    console.error(errors);
  }
  return data.insert_trades.affected_rows === 1;
}

module.exports = {
  awardTaco,
};
