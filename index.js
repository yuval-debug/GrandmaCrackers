import { Client, GatewayIntentBits, Events } from 'discord.js';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';

dotenv.config();

const client = new Client({
  intents: [GatewayIntentBits.Guilds],
});

const DB_PATH = path.resolve('./db.json');

// Helper function to read database
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

// Helper function to save database
function saveDatabase(data) {
  try {
    fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2), 'utf8');
  } catch (error) {
    console.error('Error writing to db.json:', error);
  }
}

// Get user profile
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

// Update balance
function addBalance(userId, amount) {
  const db = getDatabase();
  const userData = getUserData(userId);
  userData.balance = Math.max(0, userData.balance + amount);
  db[userId] = userData;
  saveDatabase(db);
  return userData.balance;
}

// Check and set cooldowns
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

// Format time remaining
function formatTime(ms) {
  const totalSeconds = Math.ceil(ms / 1000);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  if (hours > 0) return `${hours}h ${minutes}m`;
  if (minutes > 0) return `${minutes}m ${seconds}s`;
  return `${seconds}s`;
}

client.once(Events.ClientReady, (c) => {
  console.log(`👵 GrandmaCrackers is online! Logged in as ${c.user.tag}`);
});

client.on(Events.InteractionCreate, async (interaction) => {
  if (!interaction.isChatInputCommand()) return;

  const { commandName, user } = interaction;

  try {
    // --- /help ---
    if (commandName === 'help') {
      await interaction.reply(
        `👵 **GrandmaCrackers - Full Bakery & Life Guide**\n\n` +
        `Welcome to Grandma's kitchen! Here is everything you can do to earn, risk, and manage your crackers:\n\n` +
        `**🍪 Daily & Earning**\n` +
        `• \`/daily\` - Collect your daily allowance of freshly baked crackers (Every 1 hour).\n` +
        `• \`/work\` - Help Grandma with chores around the house to earn extra treats (Every 1 hour).\n` +
        `• \`/beg\` - Ask Grandma nicely for a spare cracker (Every 1 hour).\n` +
        `• \`/sneak\` - Attempt to quietly steal treats from the pantry jar (Every 2 hours)!\n\n` +
        `**🪙 Gambling & Sharing**\n` +
        `• \`/coinflip [bet] [choice]\` - Bet your crackers on a heads-or-tails coin toss with Grandma.\n` +
        `• \`/pay [user] [amount]\` - Gift some of your crackers to a friend in the server.\n\n` +
        `**🏺 Account & Pantry**\n` +
        `• \`/balance\` - View your current cracker balance stored safely in your jar.\n` +
        `• \`/help\` - Display this guide anytime!`
      );
    } 

    // --- /daily (1 Hour Cooldown) ---
    else if (commandName === 'daily') {
      const cooldownMs = 1 * 60 * 60 * 1000; // 1 Hour
      const remaining = checkCooldown(user.id, 'daily', cooldownMs);

      if (remaining > 0) {
        return await interaction.reply({
          content: `👵 *"You've already collected your daily treats, sweetie! Come back in **${formatTime(remaining)}**."*`,
          ephemeral: true,
        });
      }

      const earned = Math.floor(Math.random() * 51) + 50; 
      const newTotal = addBalance(user.id, earned);

      await interaction.reply(
        `👵 **Grandma baked for you!**\n` +
        `You collected **${earned} Crackers**! 🍪\n` +
        `*You now have **${newTotal} Crackers** in your pantry!*`
      );
    } 

    // --- /balance ---
    else if (commandName === 'balance') {
      const userData = getUserData(user.id);
      await interaction.reply(
        `👵 **Grandma's Pantry:**\n` +
        `<@${user.id}> currently has **${userData.balance} Crackers** stored safely in their jar! 🍪`
      );
    }

    // --- /work (1 Hour Cooldown) ---
    else if (commandName === 'work') {
      const cooldownMs = 1 * 60 * 60 * 1000; // 1 Hour
      const remaining = checkCooldown(user.id, 'work', cooldownMs);

      if (remaining > 0) {
        return await interaction.reply({
          content: `👵 *"There are no chores to do right now, dear. Check back in **${formatTime(remaining)}**!"*`,
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
        `🧹 You ${job} and Grandma rewarded you with **${earned} Crackers**! 🍪\n` +
        `*Total Balance: **${newTotal} Crackers***`
      );
    }

    // --- /beg (1 Hour Cooldown) ---
    else if (commandName === 'beg') {
      const cooldownMs = 1 * 60 * 60 * 1000; // 1 Hour
      const remaining = checkCooldown(user.id, 'beg', cooldownMs);

      if (remaining > 0) {
        return await interaction.reply({
          content: `👵 *"I just gave you a treat! Ask me again in **${formatTime(remaining)}**."*`,
          ephemeral: true,
        });
      }

      const success = Math.random() > 0.3;
      if (success) {
        const amount = Math.floor(Math.random() * 15) + 5;
        const newTotal = addBalance(user.id, amount);
        await interaction.reply(
          `👵 *"Aww, look at those puppy eyes! Here you go sweetie."*\n` +
          `Grandma handed you **${amount} Crackers**! 🍪\n` +
          `*Total Balance: **${newTotal} Crackers***`
        );
      } else {
        await interaction.reply(
          `👵 *"Dinner is almost ready, dear! No spoiling your appetite now."*`
        );
      }
    }

    // --- /coinflip ---
    else if (commandName === 'coinflip') {
      const bet = interaction.options.getInteger('bet');
      const choice = interaction.options.getString('choice');
      const userData = getUserData(user.id);

      if (bet > userData.balance) {
        return await interaction.reply({
          content: `👵 *"You don't have enough crackers for that bet, sweetie! You only have ${userData.balance} Crackers."*`,
          ephemeral: true,
        });
      }

      const flip = Math.random() < 0.5 ? 'heads' : 'tails';

      if (choice === flip) {
        const newTotal = addBalance(user.id, bet);
        await interaction.reply(
          `🪙 The coin landed on **${flip.toUpperCase()}**!\n` +
          `👵 *"Good guess, dear!"* You won **${bet} Crackers**! 🍪\n` +
          `*Total Balance: **${newTotal} Crackers***`
        );
      } else {
        const newTotal = addBalance(user.id, -bet);
        await interaction.reply(
          `🪙 The coin landed on **${flip.toUpperCase()}**!\n` +
          `👵 *"Better luck next time, sweetie!"* You lost **${bet} Crackers**.\n` +
          `*Total Balance: **${newTotal} Crackers***`
        );
      }
    }

    // --- /pay ---
    else if (commandName === 'pay') {
      const targetUser = interaction.options.getUser('user');
      const amount = interaction.options.getInteger('amount');
      const userData = getUserData(user.id);

      if (targetUser.id === user.id) {
        return await interaction.reply({
          content: `👵 *"You can't give crackers to yourself, dear!"*`,
          ephemeral: true,
        });
      }

      if (amount > userData.balance) {
        return await interaction.reply({
          content: `👵 *"You don't have enough crackers to give away! You only have ${userData.balance} Crackers."*`,
          ephemeral: true,
        });
      }

      const senderNewTotal = addBalance(user.id, -amount);
      const receiverNewTotal = addBalance(targetUser.id, amount);

      await interaction.reply(
        `🎁 You shared **${amount} Crackers** with ${targetUser}! 🍪\n` +
        `*Your new balance: **${senderNewTotal} Crackers***`
      );
    }

    // --- /sneak (2 Hour Cooldown) ---
    else if (commandName === 'sneak') {
      const cooldownMs = 2 * 60 * 60 * 1000; // 2 Hours
      const remaining = checkCooldown(user.id, 'sneak', cooldownMs);

      if (remaining > 0) {
        return await interaction.reply({
          content: `👵 *"Grandma is watching the kitchen closely! Try sneaking again in **${formatTime(remaining)}**."*`,
          ephemeral: true,
        });
      }

      const caught = Math.random() < 0.4;
      if (caught) {
        const userData = getUserData(user.id);
        const penalty = Math.min(userData.balance, Math.floor(Math.random() * 15) + 5);
        const newTotal = addBalance(user.id, -penalty);

        await interaction.reply(
          `🚨 **CAUGHT!** Grandma heard the cookie jar lid clatter!\n` +
          `👵 *"Hey! Keep your hands out of the pantry until dinner!"*\n` +
          `Grandma took away **${penalty} Crackers** as punishment! 🍪\n` +
          `*Total Balance: **${newTotal} Crackers***`
        );
      } else {
        const reward = Math.floor(Math.random() * 40) + 20;
        const newTotal = addBalance(user.id, reward);

        await interaction.reply(
          `🤫 You quietly slipped past Grandma and sneaked **${reward} Crackers** from the jar! 🍪\n` +
          `*Total Balance: **${newTotal} Crackers***`
        );
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