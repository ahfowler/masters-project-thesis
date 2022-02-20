class Player {
    constructor(username, playerId) {
        this.username = username;
        this.id = playerId;
        this.points = 0;
    }

    addPoints(value) {
        this.points += value;
    }

    subtractPoints(value) {
        this.points -= value;
    }
}

const actionPointsGameMechanism = {
    
};