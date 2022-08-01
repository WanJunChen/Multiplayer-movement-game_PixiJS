const socket = io.connect();

let myPlayer, state;
let AllPlayer = [];
let PlayerImageTexture;
let PlayerInfo = {
    name: prompt('請輸入名稱: '),
    ImageTexture: PlayerImageTexture,
    x: 530,
    y: 150,
    vx: 0,
    vy: 0,
    width: 50,
    height: 75,
    id: null
}
let BagItem_y = 130;
let ItemCount = 6;
let gameHeight = 1200;
let left    = keyboard(37),
    up      = keyboard(38),
    right   = keyboard(39),
    down    = keyboard(40);

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

    setBagBar(180, gameHeight);
    setGameScene(1600, gameHeight);
    
    // ========== Set all player on map ==========
    PlayerInfo.ImageTexture = PIXI.Texture.from("/images/character.png");
    PlayerInfo.id = GetID();
    myPlayer = createPlayer(PlayerInfo);
    app.stage.addChild(myPlayer);

    // 發送一個 "sendMessage" 事件
    socket.emit("sendMessage", { 
        Player: {
            id: PlayerInfo.id,
            name: PlayerInfo.name,
            width:  PlayerInfo.width,
            height:  PlayerInfo.height,
            TextureFrom: PlayerInfo.ImageTexture.textureCacheIds[0]
        }
    });
    // 監聽來自 server 的 "allMessage" 事件
    socket.on("allMessage", function (message) {
        console.log(message)
    });

    PlayerMove(myPlayer);

    state = play;
    app.ticker.add(delta =>gameLoop(delta));
}

function gameLoop(delta) {
    //Runs the current game `state` in a loop and renders the sprites
    state(delta);
}
  
function play(delta) {
    //All the game logic goes here
    myPlayer.x += myPlayer.vx;
    myPlayer.y += myPlayer.vy;
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
            console.log(myPlayer.name, myPlayer.id, ", Move direction:", key.string);
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

function PlayerMove(Player) { 
    let speed = 5;
    //Left arrow key `press` method
    left.press = () => {
        //Change the Player's velocity when the key is pressed
        Player.vx = -(speed);
        Player.vy = 0;
    };
    //Left arrow key `release` method
    left.release = () => {
        //If the left arrow has been released, and the right arrow isn't down,
        //and Player isn't moving vertically:
        //Stop Player
        if (!right.isDown && Player.vy === 0) {
            Player.vx = 0;
        }
    };

    //Up
    up.press = () => {
        Player.vy = -(speed);
        Player.vx = 0;
    };
    up.release = () => {
        if (!down.isDown && Player.vx === 0) {
            Player.vy = 0;
        }
    };

    //Right
    right.press = () => {
        Player.vx = speed;
        Player.vy = 0;
    };
    right.release = () => {
        if (!left.isDown && Player.vy === 0) {
            Player.vx = 0;
        }
    };

    //Down
    down.press = () => {
        Player.vy = speed;
        Player.vx = 0;
    };
    down.release = () => {
        if (!up.isDown && Player.vx === 0) {
            Player.vy = 0;
        }
    };

    
}
  
function GetID(){
    return socket.id;
}

function setBagBar(width, height) {
    let BagBar = new PIXI.Container();
    let bagBG = new PIXI.Graphics();
    bagBG.beginFill(0x8F6128);
    bagBG.drawRoundedRect(10, 10, width, height, 10);
    bagBG.endFill();
    BagBar.addChild(bagBG);
    let BagTitle = new PIXI.Text('背包', {
        fontSize: 36,
        fill: 0xFFFFFF
    });
    BagTitle.x = (width - BagTitle.width) / 2 + 10;
    BagTitle.y = 50;
    BagBar.addChild(BagTitle);
    for (let i = 0; i < ItemCount; i++){
        let bagItem = new PIXI.Graphics();
        bagItem.beginFill(0xFFFFFF);
        bagItem.drawRoundedRect(20, BagItem_y, 160, 170, 10)
        bagItem.endFill();
        BagBar.addChild(bagItem);
        BagItem_y += 180;
    }
    app.stage.addChild(BagBar);
}

function setGameScene(width, height) {
    let gameScene =  new PIXI.Container();
    let gameBG = new PIXI.Sprite(app.loader.resources["/images/Achievement_map.jpg"].texture);
    gameBG.x = 200;
    gameBG.y = 10;
    gameBG.width = width;
    gameBG.height = height;
    gameScene.addChild(gameBG);
    app.stage.addChild(gameScene);
}

function createPlayer(PlayerInfo) {
    let PlayerContainer = new PIXI.Container();
    let Player = new PIXI.Sprite(PlayerInfo.ImageTexture);
    let Name = new PIXI.Text(PlayerInfo.name, {
        fontSize: 20,
        fill: 0xFFFFFF
    });
    let NameBG = new PIXI.Graphics()
    NameBG.beginFill(0x000000, 0.3);
    NameBG.drawRoundedRect((PlayerInfo.width - Name.width - 8) / 2, 0, Name.width + 8, 23, 5)
    NameBG.endFill();
    // PlayerContainer.interactive = true;
    // PlayerContainer.buttonMode = true;
    PlayerContainer.name = PlayerInfo.name;
    PlayerContainer.id = PlayerInfo.id;
    PlayerContainer.x = PlayerInfo.x;
    PlayerContainer.y = PlayerInfo.y;
    PlayerContainer.vx = PlayerInfo.vx;
    PlayerContainer.vy = PlayerInfo.vy;
    Player.width = PlayerInfo.width;
    Player.height = PlayerInfo.height;
    Player.x = 0;
    Player.y = 25;
    Name.x = (PlayerInfo.width - Name.width) / 2;
    Name.y = 0;
    PlayerContainer.addChild(NameBG);
    PlayerContainer.addChild(Name);
    PlayerContainer.addChild(Player);
    return PlayerContainer;
}
