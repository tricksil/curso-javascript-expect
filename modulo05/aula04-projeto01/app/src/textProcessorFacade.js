import TextProcessorFluentAPI from './textProcessorFluentAPI.js';

export default class TextProcessorFacade {
  #textProcessorFluentAPI;
  constructor(text) {
    this.#textProcessorFluentAPI = new TextProcessorFluentAPI(text);
  }

  getPeopleFromPDF() {
    return this.#textProcessorFluentAPI
      .extractPeopleData()
      .divideTextInColum()
      .removeEmptyCharacteres()
      .mapPerson()
      .build();
  }
}
