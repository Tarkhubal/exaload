import convert from 'https://cdn.skypack.dev/color-convert';

const HUE_RANGE = [100, 300]; // The full range 0-360
const ANGLE_RANGE = [-300, 300];
const GRADIENTS = 8;

export const random = (from, to) => Math.floor(Math.random() * (to - from) + from);

const generateRandomGradients = () => {
    const backgrounds = [];
    for (let i = 0; i < GRADIENTS; i++) {
        const a = random(10, 50);
        const b = random(a, a + 10);
        const color = `rgba(${convert.hsv.rgb(random(HUE_RANGE[0], HUE_RANGE[1]),70,80)}, ${random(2, 6) / 10})`;
        backgrounds.push(
            `linear-gradient(`+
                `calc(var(--rotate) * ${random(ANGLE_RANGE[0], ANGLE_RANGE[1])}), `+
                `transparent ${a-10}%, `+
                `${color} ${a}%, `+
                `${b}%, `+
                `rgba(0,0,0,0.5) ${b+0.1}%, `+
                `transparent ${b+10}%`+
            `)`
        );
    }
    return backgrounds.join(',');
};

document.getElementById('layer1').style.background = generateRandomGradients();
document.getElementById('layer2').style.background = generateRandomGradients();

document.getElementById('button').addEventListener('click', () => {
  document.getElementById('layer1').style.background = generateRandomGradients();
  document.getElementById('layer2').style.background = generateRandomGradients();
});