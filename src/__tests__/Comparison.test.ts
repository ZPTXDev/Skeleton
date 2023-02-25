import { Comparison } from '../Comparison.js';

describe('Comparison enum', (): void => {
    it('should have the correct values', (): void => {
        expect(Comparison.Equal).toBe('==');
        expect(Comparison.NotEqual).toBe('!=');
        expect(Comparison.GreaterThan).toBe('>');
        expect(Comparison.LessThan).toBe('<');
        expect(Comparison.GreaterThanOrEqual).toBe('>=');
        expect(Comparison.LessThanOrEqual).toBe('<=');
    });
});
