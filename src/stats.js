const { fetchGraphQL } = require("./hasura");

const operationsDoc = `
  query UserStats($todays_date: timestamptz, $user: String = "b") {
    todays_sent: trades_aggregate(where: {from: {_eq: $user}, created_at: {_gte: $todays_date}}) {
      aggregate {
        count
      }
    }
    todays_received: trades_aggregate(where: {from: {_eq: $user}, created_at: {_gte: $todays_date}}) {
      aggregate {
        count
      }
    }
    total_sent: trades_aggregate(where: {from: {_eq: $user}}) {
      aggregate {
        count
      }
    }
    total_received: trades_aggregate(where: {to: {_eq: $user}}) {
      aggregate {
        count
      }
    }
  }
`;

function fetchUserStats(todays_date, user) {
  return fetchGraphQL(operationsDoc, "UserStats", {
    todays_date: todays_date,
    user: user,
  });
}

async function userStatsFromDate(date, user) {
  date.setHours(0, 0, 0, 0);

  const { errors, data } = await fetchUserStats(date, user);

  if (errors) {
    // handle those errors like a pro
    console.error(errors);
  }
  return {
    todays_sent: data.todays_sent.aggregate.count,
    todays_received: data.todays_received.aggregate.count,
    total_sent: data.total_sent.aggregate.count,
    total_received: data.total_received.aggregate.count,
  };
}

module.exports = {
  userStatsFromDate,
};
