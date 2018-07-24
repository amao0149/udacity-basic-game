// 一些函数工具
// 获取from-end的随机整数
function getRandomInt(from, end) {
    return from + Math.floor(Math.random() * (end - from + 1))
}
// 获取from到end到随机数
function getRandomNum(from, end) {
    return from + Math.random() * (end - from)
}
// 检查边界条件，返回加一或减一到值，op=1为加，op=0为减
function moveOp(min, max, value, op) {
    if (op) {
        return value === max ? value : value + 1;
    }
    return value === min ? value : value - 1;
}

var info = {
    block: {
        width: 101,
        height: 83
    }
}


// 这是我们的玩家要躲避的敌人
var Enemy = function() {
    // 要应用到每个敌人的实例的变量写在这里
    // 我们已经提供了一个来帮助你实现更多

    // 敌人的图片，用一个我们提供的工具函数来轻松的加载文件
    this.sprite = 'images/enemy-bug.png';
    this.speed = getRandomNum(100, 500);
    this.initX = -100;
    this.yPos = [0, 60, 60 + info.block.height, 60 + info.block.height * 2];
    this.secY = getRandomInt(1, 3);
    this.secX; // 用于判断是否相撞

    this.x = this.initX;
    this.y = this.yPos[this.secY];
};

// 此为游戏必须的函数，用来更新敌人的位置
// 参数: dt ，表示时间间隙
Enemy.prototype.update = function(dt) {
    // 你应该给每一次的移动都乘以 dt 参数，以此来保证游戏在所有的电脑上
    // 都是以同样的速度运行的
    if (this.x > ctx.canvas.width) {
        this.x = this.initX;
        this.speed = getRandomNum(300, 500);
        this.secY = getRandomInt(1, 3);
        this.y = this.yPos[this.secY];
    }
    this.x += this.speed * dt;
    this.secX = Math.floor(this.x / info.block.width + .5);
};

// 此为游戏必须的函数，用来在屏幕上画出敌人，
Enemy.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

// 现在实现你自己的玩家类
// 这个类需要一个 update() 函数， render() 函数和一个 handleInput()函数
var Player = function(type) {
    var charactors = {
        pinkGirl: {
            url: 'images/char-pink-girl.png',
            win: {
                url: 'images/char-princess-girl.png'
            }
        }
    };
    this.defaultChar = 'pinkGirl';
    this.char = type || this.defaultChar;
    this.sprite = (charactors[this.char] && charactors[this.char].url) || charactors[defaultChar].url;
    this.charactors  = charactors;
    this.secX = 3; // 0-4
    this.secY = 4; // 0-5
    this.x, this.y;
}

Player.prototype.reset = function() {
    this.sprite = this.charactors[this.defaultChar].url;
    this.secX = 3;
    this.secY = 4;
}

Player.prototype.update = function() {
    this.x = info.block.width * this.secX;
    this.y = info.block.height * this.secY - 10;
}

Player.prototype.render = function() {
    if (!Resources.get(this.sprite)) {
        Resources.load(this.sprite);
    } else {
        ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
    }
}

// 检测玩家是否与虫碰撞
Player.prototype.checkCollisions = function() {
    let flag = false;
    const that = this;
    allEnemies.forEach(function(enemy) {
        if ((enemy.secY === that.secY) && (enemy.secX === that.secX)) {
            return flag = true;
        }
    })
    return flag;
}

// 如果玩家到达第0个区块则胜利并显示提示
Player.prototype.handleIfWin = function() {
    if (this.secY === 0) {
        // this.sprite = this.charactors[this.char].win.url;
        ctx.font = "50px '微软雅黑'";
        ctx.fillStyle = 'orange';
        ctx.fillText('you win', this.x, this.y + 50);
    }
}

Player.prototype.handleInput = function(direction) {
    if (!direction || (this.secY === 0)) return;
    switch (direction) {
        case 'up':
            this.secY = moveOp(0, 5, this.secY, 0);
            break;
        case 'down':
            this.secY = moveOp(0, 5, this.secY, 1);
            break;
        case 'left':
            this.secX = moveOp(0, 4, this.secX, 0);
            break;
        default:
            this.secX = moveOp(0, 4, this.secX, 1);
    }
}


// 现在实例化你的所有对象
// 把所有敌人的对象都放进一个叫 allEnemies 的数组里面
// 把玩家对象放进一个叫 player 的变量里面
var player = new Player();

function createEnemies(num) {
    var enemies = [];
    while(num--) {
        enemies.push(new Enemy());
    }
    return enemies;
}

var allEnemies = createEnemies(3);




// 这段代码监听游戏玩家的键盘点击事件并且代表将按键的关键数字送到 Player.handleInput()
// 方法里面。你不需要再更改这段代码了。
document.addEventListener('keyup', function(e) {
    var allowedKeys = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down'
    };

    player.handleInput(allowedKeys[e.keyCode]);
});
