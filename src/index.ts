class Rectangle {
    x = 0
    y = 0
    z = 0
    width = 100
    height = 100
    isDragging = false
    color

    constructor({x, y, z = 0, width, height, color = 'blue'}) {
        this.x = x;
        this.y = y;
        this.z = z;
        this.width = width;
        this.height = height;
        this.color = color
    }

    render(ctx: CanvasRenderingContext2D) {
        // TODO: 각각의 함수는 어떤 역할을 하는가?
        ctx.save();
        ctx.beginPath();
        ctx.rect(this.x - this.width * 0.5, this.y - this.height * 0.5, this.width, this.height);
        ctx.fillStyle = this.color;
        ctx.fill();

        ctx.restore();
    }
}

const mouseTouchTracker = (canvas: HTMLCanvasElement, callback: (evtType: 'up' | 'down' | 'move', x?: number, y?: number, z?: number) => void) => {
    const zIndex = 1;

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
        callback('down', coords.x, coords.y, zIndex);
    }

    function onUp(evt: ClickEvent) {
        evt.preventDefault();
        callback('up');
    }

    function onMove(evt: ClickEvent) {
        evt.preventDefault();
        const coords = processEvent(evt);
        callback('move', coords.x, coords.y, zIndex);
    }

    canvas.ontouchmove = onMove;
    canvas.onmousemove = onMove;

    canvas.ontouchstart = onDown;
    canvas.onmousedown = onDown;

    canvas.ontouchend = onUp;
    canvas.onmouseup = onUp;
}

const isHit = (shape, x, y, z) => {
    // TODO: 직소 조각이 퍼즐 모양일 때 이 hit 함수를 어떻게 처리할까
    if (shape.z === z && x > shape.x - shape.width * 0.5 && y > shape.y - shape.height * 0.5 && x < shape.x + shape.width - shape.width * 0.5 && y < shape.y + shape.height - shape.height * 0.5) {
        return true;
    }

    return false;
}

const moveRectangle = (canvas, ctx, list) => {
    let startX = 0, startY = 0
    
    return (evtType: 'up' | 'down' | 'move', x: number, y: number, z: number) => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        switch (evtType) {
            case 'down':
                startX = x;
                startY = y;
                list.forEach(item => {
                    if (isHit(item, x, y, z)) {
                        item.isDragging = true;
                    }
                })

                break;

            case 'up':
                list.forEach(item => {
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
}
type ClickEvent = TouchEvent | MouseEvent;

const draw = () => {
    const canvas = <HTMLCanvasElement>document.getElementById('jigsaw');

    if (canvas.getContext) {
        const ctx = canvas.getContext('2d');

        const redRectangle = new Rectangle({ x: 150, y: 50, width: 100, height: 100, color: 'red'});

        const rectangle = new Rectangle({ x: 50, y: 50, z: 1, width: 100, height: 100});
        const rectangle2 = new Rectangle({ x: 150, y: 150, z: 1, width: 100,height: 100});


        rectangle.render(ctx);
        rectangle2.render(ctx);

        redRectangle.render(ctx)

        const list = [redRectangle, rectangle, rectangle2];

        mouseTouchTracker(canvas, moveRectangle(canvas, ctx, list));
    }
}

draw();