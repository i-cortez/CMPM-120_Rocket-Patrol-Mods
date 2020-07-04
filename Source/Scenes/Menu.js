class Menu extends Phaser.Scene
{
    constructor()
    {
        super("menuScene");
    }

    preload()
    {
        // load audio files
        this.load.audio("sfx_select", "./Assets/blip_select12.wav");
        this.load.audio("sfx_explosion", "./Assets/explosion38.wav");
        this.load.audio("sfx_rocket", "./Assets/rocket_shot.wav");
    }

    create()
    {
        // menu display
        let menuConfig =
        {
            fontFamily: "Courier",
            fontSize: "28px",
            backgroundColor: "#f3b141",
            color: "#843605",
            align: "right",
            padding: {top: 5, bottom: 5},
            fixedWidth: 0
        };

        // show menu text
        let centerX = game.config.width/2;
        let centerY = game.config.height/2;
        let textSpacer = 64;

        this.add.text
        (
            centerX,
            centerY - textSpacer,
            "ROCKET PATROL",
            menuConfig
        ).setOrigin(0.5);

        this.add.text
        (
            centerX,
            centerY,
            "Use arrows to move and (F) to fire",
            menuConfig
        ).setOrigin(0.5);

        menuConfig.backgroundColor = "#00C080";
        menuConfig.color = "#000000";
        this.add.text
        (
            centerX,
            centerY + textSpacer,
            "Press (E) for Easy or (H) for Hard",
            menuConfig
        ).setOrigin(0.5);
        
        // define input keys
        keyE = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.E);
        keyH = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.H);

        // this.scene.start("playScene");
    } // end create()

    update()
    {
        if(Phaser.Input.Keyboard.JustDown(keyE))
        {
            // easy mode
            game.settings =
            {
                spaceshipSpeed: 3,
                gameTimer: 60000
            }

            this.sound.play("sfx_select");
            this.scene.start("playScene");
        }

        // hard mode
        if(Phaser.Input.Keyboard.JustDown(keyH))
        {
            game.settings =
            {
                spaceshipSpeed: 4,
                gameTimer: 45000
            }
            this.sound.play("sfx_select");
            this.scene.start("playScene");
        }
    }
}