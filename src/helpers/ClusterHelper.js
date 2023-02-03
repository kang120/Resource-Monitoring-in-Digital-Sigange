export const sortUserByCluser = (data) => {
    const clusters = {};

    data.forEach(d => {
        const cluster = d['cluster']
        const key = `cluster_${cluster}`

        delete d['cluster']

        if(key in clusters){
            clusters[key].push(d)
        }else{
            clusters[key] = [d];
        }
    })

    return clusters;
}

export const getFrequencyPercentage = (data) => {
    const dict = {};

    const n = data.length;

    data.forEach(d => {
        if(d in dict){
            dict[d] += 1;
        }else{
            dict[d] = 1;
        }
    })

    Object.keys(dict).forEach(key => {
        const percentage= ((dict[key] / n).toFixed(2) * 100).toFixed(0);

        dict[key] = percentage + "%";
    })

    var str = ''

    Object.keys(dict).forEach(key => {
        str += dict[key] + ' ' + key + ','
    })

    str = str.slice(0, -1);

    return str;
}

export const getNumberFrequencyPercentage = (data, label) => {
    const dict = {};

    const n = data.length;
    var zeroCount = 0;
    var sum = 0;

    data.forEach(d => {
        if(d == 0){
            zeroCount += 1;
        }else{
            sum += d;
        }
    })

    const mean = Math.ceil(sum / 2);

    if(mean == 0){
        return `100% 0 ${label}`
    }

    var smallerCount = 0;
    var greaterCount = 0;

    data.forEach(d => {
        if(d < mean && d != 0){
            smallerCount += 1;
        }else if(d >= mean){
            greaterCount += 1;
        }
    })

    dict[`0 ${label}`] = ((zeroCount / n).toFixed(2) * 100).toFixed(0) + '%';
    dict[`< ${mean} ${label}`] = ((smallerCount / n).toFixed(2) * 100).toFixed(0) + '%';
    dict[`>= ${mean} ${label}`] = ((greaterCount / n).toFixed(2) * 100).toFixed(0) + '%';

    var str = '';

    Object.keys(dict).forEach(key => {
        str += dict[key] + ' ' + key + ','
    })

    str = str.slice(0, -1);

    return str;
}

export const sortByClusterOrder = (a, b) => {
    if(a.cluster > b.cluster){
        return 1;
    }else{
        return -1;
    }
}
