export const getRandomNumberInRange = (min: number, max: number): number => {
    if (min > max) {
        [min, max] = [max, min];
    }
    const random = Math.random();
    const randomNumberInRange = min + random * (max - min);
    return randomNumberInRange;
};
