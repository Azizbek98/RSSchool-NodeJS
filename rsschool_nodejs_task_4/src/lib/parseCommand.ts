import {
    drawCircleMouse,
    drawRectangleMouse,
    drawSquareMouse,
    getMousePosition,
    moveMouseDown,
    moveMouseLeft,
    moveMouseRight,
    moveMouseUp,
} from './mouseMovement';
import { getPrintScreen } from './screenControl';

async function parseCommand(data: string) {
    const arr = data.split(' ');
    const command = arr[0];
    const value = arr[1];
    const value2 = arr[2];

    switch (command) {
        case 'mouse_up':
            await moveMouseUp(value);
            break;
        case 'mouse_down':
            await moveMouseDown(value);
            break;
        case 'mouse_left':
            await moveMouseLeft(value);
            break;
        case 'mouse_right':
            await moveMouseRight(value);
            break;
        case 'mouse_position':
            return getMousePosition();
        case 'draw_circle':
            await drawCircleMouse(value);
            break;
        case 'draw_square':
            await drawSquareMouse(value);
            break;
        case 'draw_rectangle':
            await drawRectangleMouse(value, value2);
            break;
        case 'prnt_scrn':
            return getPrintScreen();
        default:
            console.log('Unknown command');
    }
}

export default parseCommand;
