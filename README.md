# Quizard

Learn the Arcane Arts through our rigorious Gauntlet of questions.  
Choose carefully... They may your doom.

## Elders (Admins)
GrandMaster Wizards can seek passage at localhost:3000/elder  
The secret words are `elder@quizard.com` and `quizard`  
**Note** Refence the spells at the bottom, specifically `npm run toil` spell.

## Apprenctices (Users)
Newcomers may only enter through the main gates at localhost:3000.

## The Ritual (App)
#### Words of Caution
Configuration for Mysql are in `src/config/config.json`.  
Node `0.12.7` or later is preferred.

#### Ingredients
We require a few sacred ingredients in order to manifest our Academy:
* Node
* Mysql

#### Preparations
Once you obtain the sacred ingredients, you must cast a few spells.  
First, you must replicate a magic chest from my magic chest.
```shell
git clone git@github.com/seanstrom/quizard.git
```
Second, open the magic chest.
```shell
cd quizard/
```
Third, awaken the magic inside the chest.
```shell
npm install
```

#### The Summoning
Once the preparations are finished, you can begin the Summoning.
```shell
npm start
```

#### Additional Spells
Conjuring the Gauntlet with default questions and more. (Seed/Reseed)
```shell
npm run toil
```
Cast the alternate Summoning spell. (Development Mode)
```shell
npm run dev
```
Create an Aura that will cast the Summoning with phantom Elders and Apprenctices. (Tests) WIP
```shell
npm test
```

### Caveats
#### No automated test coverage
I tried building this out test first with a BDD approach, but got caught up in managing DB state when performing feature tests. So I scrapped theme, but just until I can write proper tests.

#### Elder section Question creation
The Elder section doesn't enforce a question to have answers in order to be created. Which means you must be dilligent to add answers to questions. If you don't the app will still show the unanswerable questions at the moment.
