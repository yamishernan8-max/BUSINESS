// --- Elementos ---
const selector = document.getElementById('selector');
const clienteSection = document.getElementById('clienteSection');
const personalSection = document.getElementById('personalSection');
const passwordPersonal = document.getElementById('passwordPersonal');
const personalContent = document.getElementById('personalContent');
const tablaSection = document.getElementById('tablaSection');
const loginDiv = document.getElementById('loginDiv');

// --- Botones Inicio ---
document.getElementById('homeCliente').addEventListener('click', () => {
  clienteSection.classList.add('hidden');
  selector.classList.remove('hidden');
});

document.getElementById('homePersonal').addEventListener('click', () => {
  personalSection.classList.add('hidden');
  selector.classList.remove('hidden');
  personalContent.classList.add('hidden');
  loginDiv.classList.remove('hidden');
});

// --- Selección de perfil ---
document.getElementById('clienteBtn').addEventListener('click', () => {
  selector.classList.add('hidden');
  clienteSection.classList.remove('hidden');
});

document.getElementById('personalBtn').addEventListener('click', () => {
  selector.classList.add('hidden');
  personalSection.classList.remove('hidden');
  passwordPersonal.value = '';
  personalContent.classList.add('hidden');
  loginDiv.classList.remove('hidden');
});

// --- Login Personal ---
document.getElementById('loginPersonal').addEventListener('click', () => {
  if(passwordPersonal.value === 'BCHQ2024#'){
    personalContent.classList.remove('hidden');
    loginDiv.classList.add('hidden');
  } else {
    alert('Contraseña incorrecta');
  }
});

// --- Guardar Cliente ---
document.getElementById('clienteForm').addEventListener('submit', e => {
  e.preventDefault();
  const form = e.target;
  const nombre = form.nombreCliente.value;
  const dpi = form.dpiCliente.value;
  const sala = form.sala.value;
  const fecha = form.fechaHora.value;

  const productos = Array.from(document.querySelectorAll('#clienteSection .producto'))
                         .filter(ch => ch.checked)
                         .map(ch => ch.value);

  if(productos.length === 0){
    alert("Seleccione al menos un producto");
    return;
  }

  const cliente = {nombre,dpi,sala,fecha,productos};
  let clientes = JSON.parse(localStorage.getItem('clientes') || '[]');
  clientes.push(cliente);
  localStorage.setItem('clientes', JSON.stringify(clientes));

  alert('Cliente guardado correctamente!');
  form.reset();
  document.querySelectorAll('#clienteSection .producto').forEach(ch => ch.checked=false);
});

// --- Guardar Personal ---
document.getElementById('personalForm').addEventListener('submit', e => {
  e.preventDefault();
  const form = e.target;
  const nombre = form.nombreClientePersonal.value;
  const dpi = form.dpiClientePersonal.value;
  const sala = form.salaPersonal.value;
  const fecha = form.fechaHoraPersonal.value;
  const recibidoPor = form.recibidoPor.value;

  const productos = Array.from(document.querySelectorAll('#personalSection .productoPersonal'))
                         .filter(ch => ch.checked)
                         .map(ch => ch.value);

  if(productos.length === 0){
    alert("Seleccione al menos un producto devuelto");
    return;
  }

  const personal = {nombre,dpi,sala,fecha,productos,recibidoPor};
  let personalArr = JSON.parse(localStorage.getItem('personal') || '[]');
  personalArr.push(personal);
  localStorage.setItem('personal', JSON.stringify(personalArr));

  alert('Devolución guardada correctamente!');
  form.reset();
  document.querySelectorAll('#personalSection .productoPersonal').forEach(ch => ch.checked=false);
});

// --- Ver Tabla Combinada ---
document.getElementById('verTablas').addEventListener('click', () => {
  clienteSection.classList.add('hidden');
  personalSection.classList.add('hidden');
  tablaSection.classList.remove('hidden');
  renderTabla();
});

// --- Renderizar Tabla (Clientes y Personal separados) ---
function renderTabla(){
  const tbody = document.querySelector('#tablaCombinada tbody');
  tbody.innerHTML = '';

  const clientes = JSON.parse(localStorage.getItem('clientes') || '[]');
  const personalArr = JSON.parse(localStorage.getItem('personal') || '[]');

  // --- Mostrar clientes ---
  clientes.forEach(c => {
    const tr = document.createElement('tr');
    tr.innerHTML = `<td>Cliente</td>
                    <td>${c.nombre}</td>
                    <td>${c.dpi}</td>
                    <td>${c.sala}</td>
                    <td>${c.fecha}</td>
                    <td>${c.productos.join(', ')}</td>
                    <td></td>
                    <td></td>
                    <td></td>`;
    tbody.appendChild(tr);
  });

  // --- Mostrar personal ---
  personalArr.forEach(p => {
    const tr = document.createElement('tr');
    tr.innerHTML = `<td>Personal</td>
                    <td>${p.nombre}</td>
                    <td>${p.dpi}</td>
                    <td>${p.sala}</td>
                    <td></td>
                    <td></td>
                    <td>${p.fecha}</td>
                    <td>${p.productos.join(', ')}</td>
                    <td>${p.recibidoPor}</td>`;
    tbody.appendChild(tr);
  });

  // --- Botón para regresar a Personal ---
  if(!document.getElementById('backToPersonal')){
    const btn = document.createElement('button');
    btn.id = 'backToPersonal';
    btn.className = 'btn';
    btn.textContent = 'Regresar a Personal';
    btn.addEventListener('click', () => {
      tablaSection.classList.add('hidden');
      personalSection.classList.remove('hidden');
      personalContent.classList.remove('hidden');
    });
    tablaSection.appendChild(btn);
  }
}

// --- Exportar a Excel ---
function exportExcelTabla(){
  const table = document.getElementById('tablaCombinada');
  const html = table.outerHTML.replace(/ /g,'%20');
  const url = 'data:application/vnd.ms-excel,' + html;
  const link = document.createElement('a');
  link.href = url;
  link.download = 'tabla_combinada.xls';
  link.click();
}
document.getElementById('exportExcelPersonal').addEventListener('click', exportExcelTabla);