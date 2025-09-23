
const selector = document.getElementById('selector');
const clienteSection = document.getElementById('clienteSection');
const personalSection = document.getElementById('personalSection');
const passwordPersonal = document.getElementById('passwordPersonal');
const personalContent = document.getElementById('personalContent');
const tablaSection = document.getElementById('tablaSection');
const loginDiv = document.getElementById('loginDiv');


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

document.getElementById('loginPersonal').addEventListener('click', () => {
  if(passwordPersonal.value === 'BCHQ2024#'){
    personalContent.classList.remove('hidden');
    loginDiv.classList.add('hidden');
  } else {
    alert('Contraseña incorrecta');
  }
});


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


document.getElementById('verTablas').addEventListener('click', () => {
  clienteSection.classList.add('hidden');
  personalSection.classList.add('hidden');
  tablaSection.classList.remove('hidden');
  renderTabla();
});


function renderTabla(){
  const tbody = document.querySelector('#tablaCombinada tbody');
  tbody.innerHTML = '';

  const clientes = JSON.parse(localStorage.getItem('clientes') || '[]');
  const personalArr = JSON.parse(localStorage.getItem('personal') || '[]');

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


  if(!document.getElementById('clearStorage')){
    const clearBtn = document.createElement('button');
    clearBtn.id = 'clearStorage';
    clearBtn.className = 'btn';
    clearBtn.textContent = '🗑️ Borrar todos los registros';
    clearBtn.addEventListener('click', () => {
      if(confirm("¿Seguro que quieres eliminar TODOS los registros?")){
        localStorage.removeItem('clientes');
        localStorage.removeItem('personal');
        renderTabla();
        alert("Todos los registros fueron borrados");
      }
    });
    tablaSection.appendChild(clearBtn);
  }
}


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

function obtenerProductos(ids){
  return ids.map(id => {
    const el = document.getElementById(id);
    return el && el.checked ? el.value : null;
  }).filter(Boolean).join(', ');
}

document.getElementById('imprimirCliente').addEventListener('click', ()=>{
  const nombre = document.getElementById('nombreCliente').value;
  const dpi = document.getElementById('dpiCliente').value;
  const sala = document.getElementById('salaCliente').value;
  const fecha = document.getElementById('fechaCliente').value;
  const productos = obtenerProductos(['rallymic','clickshare','mic','rallyplus','camara']);

  if(!nombre || !dpi) return alert('Ingrese Nombre y DPI');

  let ventana = window.open('', '', 'width=800,height=600');
  ventana.document.write(`
  <html>
  <head>
    <title>Carta de Responsabilidad</title>
    <style>
      body { font-family: 'Montserrat', sans-serif; margin: 40px; color: #333; }
      .carta { border: 3px double #d1b161; padding: 30px; border-radius: 15px; background: #f9f5ef; }
      h2 { text-align: center; color: #7d6b4f; margin-bottom: 30px; }
      p { font-size: 16px; line-height: 1.5; margin: 10px 0; }
      .productos { margin: 15px 0; font-weight: 600; }
      .firma { margin-top: 50px; text-align: right; font-weight: 600; }
      hr { border: none; border-top: 2px dashed #d1b161; margin: 30px 0; }
    </style>
  </head>
  <body>
    <div class="carta">
      <h2>CARTA DE RESPONSABILIDAD</h2>
      <p><strong>Nombre:</strong> ${nombre}</p>
      <p><strong>DPI:</strong> ${dpi}</p>
      <p><strong>Sala:</strong> ${sala}</p>
      <p><strong>Fecha y Hora:</strong> ${fecha}</p>
      <p class="productos"><strong>Equipos entregados:</strong> ${productos}</p>
      <hr>
      <p class="firma">Firma: ________________________</p>
    </div>
  </body>
  </html>
  `);
  ventana.document.close();
  ventana.print();
});
