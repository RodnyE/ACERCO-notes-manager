
module.exports = {
    
    // unic id - 
    createUuid: require('uuid').v1,
    
    // date id - YYYYMMDD
    createDateId (dateTime) {
        const date = dateTime ? new Date(dateTime) : new Date();

        let year = date.getFullYear();
        let month = date.getMonth() + 1; // El método getMonth() retorna valores de 0 a 11, por eso se le suma 1
        let day = date.getDate() + 1;
 
        if (month < 10) month = '0' + month;
        if (day < 10) day = '0' + day;
        
        return year + month + day;
    }
}