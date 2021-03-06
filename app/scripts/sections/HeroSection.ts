
import Section from 'app/core/section';
import gsap, { TweenLite } from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';
import Draggable from 'gsap/Draggable';


gsap.registerPlugin(ScrollTrigger);
gsap.registerPlugin(Draggable);

const countOfScroll = 20000;
export default class HeroSection extends Section {

    async setupSection() {
        /* TODO */

        // create the image sequence

        const canvas = document.getElementById('hero-lightpass') as HTMLCanvasElement;
        const context = canvas.getContext('2d');
        // const vw = (coef) => window.innerWidth * (coef / 100);
        // const vh = (coef) => window.innerHeight * (coef / 100);

        canvas.width = 1600;
        canvas.height = 1200;

        const frameCount = 361;
        const currentFrame = index => require(`assets/img/sony_png_seq/sony_seq_${(index).toString().padStart(5, '0')}.png`);

        const images = [];
        const sequence = {
            frame: 0,
        };

        for (let i = 0; i < frameCount; i++) {
            const img = new Image();
            img.src = currentFrame(i);
            images.push(img);
        }

        const sequenceTL = gsap.timeline()
            // @ts-ignore
            .to(sequence, { frame: frameCount - 1, snap: 'frame', onUpdate: renderCanvas });

        ScrollTrigger.create({
            animation: sequenceTL,
            trigger: '.blue',
            start: 1,
            end: countOfScroll,
            scrub: 1,
            // pin: false,
        });
        ScrollTrigger.create({
            trigger: '.blue',
            scrub: 1,
            pin: true,
            pinSpacing: true,
            start: 1,
            end: countOfScroll,
        });

        images[0].onload = renderCanvas;

        function renderCanvas() {
            const sesequenceForRender = sequence;
            context.clearRect(0, 0, canvas.width, canvas.height);
            context.drawImage(images[sesequenceForRender.frame], 0, 0);
        }

        function render(object?: any) {
            const sesequenceForRender = object;
            context.clearRect(0, 0, canvas.width, canvas.height);
            context.drawImage(images[sesequenceForRender.frame], 0, 0);
        }


        // create the progress bar


        const offsetLeft = calcOffset(this.element.querySelector('.scrubber')).left;
        const scrubberWidth = 300;

        TweenLite.set('.progress', { scaleX: 0, transformOrigin: 'left' });
        Draggable.create('.empty', {
            animation: sequenceTL,
            type: 'x',
            trigger: '.scrubber',
            bounds: '.scrubber',
            onPress: function (e) {
                TweenLite.set(this.target, { x: this.pointerX - offsetLeft });
                this.update();
                updateProgressBarScale(this);
            },
            range: false,
            min: 0,
            max: 100,
            step: 2.35,
            value: 0,
            onDrag: function () {
                updateProgressBarScale(this);
                // @ts-ignore
                render(sequence);
            },
        });

        function updateProgressBarScale(theDraggable) {
            const progress = theDraggable.x / scrubberWidth;
            TweenLite.set('.progress', { scaleX: progress });
            console.log(theDraggable.x + ' / ' + progress);
        }

    }

    protected _activate() {
        /* TODO */
    }

    protected _deactivate() {
        /* TODO */
    }
}

function calcOffset(element) {
    const rect = element.getBoundingClientRect();
    const offset = {
        top: rect.top + window.scrollY,
        left: rect.left + window.scrollX,
    };
    return offset;

}
