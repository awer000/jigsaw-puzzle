class Rectangle {
    x = 0
    y = 0
    width = 100
    height = 100
    isDragging = false

    constructor(x, y, width, height) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
    }

    render(ctx: CanvasRenderingContext2D) {
        // TODO: 각각의 함수는 어떤 역할을 하는가?
        ctx.save();
        ctx.beginPath();
        ctx.rect(this.x - this.width * 0.5, this.y - this.height * 0.5, this.width, this.height);
        ctx.fillStyle = '#2793ef';
        ctx.fill();

        ctx.restore();
    }
}

const mouseTouchTracker = (canvas: HTMLCanvasElement, callback: (evtType: 'up' | 'down' | 'move', x?: number, y?: number) => void) => {
    function processEvent(evt: ClickEvent) {
        const rect = canvas.getBoundingClientRect();
        const offsetTop = rect.top;
        const offsetLeft = rect.left;

        const { clientX, clientY } = evt instanceof TouchEvent ? evt.touches[0] : evt
    
        return {
            x: clientX - offsetLeft,
            y: clientY - offsetTop
        }
    }

    function onDown(evt: ClickEvent) {
        evt.preventDefault();
        const coords = processEvent(evt);
        callback('down', coords.x, coords.y);
    }

    function onUp(evt: ClickEvent) {
        evt.preventDefault();
        callback('up');
    }

    function onMove(evt: ClickEvent) {
        evt.preventDefault();
        const coords = processEvent(evt);
        callback('move', coords.x, coords.y);
    }

    canvas.ontouchmove = onMove;
    canvas.onmousemove = onMove;

    canvas.ontouchstart = onDown;
    canvas.onmousedown = onDown;

    canvas.ontouchend = onUp;
    canvas.onmouseup = onUp;
}

function isHit(shape, x, y) {
    // TODO: 직소 조각이 퍼즐 모양일 때 이 hit 함수를 어떻게 처리할까
    if (x > shape.x - shape.width * 0.5 && y > shape.y - shape.height * 0.5 && x < shape.x + shape.width - shape.width * 0.5 && y < shape.y + shape.height - shape.height * 0.5) {
        return true;
    }

    return false;
}

type ClickEvent = TouchEvent | MouseEvent;


const draw = () => {
    const canvas = <HTMLCanvasElement>document.getElementById('jigsaw');

    if (canvas.getContext) {
        const ctx = canvas.getContext('2d');

        let startX = 0;
        let startY = 0;

        const rectangle = new Rectangle(50, 50, 100, 100);
        const rectangle2 = new Rectangle(150, 150, 100, 100);
        
        rectangle.render(ctx);
        rectangle2.render(ctx);

        const list = [rectangle, rectangle2];

        mouseTouchTracker(canvas,
            (evtType: 'up' | 'down' | 'move', x: number, y: number) => {
                ctx.clearRect(0, 0, canvas.width, canvas.height);

                switch (evtType) {

                    case 'down':
                        startX = x;
                        startY = y;
                        list.forEach(item =>{
                            if (isHit(item, x, y)) {
                                item.isDragging = true;
                            }
                        })
                        
                        break;

                    case 'up':
                        list.forEach(item =>{
                            item.isDragging = false;

                        })
                        break;

                    case 'move':
                        let dx = x - startX;
                        let dy = y - startY;
                        startX = x;
                        startY = y;

                        list.forEach(item => {
                            if (item.isDragging) {
                                item.x += dx;
                                item.y += dy;
                            }
                        })
                        break;
                }

                list.forEach(item => {
                    item.render(ctx);
                })
            }
        );
    }
}

draw();