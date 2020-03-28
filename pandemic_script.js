let complianceHi = 0.01;
let successRateHi = 0.99;

let initialGrowthRate = 1.0 + 2.3/7;

let resolution = 100;
let resolutionHi = 100;


function growth_rate(cpLo, srLo, cpHi, srHi, initialGrowthRate) {
    var effHi = cpHi * srHi;
    var effLo = cpLo * srLo;
    var res = (1 - effHi - effLo * (1 - cpHi)) * initialGrowthRate;
    return res
}

function compute_heatmap(complianceHi, successRateHi, initialGrowthRate, resolution){
    let complianceLo = [];
    let successRateLo = [];
    for (var i = 0; i <= resolution; i++) {
        complianceLo.push(i / resolution)
        successRateLo.push(i / resolution)
    }
    let gr = new Array(resolution);
    for (var i=0; i<resolution; i++) {
        gr[i] = new Array(resolution);
    }

    for (var i=0; i<resolution; i++) {
        for (var j=0; j<resolution; j++) {
            let currGR = growth_rate(complianceLo[i], successRateLo[j], complianceHi, successRateHi, initialGrowthRate);
            if ( currGR > 1) {
                gr[i][j] = 0;
            } else {
                gr[i][j] = 1;
            }
            
        }
    }
    return [gr, complianceLo, successRateLo]
} 

let gr = compute_heatmap(complianceHi, successRateHi, initialGrowthRate, resolution);

let data = Array(resolutionHi);
for (var i=0; i<resolution; i++){
    let complianceHi = i / resolutionHi;
    let [tmp_heatmap, xdata, ydata] = compute_heatmap(complianceHi, successRateHi, initialGrowthRate, resolution);
    data[i] = {
        z: tmp_heatmap,
        x: xdata,
        y: ydata,
        type: 'heatmap',
        visible: true,
        zmin: 0,
        zmax: 1,
        colorscale: [
            ['0', 'rgb(150,0,0)'],
            ['1', 'rgb(0,150,0)']
        ],
        colorbar: {
            autotick: false,
            tickvals: [0, 1],
            ticktext: ['growth rate > 1', 'growth rate < 1']
        }
    };
}

let slider_steps = Array(resolutionHi);
for (var i=0; i<resolution; i++){
    let visibility = new Array(resolutionHi).fill(false);
    slider_steps[i] = {
        label: i/resolutionHi,
        method: 'restyle',
        args: ['visible', visibility]
    };
    slider_steps[i]['args'][1][i] = true;
}

var layout = {
    xaxis: {
        title: {
            text: 'Low fidelity test compliance',
        }
    },
    yaxis: {
        title: {
            text: 'Low fidelity test success rate',
        }
    },
    font: {
        family: "et-book"
    },
    sliders: [{
        pad: { t: 50 },
        currentvalue: {
            xanchor: 'left',
            prefix: 'High fidelity test compliance: '
        },
        steps: slider_steps
    }]
}

Plotly.newPlot('graph', data, layout);
