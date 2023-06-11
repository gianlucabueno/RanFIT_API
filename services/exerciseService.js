const calculatePoints = (distance, duration) => {

    const distanceInKm = parseFloat(distance) / 1000;
    const distanceMeters = parseFloat(distance)

    const distancePoints = (distanceInKm * 100 ) + (distanceMeters * 10)

    const durationParts = duration.split(':'); // Divide a string nos dois pontos
    const hours = parseInt(durationParts[0], 10); // Converte a parte das horas em um número inteiro
    const minutes = parseInt(durationParts[1], 10); 

    const hourInMinutes = hours * 60;

    const durationPoints = (hours * 100 ) + ((hourInMinutes + minutes) * 10);
  
    // Calcular a pontuação baseada no tempo e na distância
    const points = durationPoints + distancePoints;
  
    return points;
};


module.exports = {
    calculatePoints
};