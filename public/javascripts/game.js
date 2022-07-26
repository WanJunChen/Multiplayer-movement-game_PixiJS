// import Socket from "./sockets";
// const socket = new Socket();

let man, state;
let playerArray = [];
let manWidth = 50;
let manHeight = 75;
let speed = 5;
let BagItem_y = 130
let ItemCount = 6

//Create a Pixi Application
const app = new PIXI.Application({
    width: 1810,
    height: 1220,
    antialias: true,
    backgroundColor: 0xFFFFFF
});
//Add the canvas that Pixi automatically created for you to the HTML document
document.getElementById('GameCanvas').appendChild(app.view);

app.loader
    .add("/images/Achievement_map.jpg")
    .add("/images/character.png")
    .load(setup);
function setup() {
    //Initialize the game sprites, set the game `state` to `play`
    //and start the 'gameLoop'

    // ========== Set bagScene ==========
    let bagScene = new PIXI.Container();
    let bagBG = new PIXI.Graphics();
    bagBG.beginFill(0x8F6128);
    bagBG.drawRoundedRect(10, 10, 180, 1200, 10)
    bagBG.endFill();
    bagScene.addChild(bagBG);
    let bagTitle = new PIXI.Text('背包', {
        fontSize: 36,
        fill: 0xFFFFFF
    });
    bagTitle.x = (bagScene.width - bagTitle.width) / 2 + 10;
    bagTitle.y = 50;
    bagScene.addChild(bagTitle);
    for (let i = 0; i < ItemCount; i++){

        createBagItem(20, BagItem_y);
        BagItem_y += 180;
    }
    function createBagItem(x, y) {
        let bagItem = new PIXI.Graphics();
        bagItem.beginFill(0xFFFFFF);
        bagItem.drawRoundedRect(x, y, 160, 170, 10)
        bagItem.endFill();
        bagScene.addChild(bagItem);
    }
    app.stage.addChild(bagScene);

    // ========== Set gameScene with map ==========
    let gameScene =  new PIXI.Container();
    let gameBG = new PIXI.Sprite(app.loader.resources["/images/Achievement_map.jpg"].texture);
    gameBG.x = 200;
    gameBG.y = 10;
    gameBG.width = 1600;
    gameBG.height = 1200;
    gameScene.addChild(gameBG);
    app.stage.addChild(gameScene);

    // ========== Set player on map ==========
    man = createPlayer(PIXI.Texture.from("/images/character.png"), 530, 150, 0, 0, manWidth, manHeight)
    app.stage.addChild(man);
    
    // ========== set keyboard event ==========
    let left = keyboard(37),
        up = keyboard(38),
        right = keyboard(39),
        down = keyboard(40);

    //Left arrow key `press` method
    left.press = () => {
        //Change the man's velocity when the key is pressed
        man.vx = -(speed);
        man.vy = 0;
    };
    //Left arrow key `release` method
    left.release = () => {
        //If the left arrow has been released, and the right arrow isn't down,
        //and the man isn't moving vertically:
        //Stop the man
        if (!right.isDown && man.vy === 0) {
            man.vx = 0;
        }
    };

    //Up
    up.press = () => {
        man.vy = -(speed);
        man.vx = 0;
    };
    up.release = () => {
        if (!down.isDown && man.vx === 0) {
            man.vy = 0;
        }
    };

    //Right
    right.press = () => {
        man.vx = speed;
        man.vy = 0;
    };
    right.release = () => {
        if (!left.isDown && man.vy === 0) {
            man.vx = 0;
        }
    };

    //Down
    down.press = () => {
        man.vy = speed;
        man.vx = 0;
    };
    down.release = () => {
        if (!up.isDown && man.vx === 0) {
            man.vy = 0;
        }
    };

    state = play;
    app.ticker.add(delta =>gameLoop(delta));
}

function gameLoop(delta) {
    //Runs the current game `state` in a loop and renders the sprites
    state(delta);
}
  
function play(delta) {
    //All the game logic goes here
    man.x += man.vx;
    man.y += man.vy;
}

function end() {
    //All the code that should run at the end of the game
}


//The 'keyboard' helper function
function keyboard(keyCode) {
    var key = {};
    key.code = keyCode;
    key.isDown = false;
    key.isUp = true;
    key.press = undefined;
    key.release = undefined;
    key.string = "";
    if(keyCode == 37) key.string = "LEFT";
    else if(keyCode == 38) key.string = "UP";
    else if(keyCode == 39) key.string = "RIGHT";
    else if(keyCode == 40) key.string = "DOWN";
    
    //The 'down Handler'
    key.downHandler = event => {
      if (event.keyCode === key.code) {
        if (key.isUp && key.press) {
            console.log("playerID:", man.id, ", direct:", key.string);
            key.press();
        }
        key.isDown = true;
        key.isUp = false;
      }
      event.preventDefault();
    };
  
    //The 'up Handler'
    key.upHandler = event => {
      if (event.keyCode === key.code) {
        if (key.isDown && key.release) {
            key.release()
        };
        key.isDown = false;
        key.isUp = true;
      }
      event.preventDefault();
    };
  
    //Attach event listeners
    window.addEventListener( "keydown", key.downHandler.bind(key), false );
    window.addEventListener( "keyup", key.upHandler.bind(key), false );

    return key;
}
  
// generate random ID of length 15
function GenNonDuplicateID(){
    let idStr = Date.now().toString(36);
    idStr += Math.random().toString(36).substring(2, 9);
    return idStr;
}

function createPlayer(imageTexture, x, y, vx, vy, width, height) {
    const Player = new PIXI.Sprite(imageTexture);
    Player.id = GenNonDuplicateID();
    Player.x = x;
    Player.y = y;
    Player.vx = vx;
    Player.vy = vy;
    Player.width = width;
    Player.height = height;
    playerArray.push(Player);
    
    return Player;
}