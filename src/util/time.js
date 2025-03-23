
async function exportTimeString(time) {
    let date = ("0" + time.getDate()).slice(-2);
    let month = ("0" + (time.getMonth() + 1)).slice(-2);
    let year = time.getFullYear();

    let hours = ("0" + time.getHours()).slice(-2);
    let minutes = ("0" + time.getMinutes()).slice(-2);

    const orderDate = ` [ ${date} - ${month} - ${year} ]`;
    const orderTime = `${hours}h - ${minutes}p`;
    
    return {orderDate,orderTime};
}

module.exports = { exportTimeString };
