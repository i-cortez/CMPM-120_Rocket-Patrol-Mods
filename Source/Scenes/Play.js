class Play extends Phaser.Scene
{
    constructor()
    {
        super("playScene");
    }
    //--------------------------------------------------------------------------
    //--------------------------------------------------------------------------
    //
    preload()
    {
        // load images/tile sprites
        this.load.image("rocket", "./Assets/rocket.png");
        this.load.image("spaceship", "./Assets/spaceship.png");
        this.load.image("fastship", "./Assets/fastShip.png");
        this.load.image("starfield", "./Assets/starfield.png");

        // load spritesheet for explosion animation
        this.load.spritesheet
        (
            "explosion",
            "./Assets/explosion.png",
            {
                frameWidth: 64,
                frameHeight: 32,
                startFrame: 0,
                endFrame: 9
            }
        );
    } 
    //-end preload()------------------------------------------------------------
    //--------------------------------------------------------------------------
    // CREATE
    //--------------------------------------------------------------------------
    //
    create()
    {
        // place tile sprite background
        this.starfield = this.add.tileSprite
        (
            0,
            0,
            640,
            480,
            "starfield"
        ).setOrigin(0, 0);

        // white rectangle borders
        this.add.rectangle(5, 5, 630, 32, 0xffffff).setOrigin(0, 0);
        this.add.rectangle(5, 443, 630, 32, 0xffffff).setOrigin(0, 0);
        this.add.rectangle(5, 5, 32, 455, 0xffffff).setOrigin(0, 0);
        this.add.rectangle(603, 5, 32, 455, 0xffffff).setOrigin(0, 0);

        // green UI background
        this.add.rectangle(37, 42, 566, 64, 0x00ff00).setOrigin(0, 0);

        // add rocket (p1)
        this.p1Rocket = new Rocket
        (
            this,
            game.config.width/2,
            431,
            "rocket",
            0
        ).setScale(0.5, 0.5).setOrigin(0, 0);

        // add spaceship 1
        this.ship1 = new Spaceship
        (
            this,
            game.config.width + 192,
            132,
            "spaceship",
            0,
            30
        ).setOrigin(0, 0);

        // add spaceship 2
        this.ship2 = new Spaceship
        (
            this,
            game.config.width + 96,
            196,
            "spaceship",
            0,
            20
        ).setOrigin(0, 0);

        // add spaceship 3
        this.ship3 = new Spaceship
        (
            this,
            game.config.width,
            260,
            "spaceship",
            0,
            10
        ).setOrigin(0, 0);

        // add fastship 1
        this.fast1 = new Fastship
        (
            this,
            game.config.width + 288,
            324,
            "fastship",
            0,
            50
        ).setOrigin(0, 0);

        // define keys
        keyF = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.F);
        keyLEFT = this.input.keyboard.addKey
        (
            Phaser.Input.Keyboard.KeyCodes.LEFT
        );
        keyRIGHT = this.input.keyboard.addKey
        (
            Phaser.Input.Keyboard.KeyCodes.RIGHT
        );
        keyM = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.M);

        // animation config for ship explosions
        this.anims.create
        (
            {
                key: "explode",
                frames: this.anims.generateFrameNumbers
                (
                    "explosion",
                    {
                        start: 0,
                        end: 9,
                        first: 0
                    }
                ),
                frameRate: 30
            }
        );

        // player score
        this.p1Score = 0;
        // score display
        let scoreConfig =
        {
            fontFamily: "Courier",
            fontSize: "28px",
            backgroundColor: "#f3b141",
            color: "#843605",
            align: "right",
            padding: {top: 5, bottom: 5},
            fixedWidth: 100
        };
        this.scoreLeft = this.add.text(69, 54, this.p1Score, scoreConfig);

        // create a game clock that will countdown until game over
        this.gameClock = game.settings.gameTimer;
        // create an object to populate the text configuration members
        let gameClockConfig =
        {
            fontFamily: "Courier",
            fontSize: "28px",
            backgroundColor: "#f3b141",
            color: "#843605",
            align: "right",
            padding: {top: 5, bottom: 5},
            fixedWidth: 100
        };
        // add the text to the screen
        this.timeLeft = this.add.text
        (
            460, // x-coord
            54, // y-coord
            this.formatTime(this.gameClock), // text to display
            gameClockConfig // text style config object
        );
        // add the event to decrement the clock
        // code adapted from:
        //  https://phaser.discourse.group/t/countdown-timer/2471/3
        this.timedEvent = this.time.addEvent
        (
            {
                delay: 1000,
                callback: () =>
                {
                    this.gameClock -= 1000; 
                    this.timeLeft.text = this.formatTime(this.gameClock);
                },
                scope: this,
                loop: true
            }
        );

        // game over flag
        this.gameOver = false;
        // 60s play clock
        scoreConfig.fixedWidth = 0;
        this.clock = this.time.delayedCall
        (
            game.settings.gameTimer,
            () =>
            {
                this.add.text
                (
                    game.config.width/2,
                    game.config.height/2,
                    "GAME OVER",
                    scoreConfig
                ).setOrigin(0.5);

                this.add.text
                (
                    game.config.width/2,
                    game.config.height/2 + 64,
                    "(F)ire to Restart or (M) for Menu",
                    scoreConfig
                ).setOrigin(0.5);

                this.gameOver = true;
            },
            null,
            this
        );

        // set a timer to change the value of ship speed after
        // half of the game time has elapsed
        this.factor = 1;
        this.upSpeed = this.time.delayedCall
        (
            game.settings.gameTimer/2, // delay
            () => // callback function
            {
                this.factor = 1.5;
            },
            null, // array of args
            this // callback scope
        );
    }
    // end create() ------------------------------------------------------------
    //--------------------------------------------------------------------------
    // UPDATE
    //--------------------------------------------------------------------------
    // generally updates at every frame
    update()
    {
        // when game is over remove the game clock event
        if(this.gameOver) this.time.removeAllEvents();

        // check for key input to restart
        if(this.gameOver && Phaser.Input.Keyboard.JustDown(keyF))
        {
            this.scene.restart(this.p1Score);
        }
        if(this.gameOver && Phaser.Input.Keyboard.JustDown(keyM))
        {
            this.scene.start("menuScene");
        }

        if(!this.gameOver)
        {
            // scroll tile sprite
            this.starfield.tilePositionX -= 4;
            // update rocket
            this.p1Rocket.update();
            // update spaceship 1
            this.ship1.update(this.factor);
            // update spaceship 2
            this.ship2.update(this.factor);
            // update spaceship 3
            this.ship3.update(this.factor);
            // update fastship 1
            this.fast1.update(this.factor);
        }

        // check for collisions
        if(this.checkCollision(this.p1Rocket, this.ship3))
        {
            this.p1Rocket.reset();
            this.shipExplode(this.ship3);
        }

        if(this.checkCollision(this.p1Rocket, this.ship2))
        {
            this.p1Rocket.reset();
            this.shipExplode(this.ship2);
        }

        if(this.checkCollision(this.p1Rocket, this.ship1))
        {
            this.p1Rocket.reset();
            this.shipExplode(this.ship1);
        }

        if(this.checkCollision(this.p1Rocket, this.fast1))
        {
            this.p1Rocket.reset();
            this.shipExplode(this.fast1);
        }
    }
    //-end update()-------------------------------------------------------------
    //--------------------------------------------------------------------------
    // COLLISIONS
    //--------------------------------------------------------------------------
    //
    checkCollision(rocket, ship)
    {
        // simple AABB bounds checking
        if
        (
            rocket.x < ship.x + ship.width &&
            rocket.x + rocket.width > ship.x &&
            rocket.y < ship.y + ship.height &&
            rocket.height + rocket.y > ship.y
        ) return true;

        else return false;
    }
    //-end checkCollision(rocket, ship)-----------------------------------------
    //--------------------------------------------------------------------------
    // EXPLOSION
    //--------------------------------------------------------------------------
    //
    shipExplode(ship)
    {
        ship.alpha = 0; // set ship to be fully transparent
        // create explosion sprite at ships position
        let boom = this.add.sprite(ship.x, ship.y, "explosion").setOrigin(0, 0);
        boom.anims.play("explode"); // play the explode animation
        boom.on
        (
            "animationcomplete", 
            () => 
            {
                ship.reset(); // reset ship position
                ship.alpha = 1; // set ship to be fully visible
                boom.destroy(); // remove explosion sprite
            }
        );
        // score increment and repaint
        this.p1Score += ship.points;
        this.scoreLeft.text = this.p1Score;
        this.sound.play("sfx_explosion");
    }
    //-end shipExplode(ship)----------------------------------------------------
    //--------------------------------------------------------------------------
    // FORMAT TIME
    //--------------------------------------------------------------------------
    // code adapted from:
    //  https://phaser.discourse.group/t/countdown-timer/2471/3
    formatTime(ms)
    {
        let s = ms/1000;
        let min = Math.floor(s/60);
        let seconds = s%60;
        seconds = seconds.toString().padStart(2, "0");
        return `${min}:${seconds}`;
    }
}
// end class Play

