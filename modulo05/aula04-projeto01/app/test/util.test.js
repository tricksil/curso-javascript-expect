import { describe, it } from 'mocha';
import { expect } from 'chai';
import { InvalidRegexError, evaluateRegex } from '../src/util.js';

describe('Util', () => {
  it('#evaluateRegex should throw an error using an unsafe regex', () => {
    const unsafeRegex = /^([a-zA-Z0-9]+\s?)+$/;
/* 
    // fica rodando em loop e quebra tudo!
    time \
    node --eval "/^([a-zA-Z0-9]+s?)+$/.test('eaaae man como vai voce e como vai voce e como vai voce?') &&
      console.log('legalzin')" */
    expect(() => evaluateRegex(unsafeRegex)).to.throw(
      InvalidRegexError,
      `This ${unsafeRegex} is unsafe dude!`
    );
  });

  it('#evaluateRegex should not throw an error using a safe regex', () => {
    const safeRegex = /^([a-z])$/;
    expect(() => evaluateRegex(safeRegex)).to.not.throw();
    expect(() => evaluateRegex(safeRegex)).to.be.ok;
  });
});
