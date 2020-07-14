class Rocket extends Phaser.GameObjects.Sprite
{
    constructor(scene, x, y, texture, frame)
    {
        super(scene, x, y, texture, frame);

        // add object to existing scene
        scene.add.existing(this);

        // track the rockets firing status
        this.isFiring = false;
        this.sfxRocket = scene.sound.add("sfx_rocket"); // add rocket sfx
    }

    create()
    {
        
    }

    update()
    {
        // left/right movement
        // if the rocket is firing, movement is not allowed
        // use the pointer as the user movement input
        // code adapted from:
        //  https://phaser.io/examples/v3/view/games/breakout/breakout
        mouse.on
        (
            "pointermove", // event
            (pointer) => // callback
            {
                if(!this.isFiring)
                {
                    this.x = Phaser.Math.Clamp(pointer.x, 47, 578);
                }
            },
            this
        );
       
        // fire button
        if(mouse.activePointer.leftButtonDown() && !this.isFiring) 
        {
          this.isFiring = true;
          this.sfxRocket.play(); // play the rocket sfx
        }
        // if fired, move up
        if(this.isFiring && this.y >= 108) this.y -= 2;
        // reset on miss
        if(this.y <= 108)
        {
            this.isFiring = false;
            this.y = 431;
        }
    }

    // reset rocket 
    reset()
    {
        this.isFiring = false;
        this.y = 431;
    }
}

