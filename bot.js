const { App } = require("@slack/bolt");
const { awardTaco } = require("./src/awardTaco");
const { userStatsFromDate } = require("./src/stats");

// Initializes your app with your bot token and app token
const app = new App({
  token: process.env.SLACKTOKEN,
  signingSecret: process.env.SIGNING_SECRET,
  socketMode: true,
  appToken: process.env.APP_TOKEN,
});

app.event("reaction_added", async ({ event, client, logger }) => {
  try {
    // Call chat.postMessage with the built-in client
    if (event.reaction === "taco") {
      awardTaco(event.user, event.item_user);
      const to = await client.chat.postMessage({
        channel: event.item_user,
        text: `<@${event.user}> sent you 1 :taco:`,
      });
      const from = await client.chat.postMessage({
        channel: event.user,
        text: `1 :taco: given to <@${event.item_user}>!`,
      });
      logger.info(to);
      logger.info(from);
    }
  } catch (error) {
    logger.error(error);
  }
});

app.command("/stats", async ({ payload, ack, respond }) => {
  await ack();
  const stats = await userStatsFromDate(new Date(), payload.user_id);
  await respond(
    `*todays* :taco: sent ${stats.todays_sent}, received ${stats.todays_received}, \n *all* :taco: sent ${stats.total_sent}, received ${stats.total_received},`
  );
});

(async () => {
  // Start your app
  await app.start(process.env.PORT || 3000);

  console.log("⚡️ Bolt app is running!");
})();
