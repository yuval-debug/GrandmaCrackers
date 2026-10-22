import { Client, GatewayIntentBits, Events } from 'discord.js';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import OpenAI from 'openai';

dotenv.config();

const client = new Client({
  intents: [GatewayIntentBits.Guilds],
});

// Initialize OpenAI client
const openai = process.env.OPENAI_API_KEY 
  ? new OpenAI({ apiKey: process.env.OPENAI_API_KEY })
  : null;

const DB_PATH = path.resolve('./db.json');

function getDatabase() {
  if (!fs.existsSync(DB_PATH)) {
    fs.writeFileSync(DB_PATH, JSON.stringify({}), 'utf8');
  }
  try {
    const data = fs.readFileSync(DB_PATH, 'utf8');
    return JSON.parse(data || '{}');
  } catch (error) {
    console.error('Error reading db.json:', error);
    return {};
  }
}

function saveDatabase(data) {
  try {
    fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2), 'utf8');
  } catch (error) {
    console.error('Error writing to db.json:', error);
  }
}

function getUserData(userId) {
  const db = getDatabase();
  if (!db[userId]) {
    db[userId] = { balance: 0, cooldowns: {} };
  }
  if (typeof db[userId] === 'number') {
    db[userId] = { balance: db[userId], cooldowns: {} };
  }
  return db[userId];
}

function addBalance(userId, amount) {
  const db = getDatabase();
  const userData = getUserData(userId);
  userData.balance = Math.max(0, userData.balance + amount);
  db[userId] = userData;
  saveDatabase(db);
  return userData.balance;
}

function checkCooldown(userId, commandName, cooldownMs) {
  const db = getDatabase();
  const userData = getUserData(userId);
  const lastUsed = userData.cooldowns[commandName] || 0;
  const now = Date.now();

  if (now - lastUsed < cooldownMs) {
    return cooldownMs - (now - lastUsed);
  }

  userData.cooldowns[commandName] = now;
  db[userId] = userData;
  saveDatabase(db);
  return 0;
}

function formatTime(ms) {
  const totalSeconds = Math.ceil(ms / 1000);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  if (hours > 0) return `${hours}h ${minutes}m`;
  if (minutes > 0) return `${minutes}m ${seconds}s`;
  return `${seconds}s`;
}

function parseTimeString(timeStr) {
  const regex = /^(\d+)\s*([s|m|h])$/i;
  const match = timeStr.trim().match(regex);

  if (!match) return null;

  const value = parseInt(match[1], 10);
  const unit = match[2].toLowerCase();

  switch (unit) {
    case 's': return value * 1000;
    case 'm': return value * 60 * 1000;
    case 'h': return value * 60 * 60 * 1000;
    default: return null;
  }
}

client.once(Events.ClientReady, (c) => {
  console.log(`GrandmaCrackers is online! Logged in as ${c.user.tag}`);
});

client.on(Events.InteractionCreate, async (interaction) => {
  if (!interaction.isChatInputCommand()) return;

  const { commandName, user } = interaction;

  try {
    if (commandName === 'help') {
      await interaction.reply(
        `**GrandmaCrackers - Full Bakery & Life Guide**\n\n` +
        `Welcome to Grandma's kitchen! Here is everything you can do:\n\n` +
        `**Daily & Earning**\n` +
        `• \`/daily\` - Collect your daily allowance of freshly baked crackers (Every 1 hour).\n` +
        `• \`/work\` - Help Grandma with chores around the house (Every 1 hour).\n` +
        `• \`/beg\` - Ask Grandma nicely for a spare cracker (Every 1 hour).\n` +
        `• \`/sneak\` - Attempt to quietly steal treats from the pantry (Every 2 hours)!\n\n` +
        `**Games & Utilities**\n` +
        `• \`/coinflip [bet] [choice]\` - Bet your crackers on a heads-or-tails coin toss.\n` +
        `• \`/pay [user] [amount]\` - Gift crackers to a friend in the server.\n` +
        `• \`/roll [max]\` - Roll a random number between 1 and max (Default: 100).\n` +
        `• \`/remind [task] [time]\` - Set a reminder timer (e.g. 10s, 5m, 1h).\n` +
        `• \`/ask [question]\` - Ask Grandma anything using OpenAI!\n\n` +
        `**Account & Pantry**\n` +
        `• \`/balance\` - View your current cracker balance.\n` +
        `• \`/help\` - Display this guide anytime!`
      );
    } 

    else if (commandName === 'daily') {
      const cooldownMs = 1 * 60 * 60 * 1000;
      const remaining = checkCooldown(user.id, 'daily', cooldownMs);

      if (remaining > 0) {
        return await interaction.reply({
          content: `You've already collected your daily treats, sweetie! Come back in **${formatTime(remaining)}**.`,
          ephemeral: true,
        });
      }

      const earned = Math.floor(Math.random() * 51) + 50; 
      const newTotal = addBalance(user.id, earned);

      await interaction.reply(
        `**Grandma baked for you!**\n` +
        `You collected **${earned} Crackers**!\n` +
        `You now have **${newTotal} Crackers** in your pantry!`
      );
    } 

    else if (commandName === 'balance') {
      const userData = getUserData(user.id);
      await interaction.reply(
        `**Grandma's Pantry:**\n` +
        `<@${user.id}> currently has **${userData.balance} Crackers** stored safely in their jar!`
      );
    }

    else if (commandName === 'work') {
      const cooldownMs = 1 * 60 * 60 * 1000;
      const remaining = checkCooldown(user.id, 'work', cooldownMs);

      if (remaining > 0) {
        return await interaction.reply({
          content: `There are no chores to do right now, dear. Check back in **${formatTime(remaining)}**!`,
          ephemeral: true,
        });
      }

      const jobs = [
        'swept the kitchen floor',
        'organized Grandma\'s spice rack',
        'dusted the rocking chairs',
        'helped carry the flour bags',
      ];
      const job = jobs[Math.floor(Math.random() * jobs.length)];
      const earned = Math.floor(Math.random() * 30) + 20;
      const newTotal = addBalance(user.id, earned);

      await interaction.reply(
        `You ${job} and Grandma rewarded you with **${earned} Crackers**!\n` +
        `Total Balance: **${newTotal} Crackers**`
      );
    }

    else if (commandName === 'beg') {
      const cooldownMs = 1 * 60 * 60 * 1000;
      const remaining = checkCooldown(user.id, 'beg', cooldownMs);

      if (remaining > 0) {
        return await interaction.reply({
          content: `I just gave you a treat! Ask me again in **${formatTime(remaining)}**.`,
          ephemeral: true,
        });
      }

      const success = Math.random() > 0.3;
      if (success) {
        const amount = Math.floor(Math.random() * 15) + 5;
        const newTotal = addBalance(user.id, amount);
        await interaction.reply(
          `Aww, look at those puppy eyes! Here you go sweetie.\n` +
          `Grandma handed you **${amount} Crackers**!\n` +
          `Total Balance: **${newTotal} Crackers**`
        );
      } else {
        await interaction.reply(
          `Dinner is almost ready, dear! No spoiling your appetite now.`
        );
      }
    }

    else if (commandName === 'coinflip') {
      const bet = interaction.options.getInteger('bet');
      const choice = interaction.options.getString('choice');
      const userData = getUserData(user.id);

      if (bet > userData.balance) {
        return await interaction.reply({
          content: `You don't have enough crackers for that bet, sweetie! You only have ${userData.balance} Crackers.`,
          ephemeral: true,
        });
      }

      const flip = Math.random() < 0.5 ? 'heads' : 'tails';

      if (choice === flip) {
        const newTotal = addBalance(user.id, bet);
        await interaction.reply(
          `The coin landed on **${flip.toUpperCase()}**!\n` +
          `Good guess, dear! You won **${bet} Crackers**!\n` +
          `Total Balance: **${newTotal} Crackers**`
        );
      } else {
        const newTotal = addBalance(user.id, -bet);
        await interaction.reply(
          `The coin landed on **${flip.toUpperCase()}**!\n` +
          `Better luck next time, sweetie! You lost **${bet} Crackers**.\n` +
          `Total Balance: **${newTotal} Crackers**`
        );
      }
    }

    else if (commandName === 'pay') {
      const targetUser = interaction.options.getUser('user');
      const amount = interaction.options.getInteger('amount');
      const userData = getUserData(user.id);

      if (targetUser.id === user.id) {
        return await interaction.reply({
          content: `You can't give crackers to yourself, dear!`,
          ephemeral: true,
        });
      }

      if (amount > userData.balance) {
        return await interaction.reply({
          content: `You don't have enough crackers to give away! You only have ${userData.balance} Crackers.`,
          ephemeral: true,
        });
      }

      const senderNewTotal = addBalance(user.id, -amount);
      const receiverNewTotal = addBalance(targetUser.id, amount);

      await interaction.reply(
        `You shared **${amount} Crackers** with ${targetUser}!\n` +
        `Your new balance: **${senderNewTotal} Crackers**`
      );
    }

    else if (commandName === 'sneak') {
      const cooldownMs = 2 * 60 * 60 * 1000;
      const remaining = checkCooldown(user.id, 'sneak', cooldownMs);

      if (remaining > 0) {
        return await interaction.reply({
          content: `Grandma is watching the kitchen closely! Try sneaking again in **${formatTime(remaining)}**.`,
          ephemeral: true,
        });
      }

      const caught = Math.random() < 0.4;
      if (caught) {
        const userData = getUserData(user.id);
        const penalty = Math.min(userData.balance, Math.floor(Math.random() * 15) + 5);
        const newTotal = addBalance(user.id, -penalty);

        await interaction.reply(
          `**CAUGHT!** Grandma heard the cookie jar lid clatter!\n` +
          `Hey! Keep your hands out of the pantry until dinner!\n` +
          `Grandma took away **${penalty} Crackers** as punishment!\n` +
          `Total Balance: **${newTotal} Crackers**`
        );
      } else {
        const reward = Math.floor(Math.random() * 40) + 20;
        const newTotal = addBalance(user.id, reward);

        await interaction.reply(
          `You quietly slipped past Grandma and sneaked **${reward} Crackers** from the jar!\n` +
          `Total Balance: **${newTotal} Crackers**`
        );
      }
    }

    else if (commandName === 'roll') {
      const max = interaction.options.getInteger('max') || 100;
      const result = Math.floor(Math.random() * max) + 1;
      await interaction.reply(`<@${user.id}> rolled a **${result}** (1-${max})!`);
    }

    else if (commandName === 'remind') {
      const task = interaction.options.getString('task');
      const timeInput = interaction.options.getString('time');
      const durationMs = parseTimeString(timeInput);

      if (!durationMs) {
        return await interaction.reply({
          content: `I couldn't understand that time format, dear! Please use a number followed by **s** (seconds), **m** (minutes), or **h** (hours) — e.g. \`10s\`, \`5m\`, or \`1h\`.`,
          ephemeral: true,
        });
      }

      await interaction.reply(
        `Got it, sweetie! Grandma set a timer for **${timeInput}**. I'll remind you to **${task}** when it rings!`
      );

      setTimeout(async () => {
        try {
          await interaction.followUp({
            content: `**REMINDER FOR <@${user.id}>!**\nGrandma is calling! You asked me to remind you to: **${task}**!`,
          });
        } catch (err) {
          console.error('Failed to send reminder follow-up:', err);
        }
      }, durationMs);
    }

    // --- NEW: /ask using OpenAI ---
    else if (commandName === 'ask') {
      if (!openai) {
        return await interaction.reply({
          content: `Oh dear, my OPENAI_API_KEY seems to be missing from the .env file!`,
          ephemeral: true,
        });
      }

      const question = interaction.options.getString('question');
      await interaction.deferReply();

      try {
        const response = await openai.chat.completions.create({
          model: 'gpt-4o-mini',
          messages: [
            {
              role: 'system',
              content: 'You are a sweet, traditional, loving Grandma running a Discord server. Answer the grandchild warmly using cozy tone where appropriate. Do not use emojis in your response. Keep responses under 1500 characters.',
            },
            {
              role: 'user',
              content: question,
            },
          ],
        });

        const answer = response.choices[0]?.message?.content || "Grandma tilted her head, adjusted her glasses, but couldn't quite hear you, dear!";
        
        await interaction.editReply(`**Grandma says:**\n${answer}`);
      } catch (err) {
        console.error('OpenAI API Error:', err);
        await interaction.editReply(`Oh my, my glasses got foggy! Give Grandma a moment and ask me again in a bit.`);
      }
    }
  } catch (error) {
    console.error(`Error executing command ${commandName}:`, error);
    if (!interaction.replied && !interaction.deferred) {
      await interaction.reply({ content: 'There was an error executing that command!', ephemeral: true });
    }
  }
});

client.login(process.env.DISCORD_TOKEN);