import { mouse, left, right, up, down, straightTo, Point, Button } from '@nut-tree/nut-js';

mouse.config.mouseSpeed = 500;

async function moveMouseLeft(data: string) {
    await mouse.move(left(Number(data)));
}

async function moveMouseRight(data: string) {
    await mouse.move(right(Number(data)));
}

async function moveMouseUp(data: string) {
    await mouse.move(up(Number(data)));
}

async function moveMouseDown(data: string) {
    await mouse.move(down(Number(data)));
}

async function getMousePosition() {
    const position = await mouse.getPosition();
    return `mouse_position ${position.x},${position.y}`;
}

async function drawCircleMouse(radius: string) {
    let x: number;
    let y: number;
    const r = Number(radius);
    const presicion = 1000;
    const position = await mouse.getPosition();
    mouse.config.mouseSpeed = 10000;
    for (let i = 0; i < Math.PI * 2; i += (Math.PI * 2) / presicion) {
        x = position.x + r * Math.sin(i);
        y = position.y + r * Math.cos(i);
        if (!i) {
            await mouse.setPosition(new Point(x, y));
            await mouse.pressButton(Button.LEFT);
        }
        await mouse.move(straightTo(new Point(x, y)));
    }
    mouse.config.mouseSpeed = 500;
    await mouse.releaseButton(Button.LEFT);
}

async function drawSquareMouse(width: string) {
    const w = Number(width);
    await mouse.pressButton(Button.LEFT);
    await mouse.move(right(w));
    await mouse.move(down(w));
    await mouse.move(left(w));
    await mouse.move(up(w));
    await mouse.releaseButton(Button.LEFT);
}

async function drawRectangleMouse(width: string, length: string) {
    const w = Number(width);
    const l = Number(length);

    await mouse.pressButton(Button.LEFT);
    await mouse.move(right(w));
    await mouse.move(down(l));
    await mouse.move(left(w));
    await mouse.move(up(l));
    await mouse.releaseButton(Button.LEFT);
}

export {
    moveMouseLeft,
    moveMouseRight,
    moveMouseUp,
    moveMouseDown,
    getMousePosition,
    drawCircleMouse,
    drawSquareMouse,
    drawRectangleMouse,
};
