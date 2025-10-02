
class SistemaMantenimiento {
    constructor() {
        this.vehiculos = this.cargarDatos() || [];
        this.iniciarEventos();
        this.actualizarVista();
        console.log("✅ Sistema iniciado - Evolución del proyecto de consola");
    }

    
    guardarDatos() {
        localStorage.setItem('vehiculosBomberos', JSON.stringify(this.vehiculos));
    }

    cargarDatos() {
        const datos = localStorage.getItem('vehiculosBomberos');
        return datos ? JSON.parse(datos) : null;
    }

    
    iniciarEventos() {
        document.getElementById('vehiculoForm').addEventListener('submit', (e) => {
            e.preventDefault();
            this.agregarVehiculo();
        });

        document.getElementById('btnVerResumen').addEventListener('click', () => {
            this.mostrarResumen();
        });

        document.getElementById('btnLimpiarTodo').addEventListener('click', () => {
            this.limpiarDatos();
        });
    }

    
    agregarVehiculo() {
        const numero = document.getElementById('numeroUnidad').value;
        const tipo = document.getElementById('tipoVehiculo').value;
        const agua = document.getElementById('nivelAgua').value;
        const aceite = document.getElementById('nivelAceite').value;
        const luces = document.getElementById('estadoLuces').value;
        const novedades = document.getElementById('novedades').value || 'Sin novedades';

        
        if (!numero) {
            this.mostrarMensaje('El número de unidad es obligatorio', 'error');
            return;
        }

        
        if (this.vehiculos.find(v => v.numero === numero)) {
            this.mostrarMensaje(`Ya existe un vehículo con el número ${numero}`, 'error');
            return;
        }

        
        const vehiculo = {
            numero: numero,
            tipo: tipo,
            agua: agua,
            aceite: aceite,
            luces: luces,
            novedades: novedades,
            fecha: new Date().toLocaleString(),
            
            optimo: (agua === "Óptimo" && aceite === "Óptimo" && luces === "Funcionan")
        };

        this.vehiculos.push(vehiculo);
        this.guardarDatos();
        this.actualizarVista();
        
        
        document.getElementById('vehiculoForm').reset();
        
        
        if (agua === "Bajo" || aceite === "Bajo" || luces === "No funcionan") {
            this.mostrarMensaje(
                `¡ATENCIÓN! Unidad ${numero} necesita mantenimiento URGENTE. Se recomienda NO UTILIZAR`, 
                'urgente'
            );
        } else {
            this.mostrarMensaje(`Vehículo ${numero} agregado correctamente`, 'success');
        }
    }

    
    actualizarVista() {
        this.actualizarEstadisticas();
        this.actualizarLista();
    }

    actualizarEstadisticas() {
        const total = this.vehiculos.length;
        const optimos = this.vehiculos.filter(v => v.optimo).length;
        const problemas = total - optimos;

        document.getElementById('totalVehiculos').textContent = total;
        document.getElementById('vehiculosOptimos').textContent = optimos;
        document.getElementById('vehiculosProblemas').textContent = problemas;
    }

    actualizarLista() {
        const lista = document.getElementById('listaVehiculos');
        
        if (this.vehiculos.length === 0) {
            lista.innerHTML = '<div class="empty-state"><p>🎯 No hay vehículos registrados</p></div>';
            return;
        }

        const html = this.vehiculos.map(vehiculo => `
            <div class="vehiculo ${vehiculo.optimo ? '' : 'problema'}">
                <div class="vehiculo-header">
                    <strong>${vehiculo.tipo} - ${vehiculo.numero}</strong>
                    <span class="estado ${vehiculo.optimo ? 'optimo' : 'problema'}">
                        ${vehiculo.optimo ? '✅ Óptimo' : '❌ Problemas'}
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
            </div>
        `).join('');

        lista.innerHTML = html;
    }

    
    mostrarResumen() {
        const optimos = this.vehiculos.filter(v => v.optimo).length;
        const problemas = this.vehiculos.length - optimos;
        const urgentes = this.vehiculos.filter(v => 
            !v.optimo && (v.agua === "Bajo" || v.aceite === "Bajo")
        ).length;

        let mensaje = `📊 RESUMEN DE FLOTA\n\n`;
        mensaje += `Total vehículos: ${this.vehiculos.length}\n`;
        mensaje += `✅ Óptimos: ${optimos}\n`;
        mensaje += `❌ Con problemas: ${problemas}\n`;
        mensaje += `🚨 Urgentes: ${urgentes}\n\n`;

        if (urgentes > 0) {
            mensaje += `Vehículos que necesitan atención inmediata:\n`;
            this.vehiculos.filter(v => !v.optimo && (v.agua === "Bajo" || v.aceite === "Bajo"))
                .forEach(v => {
                    mensaje += `• ${v.tipo} ${v.numero}\n`;
                });
        }

        alert(mensaje); 
    }

    limpiarDatos() {
        if (confirm('¿Está seguro de eliminar TODOS los datos?')) {
            this.vehiculos = [];
            localStorage.removeItem('vehiculosBomberos');
            this.actualizarVista();
            this.mostrarMensaje('Todos los datos han sido eliminados', 'success');
        }
    }

    mostrarMensaje(mensaje, tipo = 'info') {
        
        const mensajeDiv = document.createElement('div');
        mensajeDiv.className = `mensaje ${tipo}`;
        mensajeDiv.textContent = mensaje;
        
        document.querySelector('.main-content').prepend(mensajeDiv);
        
        setTimeout(() => {
            mensajeDiv.remove();
        }, 5000);
    }
}


document.addEventListener('DOMContentLoaded', () => {
    new SistemaMantenimiento();
});