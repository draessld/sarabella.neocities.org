function createNPC(scene, x, y, cfg) {
    const { label, color, questStatus } = cfg;

    const body = scene.add.rectangle(x, y, 50, 70, color).setInteractive();
    body.setDepth(1);

    const nameText = scene.add.text(x, y - 50, label, {
        fontFamily: 'Arial',
        fontSize: '12px',
        color: '#ffffff',
        stroke: '#000000',
        strokeThickness: 3
    }).setOrigin(0.5).setDepth(1);

    let indicator = null;

    if (questStatus === 'inactive') {
        indicator = scene.add.text(x, y - 66, '!', {
            fontFamily: 'Arial',
            fontSize: '20px',
            color: '#ffd700',
            stroke: '#000000',
            strokeThickness: 3,
            fontStyle: 'bold'
        }).setOrigin(0.5).setDepth(1);
    } else if (questStatus === 'active') {
        indicator = scene.add.text(x, y - 66, '?', {
            fontFamily: 'Arial',
            fontSize: '20px',
            color: '#cccccc',
            stroke: '#000000',
            strokeThickness: 3,
            fontStyle: 'bold'
        }).setOrigin(0.5).setDepth(1);
    } else if (questStatus === 'complete') {
        indicator = scene.add.text(x, y - 66, '✓', {
            fontFamily: 'Arial',
            fontSize: '20px',
            color: '#90ee90',
            stroke: '#000000',
            strokeThickness: 3,
            fontStyle: 'bold'
        }).setOrigin(0.5).setDepth(1);
    }

    return { body, indicator, nameText };
}

function openDialogue(scene, cfg) {
    const { speaker, pages, onClose } = cfg;
    let pageIndex = 0;
    const objects = [];

    const bg = scene.add.graphics();
    bg.fillStyle(0x000000, 0.8);
    bg.fillRect(0, 405, 886, 115);
    bg.lineStyle(2, 0xd4b860, 1);
    bg.strokeRect(1, 406, 884, 113);
    bg.setDepth(10);
    objects.push(bg);

    const speakerTxt = scene.add.text(18, 413, speaker, {
        fontFamily: 'Georgia, serif',
        fontSize: '15px',
        color: '#ffd700',
        fontStyle: 'bold'
    }).setDepth(10);
    objects.push(speakerTxt);

    const dialogTxt = scene.add.text(18, 435, pages[0], {
        fontFamily: 'Arial',
        fontSize: '14px',
        color: '#f0f0f0',
        wordWrap: { width: 740 }
    }).setDepth(10);
    objects.push(dialogTxt);

    const btnBg = scene.add.graphics();
    btnBg.fillStyle(0x4a7a30, 1);
    btnBg.fillRoundedRect(756, 480, 115, 32, 6);
    btnBg.setInteractive(
        new Phaser.Geom.Rectangle(756, 480, 115, 32),
        Phaser.Geom.Rectangle.Contains
    );
    btnBg.setDepth(10);
    objects.push(btnBg);

    const btnTxt = scene.add.text(814, 496, '▶  Next', {
        fontFamily: 'Arial',
        fontSize: '13px',
        color: '#ffffff'
    }).setOrigin(0.5).setDepth(10);
    objects.push(btnTxt);

    scene._dialogueBox = objects;

    btnBg.on('pointerdown', () => {
        pageIndex++;
        if (pageIndex < pages.length) {
            dialogTxt.setText(pages[pageIndex]);
            if (pageIndex === pages.length - 1) {
                btnTxt.setText('✖  Close');
            }
        } else {
            closeDialogue(scene);
            if (onClose) onClose();
        }
    });

    btnBg.on('pointerover', () => {
        btnBg.clear();
        btnBg.fillStyle(0x6aa850, 1);
        btnBg.fillRoundedRect(756, 480, 115, 32, 6);
        btnTxt.setColor('#ffd700');
    });

    btnBg.on('pointerout', () => {
        btnBg.clear();
        btnBg.fillStyle(0x4a7a30, 1);
        btnBg.fillRoundedRect(756, 480, 115, 32, 6);
        btnTxt.setColor('#ffffff');
    });
}

function closeDialogue(scene) {
    if (scene._dialogueBox) {
        scene._dialogueBox.forEach(obj => obj.destroy());
        scene._dialogueBox = null;
    }
    scene.dialogueOpen = false;
}
