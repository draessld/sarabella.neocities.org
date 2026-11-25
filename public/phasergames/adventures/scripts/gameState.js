const gameState = {
    player: {
        name: 'Bella',
        colorIndex: 0,
        x: 240,
        y: 390
    },
    quests: {
        restoreMagic: { status: 'inactive' }
    },
    horses: []
};

const PLAYER_COLORS = [0xff69b4, 0x87ceeb, 0x90ee90, 0xffd700];

const QUEST_DATA = {
    restoreMagic: {
        title: 'Restore the Tree of Magic',
        description: 'Grow plants to bring magic back to North of North.'
    }
};
