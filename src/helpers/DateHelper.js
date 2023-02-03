export const getCurrentWeekNumber = () => {
    const today = new Date();
    const startDate = new Date(today.getFullYear(), 0, 1);

    const days = Math.floor((today - startDate) / (24 * 60 * 60 * 1000));

    const weekNumber = Math.ceil(days / 7);

    return weekNumber;
}

export const getLastWeekMonth = () => {
    const today = new Date();

    let month = today.getMonth() + 1;
    let year = today.getFullYear();

    const startDate = new Date(today.getFullYear(), 0, 1);
    const days = Math.floor((today - startDate) / (24 * 60 * 60 * 1000));

    let week = Math.ceil(days / 7);

    // get last year last week
    if(week == 1){
        week = 52;
        year = year - 1;
        month = 12;
    }else{
        week -= 1;
        month -= 1;
    }

    return {
        lastWeek: week,
        lastMonth: month,
        lastYear: year
    };
}
