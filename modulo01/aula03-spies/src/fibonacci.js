class Fibonacci {
  *execute(input, current = 0, next = 1) {
    // processou todas as sequencias
    if (input === 0) {
      return;
    }
    // retorna o valor
    yield current;

    // delega a funcao mas nao retona valor!
    yield* this.execute(input - 1, next, current + next);
  }
}

module.exports = Fibonacci;
