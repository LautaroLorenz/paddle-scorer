export const getRandomBrightHexColor = (): string => {
    const minBrightness = 50;
    const r = Math.floor(Math.random() * (256 - minBrightness) + minBrightness);
    const g = Math.floor(Math.random() * (256 - minBrightness) + minBrightness);
    const b = Math.floor(Math.random() * (256 - minBrightness) + minBrightness);

    const hexR = r.toString(16).padStart(2, '0');
    const hexG = g.toString(16).padStart(2, '0');
    const hexB = b.toString(16).padStart(2, '0');

    const hexColor = `#${hexR}${hexG}${hexB}`;
    return hexColor;
};
