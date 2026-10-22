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

// --- /help ---
  if (commandName === 'help') {
    await interaction.reply(
      `👵 **Welcome to GrandmaCrackers!**\n\n` +
      `I'm here to help you out, give warm advice, and bake delicious treats!\n\n` +
      `**Helpful Commands:**\n` +
      `• \`/ask [question]\` - Ask me anything, sweetie!\n` +
      `• \`/wisdom\` - Receive a random piece of grandma wisdom.\n\n` +
      `**Mini Life Game:**\n` +
      `• \`/daily\` - Collect your daily batch of crackers 🍪\n` +
      `• \`/balance\` - Check your cracker pantry balance`
    );
  } 

  // --- /ask ---
  else if (commandName === 'ask') {
    const question = interaction.options.getString('question');
    const responses = [
      `Oh dear, that's a wonderful question! Here's what I think: Always trust your heart and take things one step at a time. 👵✨`,
      `Well sweetie, back in my day we learned that patience and a warm cup of tea solve most problems! You've got this! ☕`,
      `Bless your heart for asking! The best answer I can give you is to always be kind to yourself and others. ❤️`,
      `That is a very smart thing to ask! Just remember that every small effort adds up over time, dear. 🍪`
    ];
    const randomResponse = responses[Math.floor(Math.random() * responses.length)];
    
    await interaction.reply(`❓ **You asked:** *"${question}"*\n\n👵 **Grandma says:** ${randomResponse}`);
  } 

  // --- /daily ---
  else if (commandName === 'daily') {
    // Basic daily cracker reward (50-100 crackers)
    const earned = Math.floor(Math.random() * 51) + 50; 
    await interaction.reply(
      `👵 **Grandma baked for you!**\n` +
      `You collected your daily allowance of **${earned} Crackers**! 🍪\n` +
      `*Come back tomorrow for more!*`
    );
  } 

  // --- /balance ---
  else if (commandName === 'balance') {
    await interaction.reply(
      `👵 **Grandma's Pantry:**\n` +
      `You currently have **150 Crackers** stored safely in your jar! 🍪`
    );
  }

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