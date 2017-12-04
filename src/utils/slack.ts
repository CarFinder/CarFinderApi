import * as Slack from 'slack-node';

const webhookUri = process.env.SLACK_URL;

export const sendMessageToSlack = (message: string) => {
  const slack = new Slack();
  slack.setWebhook(webhookUri);

  slack.webhook(
    {
      channel: '#parsercheck',
      text: message,
      username: 'parsechecker'
    },
    (err, res) => {
      if (!err) {
        global.console.log('The message has been sent to slack!');
      } else {
        global.console.log(`Error in sending message to slack!,
          Text: ${err}
        `);
      }
    }
  );
};
