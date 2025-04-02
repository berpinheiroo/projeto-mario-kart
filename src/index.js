const player1 = {
  NOME: "Mario",
  VELOCIDADE: 4,
  MANOBRABILIDADE: 3,
  PODER: 3,
  PONTOS: 0,
  VITORIAS: 0,
  PODER_ESPECIAL: "Bola de Fogo",
  PODER_ESPECIAL_USADO: false
};

const player2 = {
  NOME: "Luigi",
  VELOCIDADE: 3,
  MANOBRABILIDADE: 4,
  PODER: 4,
  PONTOS: 0,
  VITORIAS: 0,
  PODER_ESPECIAL: "Raio Verde",
  PODER_ESPECIAL_USADO: false
};

async function rollDice() {
  return Math.floor(Math.random() * 6) + 1;
}

async function getRandomBlock() {
  let random = Math.random();
  let result;

  switch (true) {
    case random < 0.33:
      result = "RETA";
      break;
    case random < 0.66:
      result = "CURVA";
      break;
    default:
      result = "CONFRONTO";
  }
  return result;
}

async function getRandomItem() {
  const items = ["Cogumelo", "Casca de Banana", "Estrela", "Casco Verde"];
  return items[Math.floor(Math.random() * items.length)];
}

async function useItem(item, character) {
  switch (item) {
    case "Cogumelo":
      character.VELOCIDADE += 2;
      console.log(`🍄 ${character.NOME} usou Cogumelo! Velocidade aumentada!`);
      break;
    case "Estrela":
      character.PODER += 3;
      console.log(`⭐ ${character.NOME} usou Estrela! Poder aumentado!`);
      break;
    case "Casca de Banana":
      console.log(`🍌 ${character.NOME} deixou uma casca de banana na pista!`);
      return Math.random() < 0.5; // 50% de chance do oponente escorregar
    case "Casco Verde":
      console.log(`🐢 ${character.NOME} lançou um Casco Verde!`);
      return Math.random() < 0.7; // 70% de chance de acertar
  }
  return false;
}

async function usePowerSpecial(character) {
  if (!character.PODER_ESPECIAL_USADO) {
    console.log(`✨ ${character.NOME} usou seu poder especial: ${character.PODER_ESPECIAL}!`);
    character.PODER += 5;
    character.PODER_ESPECIAL_USADO = true;
    return true;
  }
  return false;
}

async function logRollResult(characterName, block, diceResult, attribute) {
  console.log(
    `${characterName} 🎲 rolou um dado de ${block} ${diceResult} + ${attribute} = ${
      diceResult + attribute
    }`
  );
}

async function playRaceEngine(character1, character2) {
  for (let round = 1; round <= 5; round++) {
    console.log(`🏁 Rodada ${round}`);

    // Chance de conseguir item
    if (Math.random() < 0.3) {
      const item = await getRandomItem();
      console.log(`📦 ${character1.NOME} pegou um item: ${item}`);
      await useItem(item, character1);
    }

    if (Math.random() < 0.3) {
      const item = await getRandomItem();
      console.log(`📦 ${character2.NOME} pegou um item: ${item}`);
      await useItem(item, character2);
    }

    // Chance de usar poder especial
    if (round > 3 && Math.random() < 0.5) {
      await usePowerSpecial(character1);
      await usePowerSpecial(character2);
    }

    let block = await getRandomBlock();
    console.log(`Bloco: ${block}`);

    let diceResult1 = await rollDice();
    let diceResult2 = await rollDice();

    let totalTestSkill1 = 0;
    let totalTestSkill2 = 0;

    if (block === "RETA") {
      totalTestSkill1 = diceResult1 + character1.VELOCIDADE;
      totalTestSkill2 = diceResult2 + character2.VELOCIDADE;

      await logRollResult(
        character1.NOME,
        "velocidade",
        diceResult1,
        character1.VELOCIDADE
      );
      await logRollResult(
        character2.NOME,
        "velocidade",
        diceResult1,
        character2.VELOCIDADE
      );
    }
    if (block === "CURVA") {
      totalTestSkill1 = diceResult1 + character1.MANOBRABILIDADE;
      totalTestSkill2 = diceResult2 + character2.MANOBRABILIDADE;

      await logRollResult(
        character1.NOME,
        "manobrabilidade",
        diceResult1,
        character1.MANOBRABILIDADE
      );
      await logRollResult(
        character2.NOME,
        "manobrabilidade",
        diceResult1,
        character2.MANOBRABILIDADE
      );
    }
    if (block === "CONFRONTO") {
      let powerResult1 = diceResult1 + character1.PODER;
      let powerResult2 = diceResult2 + character2.PODER;

      console.log(`${character1.NOME} confrontou com ${character2.NOME}! 🥊`);

      await logRollResult(
        character1.NOME,
        "poder",
        diceResult1,
        character1.PODER
      );

      await logRollResult(
        character2.NOME,
        "poder",
        diceResult2,
        character2.PODER
      );

      if (powerResult1 > powerResult2 && character2.PONTOS > 0) {
        console.log(`${character1.NOME} venceu o confronto! ${character2.NOME} perdeu 1 ponto! 🐢`);
        character2.PONTOS--;
      }
      
      if (powerResult2 > powerResult1 && character1.PONTOS > 0) {
        console.log(`${character2.NOME} venceu o confronto! ${character1.NOME} perdeu 1 ponto! 🐢`);
        character1.PONTOS--;
      }
      
      console.log(powerResult1 === powerResult2 ? "Confronto empatado! Nenhum ponto foi perdido." : "");
    }

    if (totalTestSkill1 > totalTestSkill2) {
      console.log(`${character1.NOME} marcou um ponto!`);
      character1.PONTOS++;
    } else if (totalTestSkill2 > totalTestSkill1) {
      console.log(`${character2.NOME} marcou um ponto!`);
      character2.PONTOS++;
    }
    console.log("--------------------------------");
  }
}

async function declareWinner(character1, character2) {
  console.log("Resultado final:");
  console.log(`${character1.NOME}: ${character1.PONTOS} ponto(s)`);
  console.log(`${character2.NOME}: ${character2.PONTOS} ponto(s)`);

  if (character1.PONTOS > character2.PONTOS) {
    character1.VITORIAS++;
    console.log(`\n${character1.NOME} venceu a corrida! Parabéns! 🏆`);
  } else if (character2.PONTOS > character1.PONTOS) {
    character2.VITORIAS++;
    console.log(`\n${character2.NOME} venceu a corrida! Parabéns! 🏆`);
  } else {
    console.log(`\nA corrida terminou empatada! 🏁`);
  }

  console.log("\nPlacar Histórico:");
  console.log(`${character1.NOME}: ${character1.VITORIAS} vitória(s)`);
  console.log(`${character2.NOME}: ${character2.VITORIAS} vitória(s)`);

  character1.PODER_ESPECIAL_USADO = false;
  character2.PODER_ESPECIAL_USADO = false;
  character1.VELOCIDADE = 4;
  character2.VELOCIDADE = 3;
  character1.PODER = 3;
  character2.PODER = 4;
}

(async function main() {
  console.log(
    `🏁🚨 Corrida entre ${player1.NOME} e ${player2.NOME} começando... \n`
  );

  await playRaceEngine(player1, player2);
  await declareWinner(player1, player2);
})();
