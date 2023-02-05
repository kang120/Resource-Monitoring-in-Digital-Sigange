export const countFrequency = (data, label) => {
    var sum = 0;

    data.forEach(d => {
        sum += d[label]
    })

    return sum;
}

export const countMode = (data, label) => {
    const mp = {}
    var mode = 0;
    var most_frequent_item = '';

    data.forEach(d => {
        const item = d[label]

        if(item in mp){
            mp[item] += 1;
        }else{
            mp[item] = 1;
        }

        if(mp[item] > mode){
            mode = mp[item];
            most_frequent_item = item;
        }
    })

    return most_frequent_item;
}
