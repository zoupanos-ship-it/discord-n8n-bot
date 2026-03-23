const { Client, GatewayIntentBits, Events } = require('discord.js');

const DISCORD_TOKEN = process.env.DISCORD_TOKEN;
const N8N_WEBHOOK_URL = process.env.N8N_WEBHOOK_URL;

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
});

client.once(Events.ClientReady, () => {
  console.log(`Bot συνδέθηκε ως ${client.user.tag}`);
});

client.on(Events.MessageCreate, async (message) => {
  try {
    if (message.author.bot) return;
    if (!message.guild) return;

    const attachments = [...message.attachments.values()].map((file) => ({
      url: file.url,
      name: file.name
    }));

    const payload = {
      channel_name: message.channel.name,
      message_text: message.content,
      author: message.author.username,
      attachments
    };

    await fetch(N8N_WEBHOOK_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    console.log('Στάλθηκε στο n8n');
  } catch (e) {
    console.error(e);
  }
});

client.login(DISCORD_TOKEN);
