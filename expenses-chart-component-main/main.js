console.log('FRONTEND MENTOR CHALLENGUE BY JAHERRERAF')

fetch('./data.json')
    .then(response => response.json())
    .then(data => {
        generate_graph(data);
    })
    .catch(error => console.error("::ERROR GETTING JSON:: ", error));


function generate_graph(data) {
    if (!Array.isArray(data) || data.length === 0) {
        console.error("Los datos no son un array o están vacíos.");
        return;
    }
    const daysMajorPrice = data.reduce((max, day) => {
        if (day.amount > max.amount) {
            return day;
        } else {
            return max;
        }
    }, data[0]);
    const maxAmount = daysMajorPrice.amount;
    const inner_graph = data.map((day, index) => {
        let colorBarChart
        if(day===daysMajorPrice)
            colorBarChart = `hsl(186, 34%, 65%)`
        else
            colorBarChart = `hsl(10, 79%, 65%)`
        return generate_bar(day.amount,colorBarChart, day.day, index, maxAmount)
    })
    document.querySelector('#graph').innerHTML = inner_graph.join(" ")

}
function generate_bar(amount,colorBarChart,day,index,maxAmount) {
    const minHeightRem = 5; // CSS sets min-height: 5rem
    const maxExtraRem = 9; // additional growth above the minimum (increase contrast)
    const ratio = Math.max(0, Math.min(1, amount / maxAmount));
    const heightRem = (minHeightRem + ratio * maxExtraRem).toFixed(2);
    const delayMs = 80 * index;
    return (
    `
    <div class="bar" key="${day}-${index}" style="--bar-delay:${delayMs}ms">
        <div class="amount">$${amount}</div>
        <div class="bar-chart" style="--bg-bar-chart:${colorBarChart};height:${heightRem}rem"></div>
        <span class="day">${day}</span>
    </div>  
    `
    )
}
const profileEl = document.querySelector('#profile');
if (profileEl) {
    const original = profileEl.textContent.trim();
    profileEl.innerHTML = original
        .split('')
        .map((ch, i) => `<span class=\"letter\" style=\"--i:${i}\">${ch}</span>`) 
        .join('');
}
    