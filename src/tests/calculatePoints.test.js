const calculatePoints = require('../../utils/calculatePoints');

describe('calculatePoints', () => {
    test('returns 0 points for amount ≤ 50', () => {
        expect(calculatePoints(0)).toBe(0);
        expect(calculatePoints(30)).toBe(0);
        expect(calculatePoints(50)).toBe(0);
    });

    test('calculates correct points for amount between 51 and 100', () => {
        expect(calculatePoints(80)).toBe(30);

        expect(calculatePoints(100)).toBe(50);
    });

    test('calculates correct points for amount above 100', () => {
        expect(calculatePoints(120)).toBe(90);

        expect(calculatePoints(150)).toBe(150);
    });

    test('handles decimal values correctly', () => {
        expect(calculatePoints(120.5)).toBeCloseTo(91);
    });
});
