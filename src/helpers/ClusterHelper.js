export const getBarChartFrequencytData = (data, label) => {
    const chartData = [
        ['Login Times', 'Frequency']
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
        return [[]]
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
