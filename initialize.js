const globalObjects = [];

function getObjectByUID(uid) {
    var result = globalObjects.filter(function (object) { return object.id == uid; });
    return result ? result[0] : null; // or undefined
}

// This is an object's class:
class DOMObject {
    constructor(uid) {
        this.id = uid;
        this.selected = false;
        this.hovered = false;
        this.landmarkRadius = 0.0;
        this.continueGrowing = true;
        this.userWantsToPickUpObject = false;
        this.userPickedUpObject = false;
    }
}

var all = document.getElementsByTagName("*");

for (var i = 0, max = all.length; i < max; i++) {
    all[i].uid = uuid.v4();
    globalObjects.push(new DOMObject(all[i].uid));
}