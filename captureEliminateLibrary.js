const captureEliminateGameMechanism = {
    // If a user touches an item, then the item will disappear and a point will be added to their score.
    userCapturesItem: function (user, bodyPoints, item, pointValue) {
        if (userHoversObject(bodyPoints, item, () => {}, () => {})) {
            trueCallback();
            user.addPoints(1);
        }
    }
};