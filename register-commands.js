import { REST, Routes, SlashCommandBuilder } from 'discord.js';
import dotenv from 'dotenv';

dotenv.config();

const commands = [
  new SlashCommandBuilder()
    .setName('help')
    .setDescription('Displays Grandma\'s kitchen guide and command list'),

  new SlashCommandBuilder()
    .setName('daily')
    .setDescription('Collect your daily allowance of freshly baked crackers (1h cooldown)'),

  new SlashCommandBuilder()
    .setName('balance')
    .setDescription('Check your current cracker balance'),

  new SlashCommandBuilder()
    .setName('work')
    .setDescription('Help Grandma with chores around the house to earn crackers (1h cooldown)'),

  new SlashCommandBuilder()
    .setName('beg')
    .setDescription('Ask Grandma nicely for a spare cracker (1h cooldown)'),

  new SlashCommandBuilder()
    .setName('coinflip')
    .setDescription('Bet your crackers on a coin flip with Grandma')
    .addIntegerOption(option =>
      option.setName('bet')
        .setDescription('Amount of crackers to bet')
        .setRequired(true)
        .setMinValue(1)
    )
    .addStringOption(option =>
      option.setName('choice')
        .setDescription('Heads or tails?')
        .setRequired(true)
        .addChoices(
          { name: 'Heads', value: 'heads' },
          { name: 'Tails', value: 'tails' }
        )
    ),

  new SlashCommandBuilder()
    .setName('pay')
    .setDescription('Gift some of your crackers to another user')
    .addUserOption(option =>
      option.setName('user')
        .setDescription('The recipient user')
        .setRequired(true)
    )
    .addIntegerOption(option =>
      option.setName('amount')
        .setDescription('Amount of crackers to transfer')
        .setRequired(true)
        .setMinValue(1)
    ),

  new SlashCommandBuilder()
    .setName('sneak')
    .setDescription('Attempt to steal crackers from the pantry (2h cooldown)'),

  new SlashCommandBuilder()
    .setName('roll')
    .setDescription('Roll a random number or dice')
    .addIntegerOption(option =>
      option.setName('max')
        .setDescription('Maximum number to roll (Default: 100)')
        .setRequired(false)
        .setMinValue(1)
    ),

  new SlashCommandBuilder()
    .setName('remind')
    .setDescription('Have Grandma remind you about something later')
    .addStringOption(option =>
      option.setName('task')
        .setDescription('What do you want Grandma to remind you about?')
        .setRequired(true)
    )
    .addStringOption(option =>
      option.setName('time')
        .setDescription('When to remind you (e.g., 10s, 5m, 1h)')
        .setRequired(true)
    ),

  // --- NEW: /ask ---
  new SlashCommandBuilder()
    .setName('ask')
    .setDescription('Ask Grandma a question using OpenAI')
    .addStringOption(option =>
      option.setName('question')
        .setDescription('What do you want to ask Grandma?')
        .setRequired(true)
    ),
].map(command => command.toJSON());

const rest = new REST({ version: '10' }).setToken(process.env.DISCORD_TOKEN);

(async () => {
  try {
    console.log('Registering slash commands with Discord...');
    await rest.put(
      Routes.applicationCommands(process.env.CLIENT_ID),
      { body: commands }
    );
    console.log('Slash commands registered successfully!');
  } catch (error) {
    console.error('Error registering slash commands:', error);
  }
})();