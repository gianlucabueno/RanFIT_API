class Exercise {
    constructor(id, idUser, type, distance, duration,pointsPerExercise) {
            this.id = id;
            this.idUser = idUser;
            this.type = type;
            this.distance= distance;
            this.duration = duration;
            this.pointsPerExercise = pointsPerExercise;
    }
}

module.exports = Exercise;