console.log('FRONTEND MENTOR BY JAHERRERAF');
let content = null
let option = 0
async function get_data() {
  try {
    const response = await fetch('data.json');
    if (!response.ok) {
      throw new Error('No se pudo cargar el archivo JSON');
    }
    const data = await response.json();
    return data; // Retorna los datos para usarlos
  } catch (error) {
    console.error('Error al cargar el JSON: ', error);
    return null; // O devuelve un valor predeterminado en caso de error
  }
}
// Llama a la función y usa los datos
get_data().then(data => {
  content = data
  if (data) {
    html = ''
    Array.from(data).forEach((box, index) => {
      html += build_card(box, index)
    })
    document.getElementById('content').innerHTML = html

  } else {
    console.log('No se pudieron obtener los datos.');
  }
});

document.getElementById('theme-button').addEventListener('click', () => {
  const body = document.body;
  const currentTheme = body.getAttribute('data-theme');

  // Comprueba el tema actual y cambia al opuesto
  if (currentTheme === 'light') {
    body.setAttribute('data-theme', 'dark');
    document.getElementById('theme-icon').style.backgroundImage = `url('/assets/images/icon-sun.svg')`
  } else {
    body.setAttribute('data-theme', 'light');
    document.getElementById('theme-icon').style.backgroundImage = `url('/assets/images/icon-moon.svg')`
  }
});
function build_card(box, index) {
  return `
    <div class="card">
      <div class="wrapper-header-card">
        <div class="wrapper-icon">
          <img src="${box.logo}" class="icon">
        </div>
        <div class="wrapper-name-description">
          <span class="name">${box.name}</span>
          <p class="description">${box.description}</p>
        </div>
      </div>
      <div class="wrapper-footer-card">
        <button class="remove" onclick="remove('${box.name}')">
          Remove
        </button>
        <div class="toggle-switch">
            <input type="checkbox" name="checkbox-${index}" id="checkbox-${index}" class="input-checkbox" ${box.isActive ? 'checked' : ''}>
            <label for="checkbox-${index}" onclick="checked('${box.name}')"></label>
        </div>
      </div>
    </div>
  `
}
function update_content(index) {
  const tools = document.querySelector('.tools').children
  tools[option].classList.toggle("select")
  option = index
  tools[option].classList.toggle("select")
  let new_content = null
  switch (option) {
    case 0:
      new_content = content.map((box, index) => build_card(box, index));
      break;
    case 1:
      new_content = content.filter((box) => box.isActive);
      new_content = new_content.map((box, index) => build_card(box, index));
      break;
    case 2:
      new_content = content.filter((box) => !box.isActive);
      new_content = new_content.map((box, index) => build_card(box, index));
      break;
    default:
      console.error("::FATAL SYSTEM ERROR::")
      break;
  }
  if(new_content.length)
    document.getElementById('content').innerHTML = new_content.join(' ')
  else
    document.getElementById('content').innerHTML = `<span class="empty-message">No extensions found.</span>`
}
function remove(name) {
  const index = content.findIndex(box => box.name === name);
  content.splice(index, 1);
  update_content(option)
}
function checked(name) {
  const index = content.findIndex(box => box.name === name);
  content.map((box, i) => i == index ? box.isActive = !box.isActive : box)
  update_content(option)
}

let tools = ['All', 'Active', 'Inactive'];
function renderTools(){
document.querySelector('.tools').innerHTML = tools.map((tool, index) => {
  return `<span onclick="update_content(${index})" class="${index==0?'select': ''}">${tool}</span>`;
}).join('')

}
renderTools()