# GrandmaCrackers Discord Bot

> A warm, interactive Discord bot featuring an economy game centered around doing chores, playing games, baking, and saving crackers!


Use this link to add the bot to your own server on Discord:


https://discord.com/oauth2/authorize?client_id=1562595111077154936&permissions=2147551232&integration_type=0&scope=bot+applications.commands


---

## Commands
  ### Economy Game  
  - `/daily`: Collect your daily batch of freshly baked crackers (50–100 crackers).
  - `/work`: Do small household chores for Grandma to earn extra crackers (20–50 crackers).
  - `/beg`: Politely ask Grandma for a spare treat.
  - `/sneak`: Try to quietly steal a treat from Grandma's secret pantry jar without getting caught.
  - `/coinflip [bet] [heads/tails]`: Risk your hard-earned crackers on a heads-or-tails coin toss with Grandma.
  - `/pay [user] [amount]`: Transfer crackers to share with another server member.
  - `/balance`: View your current cracker pantry balance.

  ### Utilities
  - `/roll [max]`: Roll a random number between 1 and a chosen maximum value (default is 100).
  - `/remind [task] [time]`: Set a timed reminder for Grandma to alert you about a task (e.g., 10s, 5m, 1h).
  - `/ask [question]`: Ask Grandma a question using OpenAI.
  
  ### Guidance  
  - `/help`: Interactive menu explaining all available bot commands and rules.

---

## Tech Stack

- Runtime : [Node.js](https://nodejs.org/) (v18+)
- Library : [`discord.js`](https://discord.js.org/) (v14)
- Environment Management : [`dotenv`](https://www.npmjs.com/package/dotenv)

---

## Getting Started

### 1. Prerequisites

Make sure you have installed:
- [Node.js](https://nodejs.org/) (v18 or higher)
- [Git](https://git-scm.com/)

### 2. Installation

Clone the repository and install project dependencies:

```bash
git clone [https://github.com/yuval-debug/GrandmaCrackers.git](https://github.com/yuval-debug/GrandmaCrackers.git)
cd GrandmaCrackers
npm install