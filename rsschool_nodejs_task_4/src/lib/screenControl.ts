import Jimp from 'jimp/es';
import { Region, mouse, screen } from '@nut-tree/nut-js';

async function getPrintScreen() {
    const position = await mouse.getPosition();
    const clientWidth = 200;
    const clientHeight = 200;

    const region = new Region(position.x - clientWidth / 2, position.y - clientHeight / 2, clientWidth, clientHeight);
    const BGRImage = await screen.grabRegion(region);

    const { data, width, height } = await BGRImage.toRGB();

    const jimpObj = new Jimp({ data, width, height });
    const png64 = await jimpObj.getBase64Async(Jimp.MIME_PNG);
    const png64short = png64.replace('data:image/png;base64,', '');

    return `prnt_scrn ${png64short}`;
}

export { getPrintScreen };
