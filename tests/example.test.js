// Exemplo de teste automatizado
import { greet } from '../src/utils/helpers.js';

test('greet function', () => {
    expect(greet('Mundo')).toBe('Olá, Mundo! Bem-vindo ao FreeGamePlant.');
});