class CanterFarms extends Phaser.Scene
{
    constructor ()
    {
        super({ key: 'CanterFarms' });
    }

    preload () {}

    create ()
    {
        this.dialogueOpen = false;
        this._dialogueBox = null;
        this._questPanel = null;
        this.questPanelOpen = false;

        this.drawBackground();
        this.createPlayer();
        this.createWingsNPC();
        this.createQuestLogButton();
        this.setupInput();
    }

    drawBackground ()
    {
        const g = this.add.graphics();

        // Sky
        g.fillStyle(0x87ceeb, 1);
        g.fillRect(0, 0, 886, 240);

        // Distant hills
        g.fillStyle(0x4a8e30, 1);
        g.fillCircle(130, 242, 90);
        g.fillCircle(340, 238, 110);
        g.fillCircle(680, 244, 80);

        // Ground
        g.fillStyle(0x5a9e3a, 1);
        g.fillRect(0, 230, 886, 290);

        // Dirt path
        g.fillStyle(0xc8a97a, 1);
        g.fillRect(0, 330, 886, 90);

        // Fence along path top edge
        g.fillStyle(0xd2b48c, 1);
        for (let fx = 40; fx < 860; fx += 65) {
            g.fillRect(fx, 318, 8, 32);
            if (fx + 65 < 860) {
                g.fillRect(fx + 5, 325, 60, 5);
                g.fillRect(fx + 5, 336, 60, 5);
            }
        }

        // Tree left
        g.fillStyle(0x6b3a1f, 1);
        g.fillRect(90, 175, 14, 70);
        g.fillStyle(0x228b22, 1);
        g.fillCircle(97, 162, 38);

        // Tree right
        g.fillStyle(0x6b3a1f, 1);
        g.fillRect(775, 168, 16, 75);
        g.fillStyle(0x228b22, 1);
        g.fillCircle(783, 155, 42);

        // Cottage (background building)
        g.fillStyle(0xe8d8c0, 1);
        g.fillRect(380, 182, 90, 60);
        g.fillStyle(0xc05020, 1);
        g.fillTriangle(375, 182, 425, 150, 475, 182);
        g.fillStyle(0x8b6914, 1);
        g.fillRect(406, 212, 18, 30);  // door

        // Location name
        this.add.text(18, 14, 'Canter Farms', {
            fontFamily: 'Georgia, serif',
            fontSize: '22px',
            color: '#ffffff',
            stroke: '#000000',
            strokeThickness: 3
        });
    }

    createPlayer ()
    {
        const color = PLAYER_COLORS[gameState.player.colorIndex];

        const bodyShape = this.add.ellipse(0, 10, 30, 50, color);
        const headShape = this.add.circle(0, -16, 14, 0xf5c5a0);
        const hairGfx = this.add.graphics();
        hairGfx.fillStyle(0x7a3a0f, 1);
        hairGfx.fillRect(-12, -32, 24, 10);
        hairGfx.fillRect(-14, -32, 7, 18);
        hairGfx.fillRect(7, -32, 7, 18);

        const nameLabel = this.add.text(0, -40, gameState.player.name, {
            fontFamily: 'Arial',
            fontSize: '11px',
            color: '#ffffff',
            stroke: '#000000',
            strokeThickness: 2
        }).setOrigin(0.5);

        this.playerContainer = this.add.container(
            gameState.player.x,
            gameState.player.y,
            [bodyShape, headShape, hairGfx, nameLabel]
        ).setDepth(2);
    }

    createWingsNPC ()
    {
        const questStatus = gameState.quests.restoreMagic.status;
        this.wingsNPC = createNPC(this, 620, 355, {
            label: 'Wings',
            color: 0x9b59b6,
            questStatus
        });
    }

    createQuestLogButton ()
    {
        this.questLogBtn = this.add.rectangle(826, 22, 80, 28, 0x2a4a10)
            .setInteractive()
            .setDepth(5);
        this.questLogBtn.setStrokeStyle(1, 0xd4b860);

        this.add.text(826, 22, '📋 Quests', {
            fontFamily: 'Arial',
            fontSize: '12px',
            color: '#f0e080'
        }).setOrigin(0.5).setDepth(5);
    }

    setupInput ()
    {
        this.input.on('pointerdown', (pointer) => {
            if (this.dialogueOpen) return;

            // Quest log button
            if (this.questLogBtn.getBounds().contains(pointer.x, pointer.y)) {
                this.toggleQuestPanel();
                return;
            }

            // Close quest panel on any other click
            if (this.questPanelOpen) {
                this.closeQuestPanel();
                return;
            }

            // Wings NPC
            if (this.wingsNPC.body.getBounds().contains(pointer.x, pointer.y)) {
                this.onWingsClick();
                return;
            }

            // Move player
            const dist = Phaser.Math.Distance.Between(
                this.playerContainer.x, this.playerContainer.y,
                pointer.x, pointer.y
            );
            if (dist < 10) return;

            this.tweens.killTweensOf(this.playerContainer);
            this.tweens.add({
                targets: this.playerContainer,
                x: pointer.x,
                y: pointer.y,
                duration: Math.max(dist * 4, 150),
                ease: 'Linear',
                onUpdate: () => {
                    gameState.player.x = this.playerContainer.x;
                    gameState.player.y = this.playerContainer.y;
                }
            });
        });
    }

    onWingsClick ()
    {
        if (this.dialogueOpen) return;
        this.dialogueOpen = true;
        this.tweens.killTweensOf(this.playerContainer);

        const status = gameState.quests.restoreMagic.status;
        let pages, onClose;

        if (status === 'inactive') {
            pages = [
                'Hello, young rider! I am Wings, a magical Pegasus from North of North.',
                'Our land\'s magic is fading... the Tree of Magic grows weak.',
                'Will you help us? Plant seeds and grow flowers to restore its power!',
                'Quest received: Restore the Tree of Magic. Good luck!'
            ];
            onClose = () => {
                gameState.quests.restoreMagic.status = 'active';
                if (this.wingsNPC.indicator) this.wingsNPC.indicator.destroy();
                this.wingsNPC.indicator = this.add.text(620, 355 - 66, '?', {
                    fontFamily: 'Arial',
                    fontSize: '20px',
                    color: '#cccccc',
                    stroke: '#000000',
                    strokeThickness: 3,
                    fontStyle: 'bold'
                }).setOrigin(0.5).setDepth(1);
            };
        } else if (status === 'active') {
            pages = [
                'Keep going! The Tree of Magic needs your help.',
                'Every plant you grow brings magic back to North of North!'
            ];
            onClose = null;
        } else {
            pages = [
                'You did it! The Tree of Magic is full of life again!',
                'North of North is saved. You are a true friend of Bella Sara!'
            ];
            onClose = null;
        }

        openDialogue(this, { speaker: 'Wings', pages, onClose });
    }

    toggleQuestPanel ()
    {
        if (this.questPanelOpen) {
            this.closeQuestPanel();
        } else {
            this.openQuestPanel();
        }
    }

    openQuestPanel ()
    {
        this.questPanelOpen = true;
        const objects = [];

        const panelBg = this.add.graphics();
        panelBg.fillStyle(0x1a3d10, 0.95);
        panelBg.fillRoundedRect(680, 55, 195, 120, 8);
        panelBg.lineStyle(1, 0xd4b860, 1);
        panelBg.strokeRoundedRect(680, 55, 195, 120, 8);
        panelBg.setDepth(8);
        objects.push(panelBg);

        const title = this.add.text(777, 68, 'Quest Log', {
            fontFamily: 'Georgia, serif',
            fontSize: '14px',
            color: '#f0e080',
            fontStyle: 'bold'
        }).setOrigin(0.5).setDepth(8);
        objects.push(title);

        const status = gameState.quests.restoreMagic.status;
        const statusLabels = { inactive: 'Not started', active: 'In Progress', complete: 'Completed!' };
        const statusColors = { inactive: '#aaaaaa', active: '#ffd700', complete: '#90ee90' };

        const questTitle = this.add.text(695, 90, QUEST_DATA.restoreMagic.title, {
            fontFamily: 'Arial',
            fontSize: '11px',
            color: '#ffffff',
            wordWrap: { width: 165 }
        }).setDepth(8);
        objects.push(questTitle);

        const questStatus = this.add.text(695, 125, `Status: ${statusLabels[status]}`, {
            fontFamily: 'Arial',
            fontSize: '11px',
            color: statusColors[status]
        }).setDepth(8);
        objects.push(questStatus);

        this._questPanel = objects;
    }

    closeQuestPanel ()
    {
        if (this._questPanel) {
            this._questPanel.forEach(obj => obj.destroy());
            this._questPanel = null;
        }
        this.questPanelOpen = false;
    }

    update () {}
}
