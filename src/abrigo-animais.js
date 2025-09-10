class AbrigoAnimais {
  constructor() {
    this.animais = {
      'Rex': { tipo: 'cão', brinquedos: ['RATO', 'BOLA'] },
      'Mimi': { tipo: 'gato', brinquedos: ['BOLA', 'LASER'] },
      'Fofo': { tipo: 'gato', brinquedos: ['BOLA', 'RATO', 'LASER'] },
      'Zero': { tipo: 'gato', brinquedos: ['RATO', 'BOLA'] },
      'Bola': { tipo: 'cão', brinquedos: ['CAIXA', 'NOVELO'] },
      'Bebe': { tipo: 'cão', brinquedos: ['LASER', 'RATO', 'BOLA'] },
      'Loco': { tipo: 'jabuti', brinquedos: ['SKATE', 'RATO'] }
    };
    this.brinquedosValidos = ['RATO', 'BOLA', 'LASER', 'CAIXA', 'NOVELO', 'SKATE'];
  }

  encontraPessoas(brinquedosPessoa1Str, brinquedosPessoa2Str, animaisStr) {
    try {
      const brinquedosP1 = this.parseBrinquedos(brinquedosPessoa1Str);
      const brinquedosP2 = this.parseBrinquedos(brinquedosPessoa2Str);
      const animaisDesejados = this.parseAnimais(animaisStr);

      this.validarEntradas(brinquedosP1, brinquedosP2, animaisDesejados);

      return this.processarAdocoes(brinquedosP1, brinquedosP2, animaisDesejados);
    } catch (erro) {
      return { erro };
    }
  }

  parseBrinquedos(brinquedosStr) {
    return brinquedosStr.split(',').map(b => b.trim());
  }

  parseAnimais(animaisStr) {
    return animaisStr.split(',').map(a => a.trim());
  }

  validarEntradas(brinquedosP1, brinquedosP2, animais) {
    this.validarAnimais(animais);
    this.validarListaBrinquedos(brinquedosP1);
    this.validarListaBrinquedos(brinquedosP2);
  }

  validarAnimais(animais) {
    if (animais.length === 0) throw 'Animal inválido';
    
    const animaisUnicos = new Set(animais);
    if (animaisUnicos.size !== animais.length) throw 'Animal inválido';
    
    const nomesValidos = Object.keys(this.animais);
    for (const animal of animais) {
      if (!nomesValidos.includes(animal)) throw 'Animal inválido';
    }
  }

  validarListaBrinquedos(brinquedos) {
    if (brinquedos.length === 0) throw 'Brinquedo inválido';
    
    const brinquedosUnicos = new Set(brinquedos);
    if (brinquedosUnicos.size !== brinquedos.length) throw 'Brinquedo inválido';
    
    for (const brinquedo of brinquedos) {
      if (!this.brinquedosValidos.includes(brinquedo)) throw 'Brinquedo inválido';
    }
  }

  processarAdocoes(brinquedosP1, brinquedosP2, animaisDesejados) {
    const resultados = [];
    const adocaoCounts = [0, 0]; // [pessoa1, pessoa2]

    for (const nomeAnimal of animaisDesejados) {
      const animalInfo = this.animais[nomeAnimal];
      
      const [pessoa1Apta, pessoa2Apta] = this.verificarAptidoes(
        animalInfo, brinquedosP1, brinquedosP2, adocaoCounts
      );

      const [aptaPosRegras1, aptaPosRegras2] = this.aplicarRegrasEspeciais(
        nomeAnimal, animalInfo, pessoa1Apta, pessoa2Apta, adocaoCounts
      );

      this.registrarResultado(
        nomeAnimal, aptaPosRegras1, aptaPosRegras2, resultados, adocaoCounts
      );
    }

    resultados.sort();
    return { lista: resultados };
  }

  verificarAptidoes(animalInfo, brinquedosP1, brinquedosP2, adocaoCounts) {
    const pessoa1Apta = adocaoCounts[0] < 3 && this.verificarAdoção(animalInfo, brinquedosP1);
    const pessoa2Apta = adocaoCounts[1] < 3 && this.verificarAdoção(animalInfo, brinquedosP2);
    
    return [pessoa1Apta, pessoa2Apta];
  }

  aplicarRegrasEspeciais(nomeAnimal, animalInfo, pessoa1Apta, pessoa2Apta, adocaoCounts) {
    let [apta1, apta2] = [pessoa1Apta, pessoa2Apta];

    // Regra de gatos
    if (animalInfo.tipo === 'gato' && apta1 && apta2) {
      if (this.compartilhamBrinquedosDeGato(animalInfo, brinquedosP1, brinquedosP2)) {
        [apta1, apta2] = [false, false];
      }
    }

    // Regra do Loco
    if (nomeAnimal === 'Loco') {
      apta1 = apta1 && adocaoCounts[1] > 0;
      apta2 = apta2 && adocaoCounts[0] > 0;
      if (!apta1 && !apta2) [apta1, apta2] = [false, false];
    }

    return [apta1, apta2];
  }

  registrarResultado(nomeAnimal, apta1, apta2, resultados, adocaoCounts) {
    if (apta1 && apta2) {
      resultados.push(`${nomeAnimal} - abrigo`);
    } else if (apta1) {
      resultados.push(`${nomeAnimal} - pessoa 1`);
      adocaoCounts[0]++;
    } else if (apta2) {
      resultados.push(`${nomeAnimal} - pessoa 2`);
      adocaoCounts[1]++;
    } else {
      resultados.push(`${nomeAnimal} - abrigo`);
    }
  }

  verificarAdoção(animalInfo, brinquedosPessoa) {
    let index = 0;
    for (const brinquedo of brinquedosPessoa) {
      if (index < animalInfo.brinquedos.length && brinquedo === animalInfo.brinquedos[index]) {
        index++;
      }
    }
    return index === animalInfo.brinquedos.length;
  }

  compartilhamBrinquedosDeGato(animalInfo, brinquedosP1, brinquedosP2) {
    const setP1 = new Set(brinquedosP1);
    const setP2 = new Set(brinquedosP2);
    
    return animalInfo.brinquedos.some(brinquedo => 
      setP1.has(brinquedo) && setP2.has(brinquedo)
    );
  }
}

export { AbrigoAnimais };