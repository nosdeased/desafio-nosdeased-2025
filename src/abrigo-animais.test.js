import { AbrigoAnimais } from './abrigo-animais';

describe('Abrigo de Animais', () => {
  let abrigo;

  beforeEach(() => {
    abrigo = new AbrigoAnimais();
  });

  test('Deve rejeitar animal inválido', () => {
    const resultado = abrigo.encontraPessoas('RATO,BOLA', 'BOLA,LASER', 'AnimalInexistente');
    expect(resultado.erro).toBe('Animal inválido');
  });

  test('Deve encontrar pessoa para um animal', () => {
    const resultado = abrigo.encontraPessoas('RATO,BOLA', 'BOLA,LASER', 'Rex');
    expect(resultado.lista).toEqual(['Rex - pessoa 1']);
  });

  test('Deve encontrar pessoa para um animal intercalando brinquedos', () => {
    const resultado = abrigo.encontraPessoas('RATO,CAIXA,BOLA', 'BOLA,LASER', 'Rex');
    expect(resultado.lista).toEqual(['Rex - pessoa 1']);
  });

  test('Deve lidar com regra do Loco quando nenhuma pessoa é apta', () => {
    const resultado = abrigo.encontraPessoas('SKATE', 'RATO', 'Loco');
    expect(resultado.lista).toEqual(['Loco - abrigo']);
  });

  test('Deve lidar com lista de animais vazia', () => {
    const resultado = abrigo.encontraPessoas('RATO,BOLA', 'BOLA,LASER', '');
    expect(resultado.erro).toBe('Animal inválido');
  });

  test('Deve lidar com lista de brinquedos vazia para uma pessoa', () => {
    const resultado = abrigo.encontraPessoas('', 'BOLA,LASER', 'Rex');
    expect(resultado.erro).toBe('Brinquedo inválido');
    
    const resultado2 = abrigo.encontraPessoas('RATO,BOLA', '', 'Rex');
    expect(resultado2.erro).toBe('Brinquedo inválido');
  });

  test('Deve lidar com brinquedos duplicados', () => {
    const resultado = abrigo.encontraPessoas('RATO,RATO', 'BOLA,LASER', 'Rex');
    expect(resultado.erro).toBe('Brinquedo inválido');
  });

  test('Deve lidar com brinquedos inválidos', () => {
    const resultado = abrigo.encontraPessoas('INVALIDO', 'BOLA,LASER', 'Rex');
    expect(resultado.erro).toBe('Brinquedo inválido');
  });

  test('Deve aplicar regra de gatos quando compartilham brinquedos', () => {
    const resultado = abrigo.encontraPessoas('BOLA,RATO', 'BOLA,CAIXA', 'Mimi');
    expect(resultado.lista).toEqual(['Mimi - abrigo']);
  });

  test('Deve não aplicar regra de gatos quando não compartilham brinquedos', () => {
    const resultado = abrigo.encontraPessoas('BOLA,LASER', 'RATO,CAIXA', 'Mimi');
    expect(resultado.lista).toEqual(['Mimi - pessoa 1']);
  });

  test('Deve verificar adoção com ordem correta de brinquedos', () => {
    const resultado1 = abrigo.encontraPessoas('RATO,BOLA', 'BOLA,RATO', 'Rex');
    expect(resultado1.lista).toEqual(['Rex - pessoa 1']);
    
    const resultado2 = abrigo.encontraPessoas('BOLA,RATO', 'RATO,BOLA', 'Rex');
    expect(resultado2.lista).toEqual(['Rex - pessoa 2']);
  });

  test('Deve verificar adoção com ordem incorreta de brinquedos', () => {
    const resultado = abrigo.encontraPessoas('BOLA,RATO', 'LASER,CAIXA', 'Rex');
    expect(resultado.lista).toEqual(['Rex - abrigo']);
  });

  test('Deve lidar com caso onde ambas pessoas são aptas para animal não-gato', () => {
    const resultado = abrigo.encontraPessoas('RATO,BOLA', 'RATO,BOLA', 'Rex');
    expect(resultado.lista).toEqual(['Rex - abrigo']);
  });

  test('Deve lidar com regra do Loco quando pessoa é apta mas outra não adotou', () => {
    const resultado = abrigo.encontraPessoas('SKATE,RATO', 'RATO,BOLA', 'Loco');
    expect(resultado.lista).toEqual(['Loco - abrigo']);
  });

  test('Deve validar brinquedos com lista vazia', () => {
    const resultado = abrigo.encontraPessoas('', 'RATO,BOLA', 'Rex');
    expect(resultado.erro).toBe('Brinquedo inválido');
  });

  test('Deve validar brinquedos duplicados', () => {
    const resultado = abrigo.encontraPessoas('RATO,RATO', 'BOLA,LASER', 'Rex');
    expect(resultado.erro).toBe('Brinquedo inválido');
  });

  test('Deve validar brinquedos inválidos', () => {
    const resultado = abrigo.encontraPessoas('INVALIDO', 'BOLA,LASER', 'Rex');
    expect(resultado.erro).toBe('Brinquedo inválido');
  });

  test('Deve lidar com verificação de adoção que retorna false', () => {
    const resultado = abrigo.encontraPessoas('BOLA,RATO', 'LASER,CAIXA', 'Rex');
    expect(resultado.lista).toEqual(['Rex - abrigo']);
  });

  test('Deve limitar adoções a 3 animais por pessoa', () => {
    const resultado = abrigo.encontraPessoas(
      'RATO,BOLA,LASER,CAIXA,NOVELO,SKATE',
      'CAIXA,NOVELO', 
      'Rex,Mimi,Fofo,Zero'
    );
    
    expect(resultado.erro).toBeUndefined();
    expect(resultado.lista).toHaveLength(4);
    expect(resultado.lista.filter(item => item.includes('pessoa 1'))).toHaveLength(3);
    expect(resultado.lista.filter(item => item.includes('abrigo'))).toHaveLength(1);
  });

  test('Deve lidar com regra do Loco quando uma pessoa já adotou', () => {
    const resultado = abrigo.encontraPessoas('SKATE,RATO', 'RATO,BOLA', 'Rex,Loco');
    expect(resultado.lista).toEqual(['Loco - pessoa 1', 'Rex - pessoa 2']);
  });

  // Testes específicos para cobrir as linhas exatas não cobertas
  test('Deve cobrir linhas 48-51 - ambas pessoas aptas para gato sem compartilhamento', () => {
    const resultado = abrigo.encontraPessoas('RATO,BOLA', 'RATO,BOLA', 'Zero');
    expect(resultado.erro).toBeUndefined();
    expect(resultado.lista).toEqual(['Zero - abrigo']);
  });

  test('Deve cobrir linhas 90-91 - validação interna de lista vazia', () => {
    const resultado = abrigo.encontraPessoas('RATO,BOLA', '', 'Rex');
    expect(resultado.erro).toBe('Brinquedo inválido');
  });

  test('Deve cobrir linhas 96-97 - validação interna de duplicatas', () => {
    const resultado = abrigo.encontraPessoas('RATO,BOLA', 'LASER,LASER', 'Rex');
    expect(resultado.erro).toBe('Brinquedo inválido');
  });

  test('Deve cobrir linhas 110-111 - validação interna de brinquedos inválidos', () => {
    const resultado = abrigo.encontraPessoas('RATO,BOLA', 'INVALIDO1,INVALIDO2', 'Rex');
    expect(resultado.erro).toBe('Brinquedo inválido');
  });

  test('Deve cobrir caminho onde validarBrinquedos retorna true', () => {
    const resultado = abrigo.encontraPessoas('RATO,BOLA', 'LASER,CAIXA', 'Rex');
    expect(resultado.erro).toBeUndefined();
  });

  test('Deve cobrir caso de gato onde apenas uma pessoa é apta', () => {
    const resultado = abrigo.encontraPessoas('BOLA,LASER', 'RATO,CAIXA', 'Mimi');
    expect(resultado.lista).toEqual(['Mimi - pessoa 1']);
  });

  test('Deve cobrir caso onde nenhuma pessoa é apta', () => {
    const resultado = abrigo.encontraPessoas('BOLA,RATO', 'LASER,CAIXA', 'Rex');
    expect(resultado.lista).toEqual(['Rex - abrigo']);
  });

  test('Deve cobrir limite de adoções da pessoa 2', () => {
    const resultado = abrigo.encontraPessoas(
      'CAIXA,NOVELO',
      'RATO,BOLA,LASER,SKATE,NOVELO,CAIXA',
      'Rex,Mimi,Fofo,Zero'
    );
    
    expect(resultado.erro).toBeUndefined();
    expect(resultado.lista).toHaveLength(4);
    expect(resultado.lista.filter(item => item.includes('pessoa 2'))).toHaveLength(3);
    expect(resultado.lista.filter(item => item.includes('abrigo'))).toHaveLength(1);
  });

  test('Deve cobrir caso onde compartilhamBrinquedosDeGato retorna false', () => {
    const resultado = abrigo.encontraPessoas('BOLA,LASER', 'RATO,CAIXA', 'Mimi');
    expect(resultado.lista).toEqual(['Mimi - pessoa 1']);
  });

  test('Deve cobrir caso onde compartilhamBrinquedosDeGato retorna true mas apenas uma pessoa é apta', () => {
    const resultado = abrigo.encontraPessoas('BOLA,LASER', 'BOLA,CAIXA', 'Mimi');
    expect(resultado.lista).toEqual(['Mimi - pessoa 1']);
  });

  test('Deve cobrir caso especial do Loco quando nenhuma pessoa atende aos critérios', () => {
    const resultado = abrigo.encontraPessoas('SKATE', 'RATO', 'Loco');
    expect(resultado.lista).toEqual(['Loco - abrigo']);
  });

  test('Deve cobrir validação de brinquedos vazios para pessoa 1', () => {
    const resultado = abrigo.encontraPessoas('', 'RATO,BOLA', 'Rex');
    expect(resultado.erro).toBe('Brinquedo inválido');
  });

  test('Deve cobrir validação de brinquedos duplicados para pessoa 1', () => {
    const resultado = abrigo.encontraPessoas('RATO,RATO', 'BOLA,LASER', 'Rex');
    expect(resultado.erro).toBe('Brinquedo inválido');
  });

  test('Deve cobrir validação de brinquedos inválidos para pessoa 1', () => {
    const resultado = abrigo.encontraPessoas('INVALIDO1,INVALIDO2', 'BOLA,LASER', 'Rex');
    expect(resultado.erro).toBe('Brinquedo inválido');
  });

  test('Deve cobrir validação bem-sucedida para ambas as pessoas', () => {
    const resultado = abrigo.encontraPessoas('RATO,BOLA', 'LASER,CAIXA', 'Rex');
    expect(resultado.erro).toBeUndefined();
  });

  test('Deve cobrir validação onde apenas pessoa 2 tem brinquedos inválidos', () => {
    const resultado = abrigo.encontraPessoas('RATO,BOLA', 'INVALIDO', 'Rex');
    expect(resultado.erro).toBe('Brinquedo inválido');
  });

  test('Deve cobrir validação onde apenas pessoa 1 tem brinquedos inválidos', () => {
    const resultado = abrigo.encontraPessoas('INVALIDO', 'RATO,BOLA', 'Rex');
    expect(resultado.erro).toBe('Brinquedo inválido');
  });

  // Testes adicionais para cobrir linhas específicas
  test('Deve cobrir validação onde uma pessoa tem brinquedos válidos e outra inválidos', () => {
    const resultado = abrigo.encontraPessoas('RATO,BOLA', 'INVALIDO1,INVALIDO2', 'Rex');
    expect(resultado.erro).toBe('Brinquedo inválido');
  });

  test('Deve cobrir caso complexo com múltiplas regras especiais', () => {
    const resultado = abrigo.encontraPessoas(
      'RATO,BOLA,SKATE', 
      'RATO,BOLA,LASER', 
      'Mimi,Loco,Rex'
    );
    
    expect(resultado.erro).toBeUndefined();
    expect(resultado.lista).toHaveLength(3);
  });

  test('Deve cobrir caso onde Loco é o primeiro animal', () => {
    const resultado = abrigo.encontraPessoas('SKATE,RATO', 'RATO,BOLA', 'Loco,Rex');
    expect(resultado.erro).toBeUndefined();
    expect(resultado.lista).toHaveLength(2);
  });

  test('Deve cobrir caso onde pessoa atinge exatamente 3 adoções', () => {
    const resultado = abrigo.encontraPessoas(
      'RATO,BOLA,BOLA,LASER,BOLA,RATO,LASER,RATO,BOLA',
      'CAIXA,NOVELO',
      'Rex,Mimi,Fofo,Bola'
    );
    
    expect(resultado.erro).toBeUndefined();
    expect(resultado.lista).toHaveLength(4);
  });

  test('Deve cobrir caso onde ambas pessoas têm brinquedos válidos mas animal vai para abrigo', () => {
    const resultado = abrigo.encontraPessoas('RATO,BOLA', 'RATO,BOLA', 'Rex');
    expect(resultado.erro).toBeUndefined();
    expect(resultado.lista).toEqual(['Rex - abrigo']);
  });
});
test('Deve limitar adoções a 3 animais por pessoa', () => {
  const abrigo = new AbrigoAnimais();
  // Os brinquedos da Pessoa 1 cobrem 'Mimi', 'Rex', 'Zero' e 'Bebe'
  const brinquedosP1 = 'BOLA,LASER,RATO';
  // Os brinquedos da Pessoa 2 não cobrem nenhum animal da lista
  const brinquedosP2 = 'NOVELO,SKATE';

  const resultado = abrigo.encontraPessoas(
    brinquedosP1,
    brinquedosP2,
    'Mimi,Rex,Zero,Bebe'
  );

  // Mimi: P1 apta. Adota. adocaoP1Count = 1
  // Rex: P1 apta. Adota. adocaoP1Count = 2
  // Zero: P1 apta. Adota. adocaoP1Count = 3
  // Bebe: P1 apta, mas adocaoP1Count === 3, então não pode mais adotar. Vai para o abrigo.

  expect(resultado.erro).toBeUndefined();
  expect(resultado.lista).toEqual([
    'Bebe - abrigo',
    'Mimi - pessoa 1',
    'Rex - pessoa 1',
    'Zero - pessoa 1',
  ]);
});