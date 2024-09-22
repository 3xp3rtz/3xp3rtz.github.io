{
  // 0 = main menu, 1 = game, 2 = instructions, 3 = settings, -1 = game over
  let scene = 0;

  // 0 = normal jetpack, 1 = gravity, 2 = ufo
  let movement = 0;
  let scoreOutput;
  // the speed at which the game moves, increases logarithmically
  let gameSpeed = 7;
  let originalGameSpeed = 7;
  let distanceTravelled = 0;

  // whether the player is holding the screen right now
  let movementIsHeld = false;
  // let gravity = 0.45;
  let boostVector, gravityVectors;
  let jumpBoost;
  const risingFactor = 1.15;

  let grav;
  let graphY;

  const ceilingY = 200;
  const floorY = 600;
  const offscreen = -60;

  const flapTime = 25;

  // floor
  const playerJetpackMovementChangeFloor = -11;
  const playerJetpackMovementChangeCeiling = 9;

  let frame, delay;
  let slowDown = 240;
  let main_screen;

  const buttonfill = '#da8e9b';
  const buttonhover = '#eeb7bc';
  const buttonstroke = '#000000';

  // variables for settings
  const settingscolor1 = '#2596be';
  const settingscolor2 = '#b8dce4';
  const settingscolor3 = '#f0b4bc';
  const settingscolor4 = '#c86474';
  const toggleon = '#d88c9c';
  const toggleoff = '#b84c64';

  let instructionslide = 0;
  const instructiontext = [
    'Cupid is trying to collect \nheart points to make the \nnext arrow more potent!',
    'Help Cupid avoid obstacles \nwhile collecting coins!',
    "With Cupid's default wings, hold space \nto fly upwards, and release to fall.",
    'Periodically, powerup boxes will also \nspawn, and collecting a powerup \nbox gives Cupid a new set of wings.',
    'Different wings have unique movement \ntypes, coin score multipliers, and \nthey allow Cupid to take an extra hit.',
    "At the end of the game, your total \nscore will factor in Cupid's distance \ntravelled and the coins collected.",
    'Good luck, and may Cupid take \nyou on a lovesick loveride!',
    'Art: cheollie, zozoe_fc, anieni, nekok0\nMusic: crossblade\t-\tInfra: ApocalypseCalculator\nCoding: 3xp3rtz, Maplefin, JojoTheWarrior, Trentium',
  ];

  const popupcolor = '#c0dce4';
  const popuptext = '#c86474';

  let extraromance = false;
  let music = true;
  let secretsetting = false;

  const animationspeed = 0.15;

  const togglelerp = [1, 0, 0];

  let paused = false;

  const arrowFreezeTime = 40; // in frames

  let player;
  let playerState;

  // obstacles is the group that specifically refers to the "lasers", both the static type and the spinning type
  let obstacles, arrows, coins, powerups;

  let nextPowerup;
  let font;
  let font2;

  let lastChunkType;

  let coinTurn = 0;
  const coinSize = 15;

  // add to the totalChunkTypes the more types of chunks we make
  const maximumObstacles = 15;
  const totalChunkTypes = 25;
  const totalArrowChunkTypes = 1;

  const menuAssets = [
    {
      img: null,
      link: './assets/main_screen.png',
    },
    {
      img: null,
      link: './assets/instr.png',
    },
    {
      img: null,
      link: './assets/sett.png',
    },
    {
      img: null,
      link: './assets/lb.png',
    },
    {
      img: null,
      link: './assets/play.png',
    },
    {
      img: null,
      link: './assets/instr-hover.png',
    },
    {
      img: null,
      link: './assets/sett-hover.png',
    },
    {
      img: null,
      link: './assets/lb-hover.png',
    },
    {
      img: null,
      link: './assets/play-hover.png',
    },
    {
      img: null,
      link: './assets/game_over.png',
    },
  ];

  const gameAssets = [
    {
      img: null,
      link: './assets/warn.png',
    },
    {
      img: null,
      link: './assets/arrow.png',
    },
    {
      img: null,
      link: './assets/default_player_wings_up.png',
    },
    {
      img: null,
      link: './assets/default_player_wings_down.png',
    },
    {
      // 4
      img: null,
      link: './assets/eagle_up.png',
    },
    {
      img: null,
      link: './assets/eagle_down.png',
    },
    {
      img: null,
      link: './assets/mech_up.png',
    },
    {
      img: null,
      link: './assets/mech_down.png',
    },
    {
      img: null,
      link: './assets/heart_coin.gif',
    },
    {
      // 9
      img: null,
      link: './assets/pillar.png',
    },
    {
      img: null,
      link: './assets/heartBox.png',
    },
    {
      img: null,
      link: './assets/metro_bg1.png',
    },
    {
      img: null,
      link: './assets/metro_bg2.png',
    },
    {
      img: null,
      link: './assets/metro_bg3.png',
    },
    {
      // 14
      img: null,
      link: './assets/metro_bg4.png',
    },
    {
      img: null,
      link: './assets/metro_bg5.png',
    },
    {
      img: null,
      link: './assets/metro_clouds1.png',
    },
    {
      img: null,
      link: './assets/metro_clouds2.png',
    },
    {
      img: null,
      link: './assets/metro_clouds3.png',
    },
    {
      // 19
      img: null,
      link: './assets/metro_clouds4.png',
    },
  ];

  const instructionsAssets = [
    {
      img: null,
      link: './assets/instructions/image0.png',
    },
    {
      img: null,
      link: './assets/instructions/image1.png',
    },
    {
      img: null,
      link: './assets/instructions/image2.png',
    },
    {
      img: null,
      link: './assets/instructions/image3.png',
    },
    {
      img: null,
      link: './assets/instructions/image4.png',
    },
    {
      img: null,
      link: './assets/instructions/image5.png',
    },
    {
      img: null,
      link: './assets/instructions/image6.png',
    },
    {
      img: null,
      link: './assets/instructions/image7.png',
    },
  ];

  /*
    Obstacle: ['obstacle', X, Y, RotationAngle, SpinningVelocity]
        - X, Y: obstacle location
        - RotationAngle: degrees to rotate clockwise
            0 degrees: standing straight up: |
        - SpinningVelocity: *PI radians per sec
            + vel: CCW rotation
            - vel: CW rotation
    Coin Rect:   ['coinRect', X, Y, W, H]
        - X, Y: top left coin location
        - W, H: columns/rows in the coin group
            W=3, H=2:
                O O O
                O O O
    Coin Heart:     ['coinHeart', X, Y]
        - X, Y: center of the group of coins
    Arrow:  ['arrow', startingHeight, fuseTimer, chaseSpeed]
        - startingHeight: the Y-level the arrow spawns at
        - fuseTimer: how long the arrow will flash for before launching itself at the player
            in frames
                at 40 frames, stops tracking player Y
                at 0 frames: launched toward player
        - chaseSpeed: how fast the arrow chases the player
            default: gameSpeed/3, ~3-4
    */

  const chunks = [
    [
      // chunk 0: coins between obstacles
      // risk/reward thing

      ['obstacle', 100, 400, 45, 0], // left obstacle
      ['obstacle', 600, 400, 45, 0], // right obstacle
      // coin rects
      ['coinRect', 100, 525, 45, 0],
      ['coinRect', 100 + coinSize * 12, 465, 45, 0],
      ['coinRect', 100 + coinSize * 16, 345, 45, 0],
      ['coinRect', 100 + coinSize * 18, 285, 45, 0],
      ['coinRect', 100 + coinSize * 22, 255, 45, 0],
    ],
    [
      // chunk 1: simple small coin group
      ['obstacle', 50, 525, 0, 0], // left obstacle
      ['obstacle', 350, 300, 315, 0], // right obstacle
      ['coinRect', 0, 300, 7, 3], // top 3x7 coin group
      ['coinRect', 300, 500, 7, 3], // bottom 3x7 coin group
    ],
    [
      // chunk 2: coin streak
      ['obstacle', 0, 525, 315, 0], // left obstacle
      ['obstacle', 500, 320, 45, 0], // right obstacle
      // line of coins
      ['coinRect', 250, 475, 8, 2], // streak 1
      ['coinRect', 250 + 16 * coinSize, 450, 8, 2], // streak 2
      ['coinRect', 250 + 32 * coinSize, 425, 8, 2], // streak 3
      // ['coinRect', 250 + 48 * coinSize, 450, 8, 1],   // streak 4
      // ['coinRect', 250 + 64 * coinSize, 475, 8, 1]    // streak 5
    ],
    [
      // chunk 3: two diagonals
      ['obstacle', 0, 275, 315, 0],
      ['obstacle', 500, 525, 45, 0],
      ['coinHeart', 200, 400, false], // streak 5
      // (to add coins here)
    ],
    [
      // chunk 4: zig-zag
      ['coinHeart', 40, 245, false],
      ['obstacle', 100, 525, 0, 0],
      ['coinHeart', 340, 575, true],
      ['obstacle', 400, 275, 0, 0],
      ['coinHeart', 640, 245, false],
      ['obstacle', 700, 525, 0, 0],
    ],
    [
      // chunk 5: zig-zag
      ['coinHeart', 140, 575, true],
      ['coinHeart', 390, 250, false],
      ['coinHeart', 640, 575, true],
      ['obstacle', 0, 525, 0, 0],
      ['obstacle', 200, 275, 0, 0],
      ['obstacle', 450, 525, 0, 0],
      ['obstacle', 700, 275, 0, 0],
    ],
    [
      // chunk 6: floor and ceiling 1
      ['obstacle', 0, 525, 90, 0],
      ['obstacle', 0, 275, 90, 0],
      ['obstacle', 400, 575, 90, 0],
      ['obstacle', 400, 225, 90, 0],
      ['coinHeart', 160, 350, false],
    ],
    [
      // chunk 7: floor and ceiling 2
      ['obstacle', 0, 575, 90, 0],
      ['obstacle', 0, 225, 90, 0],
      ['obstacle', 400, 525, 90, 0],
      ['obstacle', 400, 275, 90, 0],
      ['coinHeart', 160, 350, false],
    ],
    [
      // chunk 8: skill check
      ['obstacle', 200, 250, -45, -1],
      ['obstacle', 200, 550, 45, 1],
      ['coinRect', 0, 375, 19, 3],
    ],
    [
      // chunk 9: skill check 2.0
      ['coinRect', 0, 200, 19, 3],
      ['coinRect', 0, 550, 19, 3],
      ['obstacle', 100, 400, -45, -1],
      ['obstacle', 400, 400, -45, -1],
    ],
    [
      // chunk 10: single laser greed
      ['obstacle', 300, 400, -45, 1],
      ['coinRect', 0, 375, 7, 3],
    ],
    [
      // chunk 11: the power of human greed
      ['obstacle', 200, 300, 90, 0],
      ['obstacle', 400, 500, 0, 0],
      ['coinRect', 30, 425, 9, 3],
    ],
    [
      // chunk 12: the reverse power of human greed
      ['obstacle', 200, 400, 90, 0],
      ['obstacle', 500, 300, 0, 0],
      ['coinRect', 120, 250, 9, 3],
    ],
    [
      // chunk 13: greed v3
      ['obstacle', 200, 450, 90, 0],
      ['obstacle', 400, 250, 0, 0],
      ['coinRect', 0, 250, 11, 5],
    ],
    [
      // chunk 14: 45 up
      ['obstacle', 0, 300, -45, 0],
      ['obstacle', 325, 525, -45, 0],
      ['coinRect', 17.5, 525, 2, 2],
      ['coinRect', 17.5 + coinSize * 4, 525 - coinSize * 4, 2, 2],
      ['coinRect', 17.5 + coinSize * 8, 525 - coinSize * 8, 2, 2],
      ['coinRect', 17.5 + coinSize * 12, 525 - coinSize * 12, 2, 2],
      ['coinRect', 17.5 + coinSize * 16, 525 - coinSize * 16, 2, 2],
    ],
    [
      // chunk 15: 45 down
      ['obstacle', 0, 525, 45, 0],
      ['obstacle', 325, 300, 45, 0],
      ['coinRect', 17.5, 285, 2, 2],
      ['coinRect', 17.5 + coinSize * 4, 285 + coinSize * 4, 2, 2],
      ['coinRect', 17.5 + coinSize * 8, 285 + coinSize * 8, 2, 2],
      ['coinRect', 17.5 + coinSize * 12, 285 + coinSize * 12, 2, 2],
      ['coinRect', 17.5 + coinSize * 16, 285 + coinSize * 16, 2, 2],
    ],
    [
      // chunk 16: fly over
      ['obstacle', 50, 350, 45, 0],
      ['coinRect', 0, 200, 7, 2],
      ['coinRect', 210, 260, 7, 2],
      ['obstacle', 550, 250, 0, 0],
      ['coinRect', 630, 450, 7, 2],
      ['coinRect', 840, 390, 7, 2],
      ['obstacle', 890, 520, 45, 0],
    ],
    [
      // chunk 17: protractor
      ['obstacle', 50, 250, 0, 0],
      ['obstacle', 300, 400, 45, 0],
      ['coinHeart', 150, 250, false],
      ['obstacle', 550, 600, 90, 0],
      ['coinHeart', 350, 420, false],
    ],
    [
      // chunk 18: reverse protractor
      ['obstacle', 50, 600, 90, 0],
      ['obstacle', 300, 400, -45, 0],
      ['coinHeart', 150, 550, true],
      ['obstacle', 550, 250, 0, 0],
      ['coinHeart', 350, 380, true],
    ],
    [
      // chunk 19: coin rect wave
      ['obstacle', 0, 550, 0, 0],
      ['coinRect', 0, 350, 2, 2],
      ['coinRect', 60, 380, 2, 2],
      ['coinRect', 120, 410, 2, 2],
      ['coinRect', 180, 440, 2, 2],
      ['coinRect', 240, 440, 2, 2],
      ['coinRect', 300, 410, 2, 2],
      ['coinRect', 360, 380, 2, 2],
      ['coinRect', 420, 350, 2, 2],
      ['coinRect', 480, 320, 2, 2],
      ['coinRect', 540, 290, 2, 2],
      ['coinRect', 600, 260, 2, 2],
      ['obstacle', 660, 550, 0, 0],
      ['coinRect', 660, 260, 2, 2],
      ['coinRect', 720, 290, 2, 2],
      ['coinRect', 780, 320, 2, 2],
      ['coinRect', 840, 350, 2, 2],
      ['coinRect', 900, 380, 2, 2],
      ['coinRect', 960, 410, 2, 2],
      ['coinRect', 1020, 440, 2, 2],
    ],
    [
      // chunk 20: coin heart wave
      ['obstacle', 75, 550, 45, 1],
      ['coinHeart', 0, 380, true],
      ['obstacle', 255, 250, 45, 1],
      ['coinHeart', 180, 380, false],
      ['obstacle', 435, 550, 45, 1],
      ['coinHeart', 360, 380, true],
      ['obstacle', 615, 250, 45, 1],
      ['coinHeart', 540, 380, false],
      ['coinHeart', 720, 380, true],
    ],
    [
      // chunk 21: go through hoop
      ['obstacle', 0, 300, 90, 0],
      ['obstacle', 300, 450, 90, 0],
      ['coinRect', 0, 550, 18, 2],
      ['coinRect', 60, 490, 2, 2],
      ['coinRect', 90, 430, 2, 2],
      ['coinRect', 120, 370, 2, 2],
      ['coinRect', 150, 310, 2, 2],
      ['coinRect', 210, 280, 12, 3],
    ],
    [
      // chunk 22: chainsaw (hard)
      ['obstacle', 0, 250, 90, 1],
      ['obstacle', 300, 550, 90, 2],
      ['obstacle', 600, 250, 45, 4],
      ['obstacle', 900, 550, 135, 2],
      ['obstacle', 1200, 250, 0, 3],
      ['coinRect', 50, 375, 36, 2],
      ['coinHeart', 1140, 345, false],
    ],
    [
      // chunk 23: pillars
      ['obstacle', 100, 200, 90, 0],
      ['obstacle', 100, 600, 90, 0],
      ['coinRect', 70, 260, 3, 10],
      ['obstacle', 400, 400, 90, 0],
      ['obstacle', 400, 250, 45, 1],
      ['obstacle', 700, 200, 90, 0],
      ['obstacle', 700, 600, 90, 0],
      ['coinRect', 670, 260, 3, 10],
      ['obstacle', 1000, 400, 90, 0],
      ['obstacle', 1000, 550, 45, 1],
      ['obstacle', 1300, 200, 90, 0],
      ['obstacle', 1300, 600, 90, 0],
      ['coinRect', 1270, 260, 3, 10],
    ],
    [
      // chunk 24: wave 1
      ['obstacle', 100, 550, 45, 0],
      ['obstacle', 250, 400, 45, 0],
      ['obstacle', 700, 250, -45, 0],
      ['obstacle', 850, 400, -45, 0],
      ['coinHeart', 400, 400, true],
      ['coinHeart', 550, 400, false],
    ],
    [
      // chunk 25: wave 2
      ['obstacle', 100, 250, -45, 0],
      ['obstacle', 250, 400, -45, 0],
      ['obstacle', 700, 550, 45, 0],
      ['obstacle', 850, 400, 45, 0],
      ['coinHeart', 400, 400, false],
      ['coinHeart', 550, 400, true],
    ],
  ];

  function preload() {
    for (const i of menuAssets) {
      i.img = loadImage(i.link);
    }
    for (const i of gameAssets) {
      i.img = loadImage(i.link);
    }
    for (const i of instructionsAssets) {
      i.img = loadImage(i.link);
    }
    font = loadFont('./fonts/Filepile.otf');
    font2 = loadFont('./fonts/DMSans-Bold.ttf');
    song = new Audio('./music/music.mp3');
    song.autoplay = true;
    song.loop = true;
    song.volume = 0.25;
  }

  function setup() {
    createCanvas(1152, 768);
    frameRate(60);
    textFont(font2);
    startGame();
    const m = localStorage.getItem('music');
    if (m == 'Y') music = true;
    if (m == 'N') music = false;
  }

  // resetting the speed, making a new map
  function startGame() {
    allSprites.removeAll();
    frame = 0;
    delay = 100;
    paused = false;
    scoreOutput = 0;

    // resetting the player's coordinates
    player = new Sprite(143, 400, 65, 65, 'd');
    player.velocity.y = 0;
    player.velocity.x = 0;
    player.internalVelocity = createVector(0, 0);
    player.rotationLock = true;
    player.strokeWeight = 0;
    player.time = 0;

    player.draw = () => {
      if (movement == 0) {
        if (floor(distanceTravelled / 100) % 2 == 1) {
          image(gameAssets[2].img, 0, 0, 56, 65);
        } else {
          image(gameAssets[3].img, 0, 0, 56, 65);
        }
      } else if (movement == 1) {
        if (player.time >= 0) {
          image(gameAssets[5].img, 0, -5, 85, 81);
        } else {
          image(gameAssets[4].img, 0, -5, 85, 81);
        }
      } else if (movement == 2) {
        if (grav) {
          image(gameAssets[6].img, 0, 0, 66, 65);
        } else {
          image(gameAssets[7].img, 0, 0, 66, 65);
        }
      }
    };
    playerState = 0;
    movement = 0;

    lastChunkType = -1;

    boostVector = createVector(0, -1.15);
    jumpBoost = -10;
    gravityVectors = [createVector(0, -0.55), createVector(0, 0.45)];
    grav = true;

    gameSpeed = 7;
    originalGameSpeed = 7;
    graphY = 1;
    distanceTravelled = 0;
    movementIsHeld = false;
    slowDown = 240;
    coinTurn = 0;

    currentBiome = int(random(0, 5));
    currentBiomeLength = int(random(5, 7));
    nextPowerup = 1;
    // nextPowerup = int(random(7, 11));

    obstacles = new Group();
    coins = new Group();
    walls = new Group();
    arrows = new Group();
    powerups = new Group();

    obstacles.removeAll();
    coins.removeAll();
    arrows.removeAll();
    powerups.removeAll();
    walls.removeAll();

    new walls.Sprite(0, floorY + 40 / 2, width, 10, 's').draw = function () {};
    new walls.Sprite(0, ceilingY - player.height / 2, width, 10, 's').draw =
      function () {};

    // background
    bgs = new Group();
    addBg(0, 0, -6, -5);
    addBg(1, 0, -5.5, -4);
    addBg(2, 0, -4.5, -3);
    addBg(3, 0, -3.5, -2);
    addBg(4, 0, -2.5, -1);
    addBg(5, 200, -5, 0, 0.15);
    addBg(6, 275, -5, 0, 0.13, 300);
    addBg(7, 375, -5, 0, 0.05, 900);
    addBg(7, 200, -5, 0, 0.05, 500);
    addBg(8, 240, -5, 0, 0.1, 800);
  }

  function addBg(type, y, speed, z, scale, x = 0) {
    bg = new Sprite(x, y, 'n');
    bg.img = gameAssets[type + 11].img;
    if (scale != undefined) {
      bg.width *= scale;
      bg.height *= scale;
    }
    bg.internalVelocity = createVector(speed, 0);
    bg.layer = z;
    bg.visible = false;
    bgs.add(bg);
  }

  function applyForce(sprite, vec) {
    sprite.internalVelocity.add(vec);
  }

  // each time a change is made to the player's movement - depends on the movement type
  function changePlayerPosition() {
    if (playerState < 0 || movement != 2) grav = true;
    if (playerState == -1) {
      player.internalVelocity.x = -gameSpeed;
      applyForce(player, gravityVectors[int(grav)]);
    } else if (playerState == 1) {
      // paused
    } else {
      player.y = min(max(ceilingY, player.y), floorY);
      if (movement == 0) {
        if (player.y == ceilingY || player.y == floorY)
          player.internalVelocity.y = 0;
        // default jetpack movement

        if (movementIsHeld) {
          player.internalVelocity.add(boostVector);
        }
        player.internalVelocity.y = min(
          max(playerJetpackMovementChangeFloor, player.internalVelocity.y),
          playerJetpackMovementChangeCeiling,
        );
      } else if (movement == 1) {
        if (player.y == ceilingY) player.internalVelocity.y = 0;
        player.internalVelocity.y = min(
          player.internalVelocity.y,
          playerJetpackMovementChangeCeiling,
        );
      } else {
        if (player.y == ceilingY || player.y == floorY)
          player.internalVelocity.y = 0;
        player.internalVelocity.y = min(
          max(playerJetpackMovementChangeFloor, player.internalVelocity.y),
          playerJetpackMovementChangeCeiling,
        );
      }
      applyForce(player, gravityVectors[int(grav)]);
    }
    player.velocity = player.internalVelocity.mult(int(playerState != 1));
  }

  function parseChunk(args) {
    for (let obs = 0; obs < args.length; obs++) {
      parseObs(args[obs]);
    }
  }

  function parseObs(arg) {
    args = [...arg];
    const type = args[0];
    args.shift();
    if (type == 'obstacle') {
      ob(args);
    } else if (type == 'coinRect') {
      makeCoinGroupRect(...args);
    } else if (type == 'coinHeart') {
      makeCoinGroupHeart(...args);
    } else if (type == 'arrow') {
      addArrow(...args);
    }
  }

  // chunkType is the type of chunk being added - sets to a random number from 1 to totalChunkTypes
  // chunkType = int(random(1, totalChunkTypes + 1))
  function addChunk(chunkType = int(random(1, totalChunkTypes + 1))) {
    // the parameters for adding new obstacles are: xLevel, yLevel, rotation, rotationSpeed
    // yLevel ranges from 275 to 525 for standing upright
    while (chunkType == lastChunkType)
      chunkType = int(random(1, totalChunkTypes + 1));
    lastChunkType = chunkType;
    parseChunk(chunks[chunkType]);
  }

  function addArrow(yLevel, fuseTimer, chaseSpeed) {
    arrows.add(makeArrow(yLevel, fuseTimer, chaseSpeed));
  }

  function addPowerup() {
    powerups.add(makePowerup(int(random(1, 3))));
  }

  function handleObjects() {
    handleArrows();

    // making coins turn
    coinTurn = floor(frame / 10) % 4;

    powerups.cull(50, (powerup) => {
      if (powerup.x <= offscreen) powerup.remove();
    });
    obstacles.cull(50, (obs) => {
      if (obs.x <= offscreen) obs.remove();
    });
    coins.cull(50, (coin) => {
      if (coin.x <= offscreen) coin.remove();
    });
    arrows.cull(50, (arrow) => {
      if (arrow.x <= offscreen) arrow.remove();
    });
    if (arrows.length > 5) {
      arrows[arrows.length - 1].remove();
    }
    if (coins.length > 300) {
      coins[coins.length - 1].remove();
    }
    if (obstacles.length > maximumObstacles) {
      obstacles[obstacles.length - 1].remove();
    }
    if (powerups.length > 1) {
      powerups[powerups.length - 1].remove();
    }

    if (!paused) {
      for (let s = 0; s < allSprites.length; s++) {
        allSprites[s].x -= gameSpeed;
      }
      player.x += gameSpeed;
      for (let p = 0; p < powerups.length; p++) {
        powerups[p].x -= gameSpeed * 0.25;
      }
      for (let b = 0; b < bgs.length; b++) {
        bgs[b].x -= bgs[b].internalVelocity.x * graphY;
      }
    }
    for (let i = 0; i < obstacles.length; i++) {
      obstacles[i].rotationSpeed =
        obstacles[i].internalRotationSpeed * int(!paused);
    }
  }

  // functions for making coin groups
  function makeCoinGroupRect(coinGroupX, coinGroupY, columns, rows) {
    for (let i = 0; i < rows; i++) {
      for (let j = 0; j < columns; j++) {
        coins.add(
          makeCoin(
            coinGroupX + coinSize * 2 * j,
            coinGroupY + coinSize * 2 * i,
          ),
        );
      }
    }
  }

  function makeCoinGroupHeart(coinGroupX, coinGroupY, flipped) {
    const heartColumns = [2, 4, 4, 4, 2];
    const heartYOffsets = [1, 0, 1, 0, 1];

    for (let i = 0; i < heartColumns.length; i++) {
      for (let j = 0; j < heartColumns[i]; j++) {
        coins.add(
          makeCoin(
            coinGroupX + 2 * coinSize * i,
            coinGroupY +
              (heartYOffsets[i] + j) * 2 * coinSize * (flipped ? -1 : 1),
          ),
        );
      }
    }
  }

  function makeCoin(x, y) {
    const spr = new Sprite(width + x, y, coinSize, 'n');

    // how this sprite will be drawn
    spr.draw = () => {
      image(gameAssets[8].img, 0, 0, 30, 30);
    };

    return spr;
  }

  function ob(params) {
    obstacles.add(makeObstacle(...params));
  }

  function makeObstacle(xLevel, yLevel, rotationType, rotationSpeed) {
    // xLevel is just how much the game has moved so far, yLevel is the y-coordinate that this obstacle spawns on
    const thisObstacleSprite = new Sprite(width + xLevel, yLevel, 30, 150, 'k');
    thisObstacleSprite.draw = () => {
      push();
      rotate(90);
      image(gameAssets[9].img, 0, 0, 160, 35);
      pop();
    };
    thisObstacleSprite.rotation = rotationType;
    thisObstacleSprite.internalRotationSpeed = rotationSpeed;
    thisObstacleSprite.strokeWeight = 1;
    thisObstacleSprite.internalVelocity = createVector(0, 0);
    thisObstacleSprite.internalVelocity.x = -gameSpeed;
    thisObstacleSprite.stroke = color(0);
    return thisObstacleSprite;
  }

  // xOffset: how far out | yLevel: the level it starts out at | fuseTimer: the amount of frames before it launches itself
  function makeArrow(yLevel, fuseTimer = 180, chaseSpeed = gameSpeed / 3) {
    const thisArrowSprite = new Sprite(width - 50, yLevel, 15, 30, 'k');
    thisArrowSprite.timer = fuseTimer;
    thisArrowSprite.internalVelocity = createVector(0, 0);
    thisArrowSprite.internalVelocity.x = -gameSpeed;
    thisArrowSprite.chaseSpeed = chaseSpeed;
    thisArrowSprite.draw = function () {
      if (thisArrowSprite.timer <= 0) {
        push();
        rotate(-90);
        image(
          gameAssets[1].img,
          0,
          0,
          gameAssets[1].img.width * 3,
          gameAssets[1].img.height * 3,
        );
        pop();
      } else if (thisArrowSprite.timer <= arrowFreezeTime) {
        image(
          gameAssets[0].img,
          0,
          0,
          gameAssets[0].img.width * 1.5,
          gameAssets[0].img.height * 1.5,
        );
      } else {
        image(gameAssets[0].img, 0, 0);
      }
    };
    return thisArrowSprite;
  }

  function makePowerup(powerupType) {
    const thisPowerupSprite = new Sprite(width + 100, 400, 70, 70, 'n');
    thisPowerupSprite.draw = () => {
      image(gameAssets[10].img, 0, 0, 70, 70);
    };
    thisPowerupSprite.strokeWeight = 1;
    thisPowerupSprite.stroke = color(0);
    thisPowerupSprite.sinWave = random(5);
    thisPowerupSprite.internalVelocity = createVector(0, 0);
    thisPowerupSprite.internalVelocity.x = -gameSpeed;
    thisPowerupSprite.powerupType = powerupType;
    return thisPowerupSprite;
  }

  function handleArrows() {
    for (let i = 0; i < arrows.length; i++) {
      arrows[i].timer--;
      if (arrows[i].timer <= 0) {
        arrows[i].internalVelocity.x = -gameSpeed * 2.5;
        arrows[i].width = gameAssets[1].img.height * 2.5;
        arrows[i].height = gameAssets[1].img.width * 2.5;
      } else if (arrows[i].timer > arrowFreezeTime) {
        if (abs(player.y - arrows[i].y) <= arrows[i].chaseSpeed)
          arrows[i].y = player.y;
        else if (player.y < arrows[i].y) {
          arrows[i].y -= arrows[i].chaseSpeed;
        } else if (player.y > arrows[i].y) {
          arrows[i].y += arrows[i].chaseSpeed;
        }
      }
    }
  }

  function handlePowerups() {
    for (let i = 0; i < powerups.length; i++) {
      // moves it closer to plaayer
      powerups[i].internalVelocity.x = -gameSpeed * 0.45;
      powerups[i].sinWave += 0.05;

      // moves it up and down
      powerups[i].y = Math.sin(powerups[i].sinWave) * 125 + 400;
    }
  }

  function generateObstacle(type, params = [0, 0]) {
    const thisObstacleSprite = new Sprite(
      width + int(random(1, 6)) * 150 + params[0], // x
      200 + int(random(0, 10)) * 50 + params[1], // y
      30, // width
      150, // height
      'k',
    ); // body type

    thisObstacleSprite.rotation = type * 45;
    if (type == 0) {
      thisObstacleSprite.rotationSpeed = -0.75;
    } else if (type == 1) {
      thisObstacleSprite.rotationSpeed = 0.75;
    }
    return thisObstacleSprite;
  }

  function handlePlayer() {
    if (player.collides(obstacles) || player.collides(arrows)) {
      if (movement > 0) {
        movement = 0;
        slowDown = 0;
        obstacles.removeAll();

        // prevents an overlapping chunk over pre-existing coins
        if (obstacles.length == 0 && coins.length == 0) {
          obstacles.add(
            generateObstacle(coins[coins.length - 1].x + 200, [0, -69420]),
          );
        }
      } else {
        playerState = -1;
        gameOver();
      }
    }

    if (player.x < offscreen) {
      gameOver();
    }

    // checking for coin collision - we loop backwards to avoid skipping over some elements
    for (let i = coins.length - 1; i >= 0; i--) {
      // closest point between the rectangle and the circle
      const closestX = min(
        player.x + player.width / 2,
        max(player.x - player.width / 2, coins[i].x),
      );
      const closestY = min(
        player.y + player.height / 2,
        max(player.y - player.height / 2, coins[i].y),
      );

      // if the player's rectangle collides with the ith coin
      const distanceFromPlayer = sqrt(
        pow(coins[i].x - closestX, 2) + pow(coins[i].y - closestY, 2),
      );

      if (distanceFromPlayer <= coinSize / 2) {
        scoreOutput += (1 + movement * 2) * 100;
        coins[i].remove();
      }
    }

    // checking for collision with any powerups
    for (let i = 0; i < powerups.length; i++) {
      const optimalX = max(
        player.x - player.width / 2,
        min(powerups[i].x - 30, player.x + player.width / 2),
      );
      const optimalY = max(
        player.y - player.height / 2,
        min(powerups[i].y - 45, player.y + player.height / 2),
      );

      // if it collides
      if (
        powerups[i].x - 30 <= optimalX &&
        optimalX <= powerups[i].x + 30 &&
        powerups[i].y - 45 <= optimalY &&
        optimalY <= powerups[i].y + 45
      ) {
        originalGameSpeed = gameSpeed;
        slowDown = 0;
        player.internalVelocity.x = 0;
        player.x = 150;
        movement = int(random(1, 3));
        powerups[i--].remove();
        movementIsHeld = false;
      }
    }
    if (slowDown > 0) {
      ellipseMode(CENTER);
      noFill();
      strokeWeight(15);
      stroke(255);
      circle(150, 375, slowDown * 60);
      strokeWeight(150);
      stroke(
        255 * int(movement < 2),
        255 * ((4 - int(movement == 1)) / 4),
        255 * int(movement != 1),
        191,
      );
      circle(150, 375, slowDown * 60 - 100);
      if (slowDown < 90) {
        textFont(font);
        textAlign(LEFT, TOP);
        stroke(0);
        strokeWeight(2);
        text(
          movement == 2
            ? 'Gravity Wings'
            : movement == 1
              ? 'Massive Wings'
              : '',
          160,
          375,
        );
      }
    }
    textFont(font2);
  }

  // oh boy this is gonna be hard... slows down then speeds up the screen on item pickup and destruction
  function slowDownGame() {
    graphY = pow(slowDown - 60.0, 2.0) / 14400.0;
    gameSpeed = originalGameSpeed * graphY;
    slowDown++;
  }

  function mouseClicked() {
    // main menu
    if (scene == 0) {
      if (playerState == 0 && scene == 0) {
        // starting the game
        if (collidePointRect(mouseX, mouseY, 444, 496, 270, 72)) {
          scene = 1;
          movementIsHeld = false;
          startGame();

          if (music) {
            song.play();
          }
        }

        // instructions
        if (collidePointRect(mouseX, mouseY, 24, 24, 72, 84)) {
          scene = 2;
        }

        // settings
        if (collidePointRect(mouseX, mouseY, 120, 24, 72, 84)) {
          scene = 3;
        }
      }
      playerState = 0;
    }
    // game
    if (scene == 1) {
      // pause menu buttons
      if (paused) {
        if (collidePointRect(mouseX, mouseY, width / 2 - 150, 180, 300, 100)) {
          paused = false;
          playerState = 0;
          movementIsHeld = false;
          // --------------------------------------------------------------------- ADD CODE FOR RESUMING
        }
        if (collidePointRect(mouseX, mouseY, width / 2 - 150, 330, 300, 100)) {
          paused = false;
          scene = 1;
          playerState = 0;
          movementIsHeld = false;
          startGame();
          // --------------------------------------------------------------------- ADD CODE FOR RESTARTING
        }
        if (collidePointRect(mouseX, mouseY, width / 2 - 150, 480, 300, 100)) {
          paused = false;
          scene = 0;
          playerState = 0;
          movementIsHeld = false;
          // --------------------------------------------------------------------- CHECK CODE FOR END GAME AND SAVE
        }
      }
    }
    // instructions
    if (scene == 2) {
      textFont(font2);
      // back button
      if (
        collidePointRect(
          mouseX,
          mouseY,
          width / 4 - 125,
          height / 4 - 95,
          75,
          75,
          12,
        )
      ) {
        scene = 0;
      }

      // back slide
      if (instructionslide != 0) {
        if (
          collidePointRect(
            mouseX,
            mouseY,
            width / 2 - 385,
            height / 2 + 185,
            250,
            100,
            12,
          )
        ) {
          instructionslide--;
        }
      }

      // forward slide
      if (instructionslide != 7) {
        if (
          collidePointRect(
            mouseX,
            mouseY,
            width / 2 + 135,
            height / 2 + 185,
            250,
            100,
            12,
          )
        ) {
          instructionslide++;
        }
      }
    }
    // settings
    if (scene == 3) {
      // buttons - music
      if (
        collidePointRect(
          mouseX,
          mouseY,
          width / 2 + 220,
          height / 4 + 72,
          150,
          75,
          40,
        )
      ) {
        music = !music;

        if (music) {
          song.play();
        } else {
          song.pause();
        }
      }

      // extra romance
      if (
        collidePointRect(
          mouseX,
          mouseY,
          width / 2 + 220,
          height / 4 + 222,
          150,
          75,
          40,
        )
      ) {
        extraromance = !extraromance;
      }

      // secret setting
      if (
        collidePointRect(
          mouseX,
          mouseY,
          width / 2 + 220,
          height / 4 + 372,
          150,
          75,
          40,
        )
      ) {
        secretsetting = !secretsetting;
      }

      // back button
      if (
        collidePointRect(
          mouseX,
          mouseY,
          width / 4 - 125,
          height / 4 - 95,
          75,
          75,
          12,
        )
      ) {
        scene = 0;
      }
    }
  }

  function release(kb = false) {
    // game
    if (scene == 1) {
      if (!paused) {
        if (!kb && collidePointRect(mouseX, mouseY, 20, 20, 70, 70)) {
          pause();
          return;
        }
        // different movements
        if (movement == 0) {
          // normal jetpack
          movementIsHeld = false;
        } else if (movement == 1) {
          movementIsHeld = false;
        } else if (movement == 2) {
          grav = !grav;
        }
      }
    }
    // game over
    else if (scene == -1) {
      scene = 0;
      loop();
    }
  }

  function draw() {
    player.visible = scene == 1;

    if (window.matchMedia('(orientation: portrait)').matches) {
      document
        .getElementsByTagName('body')[0]
        .getElementsByTagName('p')[0].hidden = false;
    } else {
      document
        .getElementsByTagName('body')[0]
        .getElementsByTagName('p')[0].hidden = true;
    }
    // main menu
    if (scene == 0) {
      // background
      image(menuAssets[0].img, 0, 0, 1152, 768);

      // instructions
      if (collidePointRect(mouseX, mouseY, 24, 24, 72, 84))
        image(menuAssets[5].img, 24, 24, 72, 84);
      else image(menuAssets[1].img, 24, 24, 72, 84);

      // settings
      if (collidePointRect(mouseX, mouseY, 120, 24, 72, 84))
        image(menuAssets[6].img, 120, 24, 72, 84);
      else image(menuAssets[2].img, 120, 24, 72, 84);

      // starting the game
      if (collidePointRect(mouseX, mouseY, 444, 496, 270, 72))
        image(menuAssets[8].img, 438, 486, 280, 72 * 1.05);
      else image(menuAssets[4].img, 444, 496, 264, 72);
    }
    // game
    else if (scene == 1) {
      if (playerState == -1) {
        gameOver();
        return;
      }

      // draws the background
      for (let i = 0; i < bgs.length; i++) {
        imageMode(CORNER);
        image(bgs[i].img, bgs[i].x, bgs[i].y, bgs[i].width, bgs[i].height);
        image(
          bgs[i].img,
          bgs[i].x + bgs[i].img.width,
          bgs[i].y,
          bgs[i].width,
          bgs[i].height,
        );
        if (bgs[i].x <= -max(width, bgs[i].img.width)) {
          bgs[i].x += max(width, bgs[i].img.width);
        }
      }

      fill(0);
      rectMode(CORNER);
      rect(0, 0, 1152, ceilingY - player.height / 2);
      rect(0, floorY + player.height / 2, 1152, height - floorY);

      for (let i = 0; i < obstacles.length; i++) {
        obstacles[i].draw();
      }
      for (let i = 0; i < coins.length; i++) {
        coins[i].draw();
      }
      for (let i = 0; i < arrows.length; i++) {
        arrows[i].draw();
      }
      for (let i = 0; i < powerups.length; i++) {
        powerups[i].draw();
      }
      player.draw();

      // paused state
      if (playerState != 0) {
        changePlayerPosition();
      } else if (playerState == 0) {
        // drawing the character
        if (slowDown <= 180) {
          // in the state of being slowed down
          slowDownGame();
          changePlayerPosition();
        } else {
          // no longer being slowed down
          gameSpeed = originalGameSpeed;
          changePlayerPosition();
        }
        // moves the game along
        distanceTravelled += gameSpeed;
        player.time--;
        scoreOutput += gameSpeed;

        stroke(0);
        strokeWeight(2);

        // stop getting pushed by the powerups
        if (playerState == 0) player.x = 150;

        rectMode(CORNER);
        handlePowerups();
        handlePlayer();
      }
      handleObjects();
      // current game stats
      if (scene != -1) {
        stroke(255);
        strokeWeight(0);
        textAlign(LEFT, TOP);
        textSize(40);
        fill(0);
        text(scoreOutput, 950, 100);
        fill(217, 176, 28);
        text(scoreOutput, 952, 102);
        fill(0);
        text('MULTI', 725, 100);
        fill(217, 176, 28);
        text('MULTI', 727, 102);
        push();
        translate(330, 100 - movement * 10);
        rotate(5 * movement);
        textSize(40 + 10 * movement);
        stroke(0);
        strokeWeight(movement);
        fill(0);
        text('x' + (1 + movement * 2), 530, -45 * movement);
        fill(217, 176, 28);
        text('x' + (1 + movement * 2), 532, -45 * movement);
        pop();
      }

      if (paused) {
        textAlign(CENTER, CENTER);
        fill(0, 0, 0, 100);
        rectMode(CORNER);
        rect(0, 0, 1152, 768);
        strokeWeight(4);
        stroke(buttonstroke);
        rectMode(CENTER);
        fill(buttonfill);
        rect(width / 2, height / 2, 500, 500, 12);
        rectMode(CORNER);

        // save and exit
        if (collidePointRect(mouseX, mouseY, width / 2 - 150, 480, 300, 100))
          fill(buttonhover);
        else fill(buttonfill);
        rect(width / 2 - 200, 480, 400, 100, 12);

        // save and restart
        if (collidePointRect(mouseX, mouseY, width / 2 - 150, 330, 300, 100))
          fill(buttonhover);
        else fill(buttonfill);
        rect(width / 2 - 200, 330, 400, 100, 12);

        // resume
        if (collidePointRect(mouseX, mouseY, width / 2 - 150, 180, 300, 100))
          fill(buttonhover);
        else fill(buttonfill);
        rect(width / 2 - 200, 180, 400, 100, 12);

        rectMode(CENTER);
        fill(buttonstroke);
        noStroke();
        textSize(30);
        text('Resume', width / 2, 227);
        text('Save and Restart', width / 2, 377);
        text('Save and Exit', width / 2, 527);
        noStroke();
        textAlign(LEFT, TOP);
      } else if (playerState != -1) {
        strokeWeight(4);
        stroke(buttonstroke);
        if (collidePointRect(mouseX, mouseY, 20, 20, 70, 70)) fill(buttonhover);
        else fill(buttonfill);
        rectMode(CORNER);
        rect(20, 20, 70, 70, 12);
        strokeWeight(12);
        line(43, 40, 43, 70);
        line(67, 40, 67, 70);
      }

      frame++;
      gameSpeed = 8 + Math.log2(frame / 60) / 3;

      // when there are no more obstacles, add a chunk (?)
      if (
        (obstacles.length == 0 ||
          coins.length == 0 ||
          max(obstacles[obstacles.length - 1].x, coins[coins.length - 1].x) <
            200) &&
        slowDown >= 180
      ) {
        addChunk();

        // throws in a powerup
        if (nextPowerup <= 0) {
          addPowerup();
          // resetting next powerup
          nextPowerup = int(random(7, 11));
        } else if (movement == 0) {
          nextPowerup--;
        }
      }
    }
    // instructions
    else if (scene == 2) {
      // all buttons are in CORNERS because collidePointRect uses CORNERS
      rectMode(CORNER);
      textAlign(CENTER, CENTER);
      fill(255);
      image(menuAssets[0].img, 0, 0, width, height);

      fill(color(settingscolor1));
      noStroke();
      strokeWeight(4);
      stroke(color(buttonstroke));
      rectMode(CENTER);
      rect(width / 2, height / 2, (3 * width) / 4 + 20, (4 * height) / 5, 24);

      // title box - "instructions"
      rectMode(CORNER);
      rect(width / 2 - 175, height / 4 - 90, 350, 75, 12);

      // next slide and previous slide buttons
      if (instructionslide != 0) {
        if (
          collidePointRect(
            mouseX,
            mouseY,
            width / 2 - 385,
            height / 2 + 185,
            250,
            100,
            12,
          )
        )
          fill(buttonhover);
        else fill(buttonfill);
        rect(width / 2 - 385, height / 2 + 185, 250, 100, 12);
      }
      if (instructionslide != 7) {
        if (
          collidePointRect(
            mouseX,
            mouseY,
            width / 2 + 135,
            height / 2 + 185,
            250,
            100,
            12,
          )
        )
          fill(buttonhover);
        else fill(buttonfill);
        rect(width / 2 + 135, height / 2 + 185, 250, 100, 12);
      }

      // displays which slide it is currently on
      for (let i = 0; i < 8; i++) {
        if (i == instructionslide) fill(color('#ffffff'));
        else fill(buttonfill);
        ellipse(width / 2 - 75 + i * 25, height / 2 + 210, 20, 20);
      }

      // displaying the current instruction slide
      rectMode(CENTER);
      imageMode(CENTER);

      imageMode(CORNERS);
      image(
        instructionsAssets[instructionslide].img,
        width / 2 - 280,
        height / 2 - 180,
        width / 2 + 280,
        height / 2 + 70,
      );

      imageMode(CORNER);
      // text box, popuptext and popupcolor
      fill(popupcolor);
      noStroke();
      rect(width / 2, height / 2 + 110, 550, 100);

      // draws the border
      noFill();
      stroke(buttonstroke);
      strokeWeight(15);
      rect(width / 2, height / 2 - 10, 550, 350, 12);
      strokeWeight(3);

      rectMode(CORNER);

      // back button
      strokeWeight(4);
      stroke(color(buttonstroke));
      if (
        collidePointRect(
          mouseX,
          mouseY,
          width / 4 - 125,
          height / 4 - 95,
          75,
          75,
          12,
        )
      )
        fill(color(settingscolor2));
      else fill(color(settingscolor1));
      rect(width / 4 - 125, height / 4 - 95, 75, 75, 12);

      // text
      noStroke();
      textAlign(CENTER);

      // instructions
      textSize(20);
      fill(popuptext);

      if (instructionslide < 7) {
        text(instructiontext[instructionslide], width / 2, height / 2 + 105);
      } else {
        text(instructiontext[instructionslide], width / 2, height / 2 + 105);
        
      }

      fill(buttonstroke);
      textSize(150);
      textAlign(LEFT);

      textFont(font2);
      // previous and next
      if (instructionslide != 0) {
        text('<', width / 2 - 300, height / 2 + 215);
      }
      if (instructionslide != 7) {
        text('>', width / 2 + 225, height / 2 + 215);
      }

      // back button
      textSize(100);
      text('<', width / 4 - 115, height / 4 - 70);

      textSize(40);
      textFont(font2);
      textAlign(CENTER);
      text('Instructions', width / 2, height / 4 - 60);
    }
    // settings
    else if (scene == 3) {
      // all buttons are in CORNERS because collidePointRect uses CORNERS
      rectMode(CORNER);
      textAlign(CENTER, CENTER);
      image(menuAssets[0].img, 0, 0, width, height);

      fill(color(settingscolor1));
      noStroke();

      strokeWeight(4);
      stroke(color(buttonstroke));

      rectMode(CENTER);
      rect(width / 2, height / 2, (3 * width) / 4 + 20, (4 * height) / 5, 24);
      rectMode(CORNER);

      // title - "settings"
      rect(width / 2 - 147.5, height / 4 - 87.5, 300, 60, 12);

      // back button
      if (
        collidePointRect(
          mouseX,
          mouseY,
          width / 4 - 125,
          height / 4 - 95,
          75,
          75,
          12,
        )
      )
        fill(color(settingscolor2));
      else fill(color(settingscolor1));
      rect(width / 4 - 125, height / 4 - 95, 75, 75, 12);

      // labels
      fill(color(settingscolor1));
      rect(width / 2 - 350, height / 4 + 60, 500, 100, 12);
      rect(width / 2 - 350, height / 4 + 210, 500, 100, 12);
      rect(width / 2 - 350, height / 4 + 360, 500, 100, 12);

      // buttons - music
      if (
        collidePointRect(
          mouseX,
          mouseY,
          width / 2 + 220,
          height / 4 + 72,
          150,
          75,
          40,
        )
      ) {
        if (music) fill(settingscolor4);
        else fill(buttonhover);
      } else {
        if (music) fill(settingscolor3);
        else fill(buttonfill);
      }
      rect(width / 2 + 220, height / 4 + 72, 150, 75, 40);

      // extra romance
      if (
        collidePointRect(
          mouseX,
          mouseY,
          width / 2 + 220,
          height / 4 + 222,
          150,
          75,
          40,
        )
      ) {
        if (extraromance) fill(settingscolor4);
        else fill(buttonhover);
      } else {
        if (extraromance) fill(settingscolor3);
        else fill(buttonfill);
      }
      rect(width / 2 + 220, height / 4 + 222, 150, 75, 40);

      // secret setting
      if (
        collidePointRect(
          mouseX,
          mouseY,
          width / 2 + 220,
          height / 4 + 372,
          150,
          75,
          40,
        )
      ) {
        if (secretsetting) fill(settingscolor4);
        else fill(buttonhover);
      } else {
        if (secretsetting) fill(settingscolor3);
        else fill(buttonfill);
      }
      rect(width / 2 + 220, height / 4 + 372, 150, 75, 40);

      // button sliders - music
      if (music && togglelerp[0] < 1) togglelerp[0] += animationspeed;
      else if (!music && togglelerp[0] > 0) togglelerp[0] -= animationspeed;
      if (music) fill(toggleon);
      else fill(toggleoff);
      noStroke();
      ellipse(
        lerp(width / 2 + 259, width / 2 + 334, togglelerp[0]),
        height / 4 + 110,
        50,
        50,
      );

      // extra romance
      if (extraromance && togglelerp[1] < 1) togglelerp[1] += animationspeed;
      else if (!extraromance && togglelerp[1] > 0)
        togglelerp[1] -= animationspeed;
      if (extraromance) fill(toggleon);
      else fill(toggleoff);
      noStroke();
      ellipse(
        lerp(width / 2 + 259, width / 2 + 334, togglelerp[1]),
        height / 4 + 260,
        50,
        50,
      );

      // secret setting
      if (secretsetting && togglelerp[2] < 1) togglelerp[2] += animationspeed;
      else if (!secretsetting && togglelerp[2] > 0)
        togglelerp[2] -= animationspeed;
      if (secretsetting) fill(toggleon);
      else fill(toggleoff);
      noStroke();
      ellipse(
        lerp(width / 2 + 259, width / 2 + 334, togglelerp[2]),
        height / 4 + 410,
        50,
        50,
      );

      // text
      noStroke();
      fill(buttonstroke);
      textSize(45);
      text('Settings', width / 2, height / 4 - 60);

      textAlign(CENTER);
      textSize(40);
      text('Music', width / 2 - 100, height / 4 + 110);
      text('Extra Romance!', width / 2 - 100, height / 4 + 260);

      textSize(30);
      text('Super Secret Setting', width / 2 - 100, height / 4 + 410);

      // back button
      fill(0);
      textSize(100);
      textAlign(CENTER);
      textFont(font2);
      text('<', width / 4 - 90, height / 4 - 70);
      textFont(font2);
    }
    // game over
    else if (scene == -1) {
    }
  }

  function mousePressed() {
    if (scene == 1 && playerState == 0 && movement == 1) {
      player.internalVelocity.y = jumpBoost;
      player.time = flapTime;
    }
    // death state, reset
    else hold();
  }

  function touchStarted() {
    hold();
    mouseClicked(true);
  }

  function touchReleased() {
    release(true);
  }

  function hold() {
    if (scene == 1) {
      // different movements
      if (movement == 0) {
        // normal jetpack
        movementIsHeld = true;
      } else if (movement == 1) {
        // flappy bird
        if (!movementIsHeld) {
          player.internalVelocity.y = jumpBoost;
          player.time = flapTime;
          movementIsHeld = true;
        }
      }
    }
  }

  function mouseReleased() {
    release();
  }

  function pause() {
    paused = !paused;
    if (playerState >= 0) playerState = (playerState + 1) % 2;
  }

  function keyPressed() {
    if (key == ' ') {
      if (scene == 1 && movement == 1) {
        player.velocity.y = jumpBoost;
        player.time = flapTime;
      }
      hold();
    }
  }

  function keyReleased() {
    if (scene == 0 && key == ' ') {
      startGame();
      scene = 1;
    } else if (scene == -1) {
      scene = 0;
      loop();
    }
    release(true);
  }

  function gameOver() {
    scene = -1;
    powerups.removeAll();
    obstacles.removeAll();
    coins.removeAll();

    paused = false;
    fill(63, 191);
    rectMode(CENTER);
    rect(width / 2, height / 2, width, height);
    imageMode(CORNER);
    image(menuAssets[9].img, 0, 0);
    textAlign(CENTER, CENTER);
    textSize(min(18 * Math.log10(scoreOutput + 10000), 110));
    fill(223, 191, 31);
    stroke(255);
    strokeWeight(2);

    // posts the score onscreen
    textFont(font);
    text(scoreOutput, width / 2, 600);
    scoreOutput = 0;
    noLoop();
    textFont(font2);
  }

  window.onblur = function () {
    if (scene == 1) {
      if (!paused) pause();
      paused = true;
    }
    song.pause();
  };

  window.onfocus = function () {
    if (music) {
      song.play();
    }
  };
}
