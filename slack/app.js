const { App } = require("@slack/bolt");

// Initializes your app with your bot token and app token
const app = new App({
  token: process.env.SLACKTOKEN,
  signingSecret: process.env.SIGNING_SECRET,
  socketMode: true,
  appToken: process.env.APP_TOKEN,
});

// Listens to incoming messages that contain "hello"
app.message("hello", async ({ message, say }) => {
  // say() sends a message to the channel where the event was triggered
  await say(`Hey there Bud<@${message.user}>!`);
});

app.message(":wave:", async ({ message, say }) => {
  await say(`Hello, <@${message.user}>`);
});

app.event("reaction_added", async ({ event, say, client, logger }) => {
  /* 
 event = {
    "type": "reaction_added",
    "user": "U024BE7LH",
    "reaction": "thumbsup",
    "item_user": "U0G9QF9C6",
    "item": {
        "type": "message",
        "channel": "C0G9QF9GZ",
        "ts": "1360782400.498405"
    },
    "event_ts": "1360782804.083113"
}
 */
  try {
    // Call chat.postMessage with the built-in client
    await say(`:${event.reaction}: reaction received from <@${event.user}>!`);
    const result = await client.chat.postMessage({
      channel: event.user,
      text: `:${event.reaction}: reaction given to <@${event.item_user}>!`,
    });
    logger.info(result);
  } catch (error) {
    logger.error(error);
  }
});

(async () => {
  // Start your app
  await app.start(process.env.PORT || 3000);

  console.log("⚡️ Bolt app is running!");
})();
