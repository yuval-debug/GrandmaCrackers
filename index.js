import { Client, GatewayIntentBits } from 'discord.js';
import dotenv from 'dotenv';

dotenv.config();

const client = new Client({
  intents: [GatewayIntentBits.Guilds]
});

client.once('ready', () => {
  console.log(`👵 GrandmaCrackers is online and ready in your server! Logged in as ${client.user.tag}`);
});

client.on('interactionCreate', async (interaction) => {
  if (!interaction.isChatInputCommand()) return;

  const { commandName } = interaction;

  if (commandName === 'roll') {
    const rollResult = Math.floor(Math.random() * 6) + 1;
    await interaction.reply(
      `👵 **GrandmaCrackers says:** Here are your dice, dearie! You rolled a **${rollResult}**! Have a cracker! 🍪`
    );
  } else if (commandName === 'wisdom') {
    const wisdomList = [
      "Always drink plenty of water, dearie!",
      "Don't sit too close to the screen, it'll strain your eyes!",
      "Make sure you get plenty of sleep tonight!",
      "Did you eat enough today? Let Grandma get you a snack!"
    ];
    const randomWisdom = wisdomList[Math.floor(Math.random() * wisdomList.length)];
    await interaction.reply(`👵 **GrandmaCrackers says:** ${randomWisdom}`);
  }
});

client.login(process.env.DISCORD_TOKEN);