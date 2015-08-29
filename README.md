# Quizard

Learn the Arcane Arts through our rigorious Gauntlet of riddles.  
Choose carefully... They may your doom.

## Elders (Admins)
GrandMaster Wizards can seek passage at quizard.com/elder  
The secret words are `elder@sumome.com` and `quizard`  
**Note**  
Refence the spells at the bottom, specifically `npm run toil` spell.

## Apprenctices (Users)
Newcomers may only enter through the main gates at quizard.com.

### The Ritual
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
Conjuring the Gauntlet with default riddles and more. (Seed/Reseed)
```shell
npm run toil
```
Cast the Summoning spell in "developmen mode"
```shell
npm run dev
```
Create an Aura that will cast the Summoning with phantom Elders and Apprenctices. (Tests) WIP
```shell
npm test
```

#### Words of Caution
Configuration for Mysql are in `src/config/config.json`  
Node 0.12.7 is preferred

##### Missing Functionality
Robust Test Suite
