// set up canvas

const canvas = document.querySelector('canvas');
const ctx = canvas.getContext('2d');

const width = canvas.width = window.innerWidth;
const height = canvas.height = window.innerHeight;

// function to generate random number

function random(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

// function to generate random RGB color value

function randomRGB() {
    return `rgb(${random(0, 255)},${random(0, 255)},${random(0, 255)})`;
}

class Share {
    constructor(x, y, velX, velY, exists = true) {
        this.x = x;
        this.y = y;
        this.velX = velX;
        this.velY = velY;
        this.exists = exists;
    }
}

class Ball extends Share {

    constructor(x, y, velX, velY, color, size, exists = true) {
        super(x, y, velX, velY, exists = true);
        this.color = color;
        this.size = size;
    }

    draw() {
        ctx.beginPath();
        ctx.fillStyle = this.color;
        ctx.arc(this.x, this.y, this.size, 0, 2 * Math.PI);
        ctx.fill();
    }

    update() {
        if ((this.x + this.size) >= width) {
            this.velX = -(this.velX);
        }

        if ((this.x - this.size) <= 0) {
            this.velX = -(this.velX);
        }

        if ((this.y + this.size) >= height) {
            this.velY = -(this.velY);
        }

        if ((this.y - this.size) <= 0) {
            this.velY = -(this.velY);
        }

        this.x += this.velX;
        this.y += this.velY;
    }

    collisionDetect() {
        for (const ball of balls) {
            if (!(this === ball)) {
                const dx = this.x - ball.x;
                const dy = this.y - ball.y;
                const distance = Math.sqrt(dx * dx + dy * dy);

                if (distance < this.size + ball.size) {
                    ball.color = this.color = randomRGB();
                }
            }
        }
    }

}

// store mouse pointer coordinates, and whether the button is pressed
let curX;
let curY;
let pressed = false;

// update mouse pointer coordinates
document.addEventListener('mousemove', e => {
    curX = (window.Event) ? e.pageX : e.clientX + (document.documentElement.scrollLeft ? document.documentElement.scrollLeft : document.body.scrollLeft);
    curY = (window.Event) ? e.pageY : e.clientY + (document.documentElement.scrollTop ? document.documentElement.scrollTop : document.body.scrollTop);
});

document.addEventListener('touchstart', function(e) {
    // Cache the client X/Y coordinates
    curX = e.touches[0].clientX;
    curY = e.touches[0].clientY;
}, false);

canvas.addEventListener('mousedown', () => pressed = true);
canvas.addEventListener('mouseup', () => pressed = false);
canvas.addEventListener('touchstart', () => pressed = true);
canvas.addEventListener('touchend', () => pressed = false);

const evilSize = 30;

class EvilCircle extends Share {
    constructor(x, y, velX = 20, velY = 20, exists = true) {
        super(x, y, velX, velY, exists);
        this.color = 'white';
        this.size = evilSize;
    }

    draw() {
        ctx.beginPath();
        // things path !!!!
        ctx.lineWidth = 4;
        ctx.strokeStyle = this.color;
        ctx.arc(this.x, this.y, this.size, 0, 2 * Math.PI);
        ctx.stroke();
    }

    checkBounds() {
        if ((this.x + this.size) >= width) {
            this.x = this.x - (this.size);
        }

        if ((this.x - this.size) <= 0) {
            this.x = this.x + (this.size);
        }

        if ((this.y + this.size) >= height) {
            this.y = this.y - (this.size);
        }

        if ((this.y - this.size) <= 0) {
            this.y = this.y + (this.size);
        }
    }

    setControls() {
        var _this = this;
        if (pressed) {
            if (curY < height / 3) {
                _this.y -= _this.velY;
            } else if (curY > height * 2 / 3) {
                _this.y += _this.velY;
            } else if (curX > width / 2) {
                _this.x += _this.velX;
            } else {
                _this.x -= _this.velX;
            }
        }

        window.onkeydown = function(e) {
            if (e.keyCode === 65) {
                _this.x -= _this.velX;
            } else if (e.keyCode === 68) {
                _this.x += _this.velX;
            } else if (e.keyCode === 87) {
                _this.y -= _this.velY;
            } else if (e.keyCode === 83) {
                _this.y += _this.velY;
            }
        }
    }

    collisionDetect() {
        for (const ball of balls) {
            if (ball.exists === true) {
                const dx = this.x - ball.x;
                const dy = this.y - ball.y;
                const distance = Math.sqrt(dx * dx + dy * dy);

                if (distance < this.size + ball.size) {
                    ball.exists = false;
                }
            }
        }
    }
}

const balls = [];

while (balls.length < 25) {
    const size = random(10, 20);
    const ball = new Ball(
        // ball position always drawn at least one ball width
        // away from the edge of the canvas, to avoid drawing errors
        random(0 + size, width - size),
        random(0 + size, height - size),
        random(-7, 7),
        random(-7, 7),
        randomRGB(),
        size
    );

    balls.push(ball);
}

var countetText = document.querySelector('p');

const evilBall = new EvilCircle(
    (0 + width) / 2,
    (0 + height) / 2
)

function loop() {
    ctx.fillStyle = 'rgba(0, 0, 0, 0.25)';
    ctx.fillRect(0, 0, width, height);

    for (const ball of balls) {
        if (ball.exists === true) {
            ball.draw();
            ball.update();
            ball.collisionDetect();
        }
    }
    for (let index = balls.length - 1; index > 0; index--) {
        var item = balls[index];
        countetText.textContent = index;
        // console.log(item.exists);
        if (item.exists === false) {
            balls.splice(index, 1);
            // index++;
        }
    }

    evilBall.draw();
    evilBall.setControls();
    evilBall.checkBounds();
    evilBall.collisionDetect();
    var numberBalls = balls.length - 1;
    countetText.textContent = "Ball count: " + numberBalls;

    requestAnimationFrame(loop);
}

loop();