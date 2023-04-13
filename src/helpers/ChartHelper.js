export const getBarChartFrequencyData = (data, label) => {
    const chartData = [
        [`${label} Times`, 'Frequency']
    ];

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
        return [
            [`${label} Times`, 'Frequency'],
            ['> 0 Login', 0]
        ]
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

    chartData.push([`0 ${label}`, zeroCount])
    chartData.push([`< ${mean} ${label}`, smallerCount])
    chartData.push([`>= ${mean} ${label}`, greaterCount])

    return chartData;
}

export const getBarChartPeriodFrequencyData = (data) => {
    const chartData = [
        ['Login Period', 'Frequency']
    ];

    const dict = {
        '0-5': 0,
        '6-11': 0,
        '12-17': 0,
        '18-23': 0
    };

    data.forEach(d => {
        if(d in dict){
            dict[d] += 1;
        }else{
            dict[d] = 1;
        }
    })

    Object.keys(dict).forEach(key => {
        chartData.push([key, dict[key]])
    })

    return chartData;
}

export const getPieChartComponentData = (data) => {
    const chartData = [
        ['Component', 'Frequency']
    ]

    const n = data.length;

    const dict = {}

    data.forEach(d => {
        if(d in dict){
            dict[d] += 1;
        }else{
            dict[d] = 1;
        }
    })

    Object.keys(dict).forEach(key => {
        const percentage= (dict[key] / n).toFixed(2) * 100;

        chartData.push([key, percentage]);
    })

    return chartData;
}
