import { Client, GatewayIntentBits, Events } from 'discord.js';
import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';

dotenv.config();

const client = new Client({
  intents: [GatewayIntentBits.Guilds],
});

// Initialize Gemini API
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

client.once(Events.ClientReady, (c) => {
  console.log(`👵 GrandmaCrackers is online and ready in your server! Logged in as ${c.user.tag}`);
});

client.on(Events.InteractionCreate, async (interaction) => {
  if (!interaction.isChatInputCommand()) return;

  const { commandName } = interaction;

  // --- /help ---
  if (commandName === 'help') {
    await interaction.reply(
      `👵 **Welcome to GrandmaCrackers!**\n\n` +
      `I'm here to help you out, give warm advice, and bake delicious treats!\n\n` +
      `**Helpful Commands:**\n` +
      `• \`/ask [question]\` - Ask me anything, sweetie!\n` +
      `• \`/help\` - View this help menu.\n\n` +
      `**Mini Life Game:**\n` +
      `• \`/daily\` - Collect your daily batch of crackers 🍪\n` +
      `• \`/balance\` - Check your cracker pantry balance`
    );
  } 

  // --- Smart /ask using Gemini ---
  else if (commandName === 'ask') {
    const question = interaction.options.getString('question');

    await interaction.deferReply();

    try {
      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: question,
        config: {
          systemInstruction: 
            "You are Grandma Crackers, a loving, sweet, highly intelligent, and helpful grandmother. " +
            "You answer any question accurately and thoroughly while maintaining a warm, supportive tone. " +
            "Use sweet grandmother terms of endearment occasionally (like 'sweetie', 'dear', or 'honey'). " +
            "Keep answers concise and easy to read in Discord (under 1800 characters).",
        },
      });

      const replyText = response.text;
      await interaction.editReply(`❓ **You asked:** *"${question}"*\n\n👵 **Grandma says:**\n${replyText}`);
    } catch (error) {
      console.error('Error generating AI answer:', error);
      await interaction.editReply(`👵 *Oh dear, Grandma lost her reading glasses for a moment! Please ask me again in a second, sweetie.*`);
    }
  } 

  // --- /daily ---
  else if (commandName === 'daily') {
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
});

client.login(process.env.DISCORD_TOKEN);