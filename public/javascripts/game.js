var man, state;
let speed = 3;

//Create a Pixi Application
const app = new PIXI.Application({
    width: 1200,
    height: 900,
    antialias: true,
    backgroundColor: 0x000000
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

    let gameScene =  new PIXI.Container();
    let mapBG = new PIXI.Sprite(app.loader.resources["/images/Achievement_map.jpg"].texture);
    mapBG.width = 1200;
    mapBG.height = 900;
    gameScene.addChild(mapBG);
    app.stage.addChild(gameScene);


    let character =  new PIXI.Container();
    character.visible = true;
    app.stage.addChild(character);

    var manWidth = 50;
    var manHeight = 75;
    man = createSprite(PIXI.Texture.from("/images/character.png"), 240, 150, 0, 0, manWidth, manHeight)
    character.addChild(man);
    function createSprite(imageTexture, X, Y, vX, vY, width, height) {
        const Sprite = new PIXI.Sprite(imageTexture);
        Sprite.x = X;
        Sprite.y = Y;
        Sprite.vx = vX;
        Sprite.vy = vY;
        Sprite.width = width;
        Sprite.height = height;
        return Sprite;
    }

    let left = keyboard(37),
        up = keyboard(38),
        right = keyboard(39),
        down = keyboard(40);
    

    //Left arrow key `press` method
    left.press = () => {
        //Change the cat's velocity when the key is pressed
        man.vx = -(speed);
        man.vy = 0;
    };
    
    //Left arrow key `release` method
    left.release = () => {
        //If the left arrow has been released, and the right arrow isn't down,
        //and the cat isn't moving vertically:
        //Stop the cat
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


//The `keyboard` helper function
function keyboard(keyCode) {
    var key = {};
    key.code = keyCode;
    key.isDown = false;
    key.isUp = true;
    key.press = undefined;
    key.release = undefined;
    
    //The `downHandler`
    key.downHandler = event => {
      if (event.keyCode === key.code) {
        if (key.isUp && key.press) key.press();
        key.isDown = true;
        key.isUp = false;
      }
      event.preventDefault();
    };
  
    //The `upHandler`
    key.upHandler = event => {
      if (event.keyCode === key.code) {
        if (key.isDown && key.release) key.release();
        key.isDown = false;
        key.isUp = true;
      }
      event.preventDefault();
    };
  
    //Attach event listeners
    window.addEventListener(
      "keydown", key.downHandler.bind(key), false
    );
    window.addEventListener(
      "keyup", key.upHandler.bind(key), false
    );
    return key;
}
  
