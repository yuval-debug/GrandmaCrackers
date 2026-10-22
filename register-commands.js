import { REST, Routes, ApplicationCommandOptionType } from 'discord.js';
import dotenv from 'dotenv';

dotenv.config();

const commands = [
  {
    name: 'help',
    description: 'Learn how to use GrandmaCrackers and start playing!',
  },
  {
    name: 'daily',
    description: 'Collect your daily batch of freshly baked crackers!',
  },
  {
    name: 'balance',
    description: 'Check how many crackers you have saved up in your pantry.',
  },
  {
    name: 'work',
    description: 'Do small chores around Grandma\'s house to earn extra crackers!',
  },
  {
    name: 'beg',
    description: 'Ask Grandma nicely for a spare cracker.',
  },
  {
    name: 'coinflip',
    description: 'Flip a coin with Grandma to risk your crackers!',
    options: [
      {
        name: 'bet',
        description: 'Amount of crackers to bet',
        type: ApplicationCommandOptionType.Integer,
        required: true,
        min_value: 1,
      },
      {
        name: 'choice',
        description: 'Heads or Tails',
        type: ApplicationCommandOptionType.String,
        required: true,
        choices: [
          { name: 'Heads', value: 'heads' },
          { name: 'Tails', value: 'tails' },
        ],
      },
    ],
  },
  {
    name: 'pay',
    description: 'Share your crackers with another server member!',
    options: [
      {
        name: 'user',
        description: 'The user you want to give crackers to',
        type: ApplicationCommandOptionType.User,
        required: true,
      },
      {
        name: 'amount',
        description: 'Amount of crackers to send',
        type: ApplicationCommandOptionType.Integer,
        required: true,
        min_value: 1,
      },
    ],
  },
  {
    name: 'sneak',
    description: 'Try to sneak a cracker from Grandma\'s jar without getting caught!',
  },
];

const rest = new REST({ version: '10' }).setToken(process.env.DISCORD_TOKEN);

(async () => {
  try {
    console.log('Registering updated life commands...');
    await rest.put(
      Routes.applicationCommands(process.env.CLIENT_ID),
      { body: commands },
    );
    console.log('Successfully registered all commands!');
  } catch (error) {
    console.error('Registration failed:', error);
  }
})();