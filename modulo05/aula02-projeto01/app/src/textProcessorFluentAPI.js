// O objetivo do Fluent API e executar tarefas
// como um pipeline, step by step
// e no fim, chama o build. MUITO similar ao padrao Builder
// a diferenca que aqui e sobre processos, o Builder sobre construcao
// de objetos
export default class TextProcessorFluentAPI {
  // propriedade privada!
  #content;
  constructor(content) {
    this.#content = content;
  }

  extractPeopleData() {
    // ?<= fala que vai extrair os dados que virao depois desse grupo
    // [contratante|contratada] ou um ou outro, (e tem a flag no fim da expressao pra pegar maiusculo e minusculo)
    // :\s{1} vai procurar o caracter literal dos dois pontos seguindo de um espaco
    // tudo acima fica dentro de um parenteses para falar, vamos pegar dai para frente
    // ?!\s negative look around, vai ignorar os contratantes do fim do documento(que tem so espaco a frente deles)
    //.*\n pega qualquer coisa até o primeiro \n
    // .*? non greety, esse ? faz com que ele pare na primeira recorrencia, assim ele evita ficar em loop

    // $ informar que a pesquisa acaba no fim da linha
    // g -> global
    // m -> multiline
    // i -> insensitive

    const matchPerson =
      /(?<=[contratante|contratada]:\s{1})(?!\s)(.*\n.*?)$/gim;
    // faz um match para encontrar a string inteira que contem os dados que precisamos
    const onlyPerson = this.#content.match(matchPerson);
    // console.log('onlyPerson', onlyPerson);
    this.#content = onlyPerson;
    return this;
  }

  build() {
    return this.#content;
  }
}
