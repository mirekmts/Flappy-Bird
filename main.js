console.log('Loaded from main.js')

var canvas,
    ctx,
    width,
    height,
    frames = 0,
    score = 0,
    best = 0,
    fgpos = 0,
    currentState,
    states = {
        Splash: 0, Game: 1, Score: 2
    },
    bird = {
        x: 60,
        y: 0,
        frame: 0,
        velocity: 0,
        animation: [0, 1, 2, 1],
        rotation: 0,
        gravity: 0.25,
        _jump: 4.6,

        jump: function() {
            this.velocity = -this._jump;
        },
        update: function() {
            var n = currentState === states.Splash ? 10 : 5;
            this.frame += frames % n === 0 ? 1 : 0;
            this.frame %= this.animation.length;

            if (currentState === states.Splash) {
                this.y = height - 280 + 5 * Math.cos(frames/10);
            } else {
                this.velocity += this.gravity;
                this.y += this.velocity;

                if (this.y >= height - s_fg.height - 10) {
                    this.y = height - s_fg.height - 10;

                    if (currentState === states.Game) {
                        currentState = states.Score;
                    }
                    this.velocity = this._jump;
                }

                if (this.velocity >= this._jump) {
                    this.frame = 1;
                    this.rotation = Math.min(Math.PI/3, this.rotation + 0.3);
                } else {
                    this.rotation = -0.3;
                }
            }
        },
        draw: function(ctx) {

            ctx.save();
            ctx.translate(this.x, this.y);
            ctx.rotate(this.rotation);
            var n = this.animation[this.frame];
            s_bird[n].draw(ctx, -s_bird[n].width/2, -s_bird[n].height/2);
            ctx.restore();
        }
    },
    pipes = {

        _pipes: [],

        reset: function() {
            this._pipes = [];

        },
        update: function() {
            if (frames % 100 === 0) {
                var _y = height - (s_pipeSouth.height + s_fg.height + 120 + 200*Math.random());
                this._pipes.push({
                    x: 500,
                    y: _y,
                    width: s_pipeSouth.width,
                    height: s_pipeSouth.height
                });
            }

            for (var i = 0, len = this._pipes.length; i < len; i++) {
                var p = this._pipes[i];

                p.x -= 2;
                if (p.x < -50) {
                    this._pipes.splice(i, 1);
                    i--;
                    len--;
                }
            }
        },
        draw: function() {
            for (var i = 0, len = this._pipes.length; i < len; i++) {
                var p = this._pipes[i];
                s_pipeSouth.draw(ctx, p.x, p.y);
                s_pipeNorth.draw(ctx, p.x, p.y + 80 + p.height);
            }
        }
    };

function onPress(evt) {

    switch (currentState) {
        case states.Splash:
            currentState = states.Game;
            bird.jump();
            break;
        case states.Game:
            bird.jump();
            break;
        case states.Score:

            break;
        default:

    }
}

function main() {
    canvas = document.createElement("canvas");

    width = window.innerWidth;
    height = window.innerHeight;

    var evt = "touchstart";

    if( width >= 500) {
        width = 320;
        height = 480;
        canvas.style.border = "1px solid #000";
        evt = 'mousedown';
    };

    document.addEventListener(evt, onPress);

    currentState = states.Splash;
    canvas.width = width;
    canvas.height = height;
    ctx = canvas.getContext("2d");

    document.body.appendChild(canvas);

    var img = new Image();
    img.onload = function() {
        initSprites(this);
        ctx.fillStyle = s_bg.color;
        run();
    }
    img.src = "res/sheet.png";

}

function run() {
    var loop = function() {
        update();
        render();
        window.requestAnimationFrame(loop, canvas);
    }
    window.requestAnimationFrame(loop, canvas);

}

function update() {
    frames++;
    if (currentState !== states.Score) {
        fgpos = ( fgpos - 2 ) % 14;
    }

    if (currentState === states.Game) {
        pipes.update();
    }
    bird.update();
}

function render() {
    ctx.fillRect(0,0,width, height);
    s_bg.draw(ctx, 0, height - s_bg.height);
    s_bg.draw(ctx, s_bg.width, height - s_bg.height);

    bird.draw(ctx);
    pipes.draw(ctx);

    s_fg.draw(ctx, fgpos, height - s_fg.height);
    s_fg.draw(ctx, fgpos + s_fg.width, height - s_fg.height);


    if (currentState === states.Splash) {
        s_splash.draw(ctx, (width / 2) - s_splash.width/2, height - 300);
        s_text.GetReady.draw(ctx, (width / 2) - s_text.GetReady.width/2, height - 380);
    }
}

main();
