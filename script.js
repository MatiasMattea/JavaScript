


const vehiculosBaseDatos = [
    {
        "numero": "B-001",
        "tipo": "Camión",
        "agua": "Óptimo", 
        "aceite": "Óptimo",
        "luces": "Funcionan",
        "novedades": "Vehículo de prueba - listo para servicio de emergencia",
        "condicionesOptimas": true,
        "fecha": "2024-01-15"
    },
    {
        "numero": "B-002", 
        "tipo": "Ambulancia",
        "agua": "Bajo",
        "aceite": "Óptimo",
        "luces": "Funcionan",
        "novedades": "Requiere revisión de sistema de agua - Fuga detectada",
        "condicionesOptimas": false,
        "fecha": "2024-01-15"
    },
    {
        "numero": "B-003",
        "tipo": "Escalera Mecánica",
        "agua": "Óptimo",
        "aceite": "Bajo", 
        "luces": "No funcionan",
        "novedades": "Cambio de aceite y revisión de luces urgente - No operativo",
        "condicionesOptimas": false,
        "fecha": "2024-01-15"
    }
];


let vehiculos = [];
let vehiculoAEliminar = null;



function cargarDatos() {
    const datos = localStorage.getItem('vehiculosBomberos');
    return datos ? JSON.parse(datos) : null;
}

function guardarDatos() {
    localStorage.setItem('vehiculosBomberos', JSON.stringify(vehiculos));
}

function actualizarVista() {
    actualizarEstadisticas();
    actualizarListaVehiculos();
    precargarDatosFormulario();
}

function actualizarEstadisticas() {
    const total = vehiculos.length;
    const optimos = vehiculos.filter(v => v.condicionesOptimas).length;
    const problemas = total - optimos;

    document.getElementById('totalVehiculos').textContent = total;
    document.getElementById('vehiculosOptimos').textContent = optimos;
    document.getElementById('vehiculosProblemas').textContent = problemas;
}

function actualizarListaVehiculos() {
    const lista = document.getElementById('listaVehiculos');
    
    if (vehiculos.length === 0) {
        lista.innerHTML = '<div class="empty-state"><p>🎯 No hay vehículos registrados. Use el formulario para agregar el primero.</p></div>';
        return;
    }

    const html = vehiculos.map(vehiculo => `
        <div class="vehiculo ${vehiculo.condicionesOptimas ? '' : 'problema'}">
            <div class="vehiculo-header">
                <strong>${vehiculo.tipo} - ${vehiculo.numero}</strong>
                <span class="estado-vehiculo ${vehiculo.condicionesOptimas ? 'estado-optimo' : 'estado-problema'}">
                    ${vehiculo.condicionesOptimas ? '✅ Óptimo' : '❌ Problemas'}
                </span>
            </div>
            <div class="vehiculo-detalles">
                <div>Agua: <strong>${vehiculo.agua}</strong></div>
                <div>Aceite: <strong>${vehiculo.aceite}</strong></div>
                <div>Luces: <strong>${vehiculo.luces}</strong></div>
            </div>
            ${vehiculo.novedades !== 'Sin novedades' ? 
                `<div class="novedades">Novedades: ${vehiculo.novedades}</div>` : ''}
            <div class="fecha">${vehiculo.fecha}</div>
            
           
            <div class="acciones-vehiculo">
                <button onclick="editarVehiculo('${vehiculo.numero}')" 
                        class="btn btn-edit btn-sm">
                    ✏️ Editar
                </button>
                <button onclick="solicitarEliminacion('${vehiculo.numero}')" 
                        class="btn btn-delete btn-sm">
                    🗑️ Eliminar
                </button>
            </div>
        </div>
    `).join('');

    lista.innerHTML = html;
}

function agregarVehiculo() {
    const numero = document.getElementById('numeroUnidad').value.trim();
    const tipo = document.getElementById('tipoVehiculo').value;
    const agua = document.getElementById('nivelAgua').value;
    const aceite = document.getElementById('nivelAceite').value;
    const luces = document.getElementById('estadoLuces').value;
    const novedades = document.getElementById('novedades').value || 'Sin novedades';


    

    if (!numero) {
        mostrarMensajeSweet('❌ Error', 'El número de unidad es obligatorio', 'error');
        return false;
    }

  
    const formatoValido = /^B-\d{1,3}$/.test(numero);
    if (!formatoValido) {
        mostrarMensajeSweet('❌ Error', 'Formato inválido. Use: B-001, B-010, B-100', 'error');
        return false;
    }


    const numeroUnidad = parseInt(numero.split('-')[1]);
    if (isNaN(numeroUnidad) || numeroUnidad < 1 || numeroUnidad > 100) {
        mostrarMensajeSweet('❌ Error', 'El número de unidad debe estar entre B-001 y B-100', 'error');
        return false;
    }


    if (vehiculos.find(v => v.numero === numero)) {
        mostrarMensajeSweet('❌ Error', `Ya existe un vehículo con el número ${numero}`, 'error');
        return false;
    }


    const vehiculo = {
        numero: numero,
        tipo: tipo,
        agua: agua,
        aceite: aceite,
        luces: luces,
        novedades: novedades,
        fecha: new Date().toLocaleString(),
        condicionesOptimas: (agua === "Óptimo" && aceite === "Óptimo" && luces === "Funcionan")
    };

    vehiculos.push(vehiculo);
    guardarDatos();
    actualizarVista();
    
   
    document.getElementById('vehiculoForm').reset();
    precargarDatosFormulario();
    
    
    if (agua === "Bajo" || aceite === "Bajo" || luces === "No funcionan") {
        mostrarMensajeSweet(
            '🚨 ¡ATENCIÓN! Mantenimiento Urgente', 
            `Unidad ${numero} (${tipo}) necesita mantenimiento URGENTE. Se recomienda NO UTILIZAR`, 
            'warning'
        );
    } else {
        mostrarMensajeSweet('✅ Éxito', `Vehículo ${numero} agregado correctamente`, 'success');
    }
    
    return true;
}

function verResumenEstado() {
    if (vehiculos.length === 0) {
        mostrarMensajeSweet('ℹ️ Información', 'No hay vehículos registrados', 'info');
        return;
    }
    
    const optimos = vehiculos.filter(v => v.condicionesOptimas).length;
    const conProblemas = vehiculos.length - optimos;
    const urgentes = vehiculos.filter(v => 
        !v.condicionesOptimas && (v.agua === "Bajo" || v.aceite === "Bajo")
    ).length;

    let mensaje = `<strong>Total de vehículos:</strong> ${vehiculos.length}<br><br>`;
    mensaje += `✅ <strong>En condiciones óptimas:</strong> ${optimos}<br>`;
    mensaje += `❌ <strong>Requieren mantenimiento:</strong> ${conProblemas}<br>`;
    mensaje += `🚨 <strong>Mantenimiento urgente:</strong> ${urgentes}`;

    if (urgentes > 0) {
        mensaje += `<br><br><strong>Vehículos que necesitan atención inmediata:</strong><br>`;
        vehiculos.filter(v => !v.condicionesOptimas && (v.agua === "Bajo" || v.aceite === "Bajo"))
            .forEach(v => {
                mensaje += `• ${v.tipo} ${v.numero}<br>`;
            });
    }

    mostrarMensajeSweet('📊 Resumen Completo de la Flota', mensaje, urgentes > 0 ? 'warning' : 'success');
}

function limpiarTodo() {
    mostrarConfirmacionSweet(
        '⚠️ Confirmar Eliminación Total', 
        '¿Está seguro de eliminar TODOS los vehículos? Esta acción no se puede deshacer.'
    ).then((result) => {
        if (result.isConfirmed) {
            vehiculos = [];
            localStorage.removeItem('vehiculosBomberos');
            actualizarVista();
            mostrarMensajeSweet('✅ Éxito', 'Todos los datos han sido eliminados', 'success');
        }
    });
}

function limpiarFormulario() {
    document.getElementById('vehiculoForm').reset();
    precargarDatosFormulario();
    mostrarMensajeSweet('ℹ️ Información', 'Formulario limpiado correctamente', 'info');
}



function mostrarMensajeSweet(titulo, mensaje, tipo = 'info') {
    return Swal.fire({
        title: titulo,
        html: mensaje,
        icon: tipo,
        confirmButtonText: 'Aceptar',
        confirmButtonColor: 'rgb(211, 47, 47)',
        background: 'rgb(255, 255, 255)'
    });
}

function mostrarConfirmacionSweet(titulo, mensaje) {
    return Swal.fire({
        title: titulo,
        text: mensaje,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Sí, continuar',
        cancelButtonText: 'Cancelar',
        confirmButtonColor: 'rgb(211, 47, 47)',
        cancelButtonColor: 'rgb(102, 102, 102)',
        background: 'rgb(255, 255, 255)'
    });
}


function precargarDatosFormulario() {
    
    let siguienteNumero = null;
    for (let i = 1; i <= 100; i++) {
        const numeroFormateado = `B-${String(i).padStart(3, '0')}`;
        if (!vehiculos.find(v => v.numero === numeroFormateado)) {
            siguienteNumero = i;
            break;
        }
    }
    
    if (siguienteNumero) {
        const numeroFormateado = `B-${String(siguienteNumero).padStart(3, '0')}`;
        document.getElementById('numeroUnidad').placeholder = `Ej: ${numeroFormateado}`;
        document.getElementById('numeroUnidad').disabled = false;
    } else {
        document.getElementById('numeroUnidad').placeholder = 'Límite alcanzado (B-001 a B-100)';
        document.getElementById('numeroUnidad').disabled = true;
    }
}



function cargarDatosEjemplo() {

    const espaciosDisponibles = 100 - vehiculos.length;
    if (espaciosDisponibles <= 0) {
        mostrarMensajeSweet('❌ Límite Alcanzado', 'No se pueden agregar más vehículos. Límite máximo: 100 unidades', 'error');
        return;
    }

    const vehiculosACargar = Math.min(3, espaciosDisponibles);
    
    mostrarConfirmacionSweet(
        '📥 Cargar Datos de Ejemplo', 
        `¿Desea cargar ${vehiculosACargar} vehículos de ejemplo?`
    ).then((result) => {
        if (result.isConfirmed) {
            let vehiculosAgregados = 0;
            
            vehiculosBaseDatos.forEach(vehiculo => {
                if (vehiculosAgregados < vehiculosACargar && 
                    !vehiculos.find(v => v.numero === vehiculo.numero)) {
                    vehiculos.push({
                        ...vehiculo,
                        fecha: new Date().toLocaleString()
                    });
                    vehiculosAgregados++;
                }
            });
            
            guardarDatos();
            actualizarVista();
            
            mostrarMensajeSweet(
                '✅ Datos Cargados', 
                `Se agregaron ${vehiculosAgregados} vehículos de ejemplo correctamente`,
                'success'
            );
        }
    });
}



function simularProcesoCompleto() {
    mostrarMensajeSweet(
        '🚒 Simulador de Gestión de Mantenimiento', 
        '<strong>Bienvenido al sistema de control de flota vehicular de bomberos</strong><br><br>' +
        'Este simulador le permitirá:<br><br>' +
        '• 📝 <strong>Registrar</strong> vehículos nuevos (B-001 a B-100)<br>' +
        '• 🔧 <strong>Realizar</strong> controles técnicos<br>' +
        '• 🛠️ <strong>Gestionar</strong> mantenimientos<br>' +
        '• 📊 <strong>Generar</strong> reportes de estado<br>' +
        '• 🚨 <strong>Detectar</strong> necesidades urgentes',
        'info'
    ).then(() => {
        
        const optimos = vehiculos.filter(v => v.condicionesOptimas).length;
        const problemas = vehiculos.length - optimos;
        const disponibles = 100 - vehiculos.length;
        
        let mensaje = `<strong>Resumen de la situación actual:</strong><br><br>`;
        mensaje += `🚒 <strong>Total de vehículos:</strong> ${vehiculos.length}/100<br>`;
        mensaje += `✅ <strong>En óptimas condiciones:</strong> ${optimos}<br>`;
        mensaje += `❌ <strong>Con problemas:</strong> ${problemas}<br>`;
        mensaje += `📦 <strong>Espacios disponibles:</strong> ${disponibles}<br><br>`;
        
        if (problemas > 0) {
            mensaje += `⚠️ <strong>Se recomienda revisar los vehículos con problemas</strong>`;
        } else if (vehiculos.length > 0) {
            mensaje += `🎉 <strong>¡Toda la flota está operativa!</strong>`;
        } else {
            mensaje += `📝 <strong>Use el formulario para agregar el primer vehículo</strong>`;
        }

        mostrarMensajeSweet('📊 Estado Actual de la Flota', mensaje, problemas > 0 ? 'warning' : 'success');
    });
}



function editarVehiculo(numeroVehiculo) {
    const vehiculo = vehiculos.find(v => v.numero === numeroVehiculo);
    if (!vehiculo) return;

    mostrarMensajeSweet(
        '✏️ Editar Vehículo',
        `Funcionalidad de edición para: <strong>${vehiculo.tipo} - ${vehiculo.numero}</strong><br><br>` +
        '<strong>Estado actual:</strong><br>' +
        `• Agua: ${vehiculo.agua}<br>` +
        `• Aceite: ${vehiculo.aceite}<br>` +
        `• Luces: ${vehiculo.luces}<br>` +
        `• Novedades: ${vehiculo.novedades}<br><br>` +
        '💡 <em>Para modificar, elimine y vuelva a agregar el vehículo</em>',
        'info'
    );
}

function solicitarEliminacion(numeroVehiculo) {
    const vehiculo = vehiculos.find(v => v.numero === numeroVehiculo);
    if (!vehiculo) return;

    vehiculoAEliminar = vehiculo;
    
    mostrarConfirmacionSweet(
        '🗑️ Eliminar Vehículo',
        `¿Está seguro de eliminar el vehículo?<br><br><strong>${vehiculo.tipo} - Unidad ${vehiculo.numero}</strong><br><br>` +
        '⚠️ Esta acción no se puede deshacer'
    ).then((result) => {
        if (result.isConfirmed) {
            vehiculos = vehiculos.filter(v => v.numero !== vehiculoAEliminar.numero);
            guardarDatos();
            actualizarVista();
            mostrarMensajeSweet('✅ Éxito', `Vehículo ${vehiculoAEliminar.numero} eliminado correctamente`, 'success');
            vehiculoAEliminar = null;
        }
    });
}


document.addEventListener('DOMContentLoaded', function() {
 
    const datosGuardados = cargarDatos();
    if (datosGuardados) {
        vehiculos = datosGuardados;
    } else {
        
        vehiculosBaseDatos.forEach(vehiculo => {
            vehiculos.push({
                ...vehiculo,
                fecha: new Date().toLocaleString()
            });
        });
        guardarDatos();
    }
    
    
    actualizarVista();
    

    document.getElementById('vehiculoForm').addEventListener('submit', function(e) {
        e.preventDefault();
        agregarVehiculo();
    });
    
    document.getElementById('btnVerResumen').addEventListener('click', verResumenEstado);
    document.getElementById('btnCargarEjemplo').addEventListener('click', cargarDatosEjemplo);
    document.getElementById('btnLimpiarTodo').addEventListener('click', limpiarTodo);
    document.getElementById('btnLimpiarForm').addEventListener('click', limpiarFormulario);
    document.getElementById('btnSimulacionCompleta').addEventListener('click', simularProcesoCompleto);
    
   
});