class Lobby extends Phaser.Scene
{
    constructor ()
    {
        super({ key: 'Lobby' });
    }

    preload () {}

    create ()
    {
        // Background
        const bg = this.add.graphics();
        bg.fillStyle(0x2a5e1e, 1);
        bg.fillRect(0, 0, 886, 460);
        bg.fillStyle(0x1a3d10, 1);
        bg.fillRect(0, 460, 886, 60);

        // Decorative title bar
        bg.fillStyle(0x1a3d10, 1);
        bg.fillRect(0, 0, 886, 75);

        this.add.text(443, 38, 'Bella Sara Adventures', {
            fontFamily: 'Georgia, serif',
            fontSize: '30px',
            color: '#f0e080',
            stroke: '#2a4a10',
            strokeThickness: 4
        }).setOrigin(0.5);

        this.add.text(443, 100, 'Create Your Character', {
            fontFamily: 'Arial',
            fontSize: '18px',
            color: '#d4e8b0'
        }).setOrigin(0.5);

        // Character preview area
        const previewBg = this.add.rectangle(443, 210, 120, 160, 0x1a4a12);
        this.previewBody = this.add.ellipse(443, 220, 36, 54, PLAYER_COLORS[gameState.player.colorIndex]);
        this.previewHead = this.add.circle(443, 183, 18, 0xf5c5a0);
        // Simple hair
        const hair = this.add.graphics();
        hair.fillStyle(0x8b4513, 1);
        hair.fillRect(430, 162, 26, 12);
        hair.fillRect(426, 162, 8, 20);
        hair.fillRect(452, 162, 8, 20);

        // Color picker label
        this.add.text(443, 305, 'Outfit Color', {
            fontFamily: 'Arial',
            fontSize: '13px',
            color: '#d4e8b0'
        }).setOrigin(0.5);

        // Color pickers — 4 circles, centered
        const pickerXPos = [373, 413, 453, 493];
        this.colorPickers = [];

        for (let i = 0; i < PLAYER_COLORS.length; i++) {
            const isSelected = (i === gameState.player.colorIndex);
            const picker = this.add.circle(pickerXPos[i], 325, 16, PLAYER_COLORS[i]);
            picker.setStrokeStyle(isSelected ? 3 : 1, 0xffffff);
            picker.setInteractive();

            const idx = i;
            picker.on('pointerdown', () => {
                gameState.player.colorIndex = idx;
                this.previewBody.setFillStyle(PLAYER_COLORS[idx]);
                this.colorPickers.forEach((p, j) => {
                    p.setStrokeStyle(j === idx ? 3 : 1, 0xffffff);
                });
            });
            picker.on('pointerover', () => picker.setAlpha(0.75));
            picker.on('pointerout', () => picker.setAlpha(1));

            this.colorPickers.push(picker);
        }

        // Name label
        this.add.text(443, 360, 'Your Name', {
            fontFamily: 'Arial',
            fontSize: '13px',
            color: '#d4e8b0'
        }).setOrigin(0.5);

        // Name input (Phaser DOM)
        this.nameInput = this.add.dom(443, 388).createFromHTML(
            `<input id="adventureNameInput" type="text"
             value="${gameState.player.name}" maxlength="20"
             style="font-size:17px; padding:6px 10px; width:210px;
                    text-align:center; background:#1a3d10; color:#f0e080;
                    border:2px solid #90c060; border-radius:6px;
                    outline:none; font-family:Arial;">`
        );

        // Start button
        this.startBtn = this.add.rectangle(443, 445, 210, 46, 0x5a9e3a).setInteractive();
        const startTxt = this.add.text(443, 445, 'Start Adventure!', {
            fontFamily: 'Arial',
            fontSize: '19px',
            color: '#ffffff',
            fontStyle: 'bold'
        }).setOrigin(0.5);

        this.startBtn.on('pointerdown', () => {
            const inputEl = document.getElementById('adventureNameInput');
            if (inputEl && inputEl.value.trim()) {
                gameState.player.name = inputEl.value.trim();
            }
            this.scene.start('CanterFarms');
        });

        this.startBtn.on('pointerover', () => {
            this.startBtn.setFillStyle(0x7abe5a);
            startTxt.setColor('#ffd700');
        });

        this.startBtn.on('pointerout', () => {
            this.startBtn.setFillStyle(0x5a9e3a);
            startTxt.setColor('#ffffff');
        });
    }

    update () {}
}
