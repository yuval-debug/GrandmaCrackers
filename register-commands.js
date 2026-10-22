import { REST, Routes, ApplicationCommandOptionType } from 'discord.js';
import dotenv from 'dotenv';

dotenv.config();

const commands = [
  // --- Helpful & Personality Commands ---
  {
    name: 'ask',
    description: 'Ask Grandma anything and she will give you warm, helpful advice!',
    options: [
      {
        name: 'question',
        description: 'What would you like to ask Grandma?',
        type: ApplicationCommandOptionType.String,
        required: true,
      },
    ],
  },
  {
    name: 'help',
    description: 'Learn how to use GrandmaCrackers and start playing the mini life game!',
  },

  // --- Mini Life Game Commands ---
  {
    name: 'daily',
    description: 'Collect your daily batch of freshly baked crackers!',
  },
  {
    name: 'balance',
    description: 'Check how many crackers you have saved up in your pantry.',
  },
];

const rest = new REST({ version: '10' }).setToken(process.env.DISCORD_TOKEN);

(async () => {
  try {
    console.log('Registering application commands...');
    await rest.put(
      Routes.applicationCommands(process.env.CLIENT_ID),
      { body: commands },
    );
    console.log('Successfully registered all commands!');
  } catch (error) {
    console.error(error);
  }
})();