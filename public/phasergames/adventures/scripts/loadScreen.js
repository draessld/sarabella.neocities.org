nextScreen = false

class Load extends Phaser.Scene
{
    constructor ()
    {
        super({ key: 'Load' });
    }

    preload ()
    {
        // Future assets (images, audio) will be loaded here
    }

    create ()
    {
        this.add.text(443, 230, 'Bella Sara Adventures', {
            fontFamily: 'Georgia, serif',
            fontSize: '38px',
            color: '#f0e080',
            stroke: '#2a4a10',
            strokeThickness: 5
        }).setOrigin(0.5);

        this.add.text(443, 295, 'Loading...', {
            fontFamily: 'Arial',
            fontSize: '16px',
            color: '#c8e8a0'
        }).setOrigin(0.5);

        this.time.delayedCall(600, () => {
            this.scene.start('Lobby');
        });
    }
}