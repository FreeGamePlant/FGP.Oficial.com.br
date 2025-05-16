/**
 * Avalia uma expressão matemática de forma segura.
 * @param {string} expression - A expressão matemática a ser avaliada.
 * @returns {number|string} - O resultado do cálculo ou uma mensagem de erro.
 */
export function evaluateExpression(expression) {
    try {
        // Remove caracteres não permitidos para evitar injeções maliciosas
        if (!/^[0-9+\-*/().\s]+$/.test(expression)) {
            throw new Error('Expressão inválida.');
        }

        // Avalia a expressão usando a função Function (mais segura que eval)
        const result = Function(`"use strict"; return (${expression})`)();
        return result;
    } catch (error) {
        return 'Erro ao calcular a expressão.';
    }
}