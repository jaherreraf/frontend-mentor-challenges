console.log("CHALLENGE FRONTEND MENTOR BY JAHERRERAF")
const keyboardContainer = document.querySelector('main > .keyboard');
const displayElement = document.querySelector('#result');
let currentExpression = '';
const keys = [
    '7', '8', '9', 'DEL',
    '4', '5', '6', '+',
    '1', '2', '3', '-',
    '.', '0', '/', 'x',
    'RESET', '='
];
function createKeyboard() {
    keys.forEach(key => {
        const button = document.createElement('button');
        button.textContent = key;
        button.classList.add('key');
        if (key === 'RESET')
            button.classList.add('key--reset');
        if (key === 'DEL')
            button.classList.add('key--secondary');
        else if (key === '=')
            button.classList.add('key--equals');
        else if (!isNaN(key) || key === '.')
            button.classList.add('key--numeric');
        else
            button.classList.add('key--operator');

        keyboardContainer.appendChild(button);
    });
}
createKeyboard();
keyboardContainer.addEventListener('click', (event) => {
    if (!event.target.classList.contains('key'))
        return;
    const keyValue = event.target.textContent;
    if (keyValue === 'RESET') {
        currentExpression = '';
        displayElement.textContent = '0';
    } else if (keyValue === 'DEL') {
        currentExpression = currentExpression.slice(0, -1);
        displayElement.textContent = currentExpression || '0';
    } else if (keyValue == ".") {
        if (!currentExpression.endsWith(',')) {
            currentExpression += ',';
            displayElement.textContent = currentExpression;
        }
    } else if (keyValue === '=') {
        try {
            if (currentExpression === '')
                return;
            let sanitizedExpression = currentExpression.replace(/x/g, '*');
            sanitizedExpression = sanitizedExpression.replace(/,/g, '.');
            let result = eval(sanitizedExpression);
            displayElement.textContent = result;
            currentExpression = result.toString();
        } catch (error) {
            displayElement.textContent = 'Error';
            currentExpression = '';
        }
    } else {
        currentExpression += keyValue;
        displayElement.textContent = currentExpression;
    }
});
document.querySelector('#theme-1').addEventListener('click',function(){
    document.querySelector('body').classList.remove('theme-2', 'theme-3');
    document.querySelector('body').classList.add('theme-1');
    document.querySelector('.theme-switcher__ball').style.left = '5px';
})

document.querySelector('#theme-2').addEventListener('click',function(){
    document.querySelector('body').classList.remove('theme-1', 'theme-3');
    document.querySelector('body').classList.add('theme-2');
    
    document.querySelector('.theme-switcher__ball').style.left = '40px';
})
document.querySelector('#theme-3').addEventListener('click',function(){
    document.querySelector('body').classList.remove('theme-1', 'theme-2');
    document.querySelector('body').classList.add('theme-3');
    
    document.querySelector('.theme-switcher__ball').style.left = '75px';
    
})