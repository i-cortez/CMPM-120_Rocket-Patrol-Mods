class Play extends Phaser.Scene
{
    constructor()
    {
        super("playScene");
    }

    preload()
    {
        // load images/tile sprites
        this.load.image("rocket", "./Assets/rocket.png");
        this.load.image("spaceship", "./Assets/spaceship.png");
        this.load.image("starfield", "./Assets/starfield.png");

        // load spritesheet
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
    } // end preload()

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
    } // end create()

    // generally updates at every frame
    update()
    {
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
            this.ship1.update();
            // update spaceship 2
            this.ship2.update();
            // update spaceship 3
            this.ship3.update();
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
    } // end update()

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
    } // end checkCollision(rocket, ship)
    
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
    } // end shipExplode(ship)
} // end class Play

