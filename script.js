console.log("=== SISTEMA DE CONTROL DE MANTENIMIENTO ===");
console.log("Escriba 'salir' en cualquier momento para cancelar la operación actual");
mostrarMenu();

let vehiculos = [];

function mostrarMenu() {
    let opcion;
    do {
        opcion = prompt(`=== CONTROL DE MANTENIMIENTO BOMBEROS ===
        
1. Agregar vehículos
2. Ver resumen de estado
3. Salir

Seleccione una opción (o escriba 'salir' en cualquier momento):`);

        if (opcion && normalizarTexto(opcion) === "salir") {
            alert("Gracias por tu Servicio");
            return;
        }

        switch(opcion) {
            case "1":
                agregarVehiculos();
                break;
            case "2":
                verResumenEstado();
                break;
            case "3":
                alert("Gracias por tu Servicio");
                break;
            default:
                if (opcion !== null) {
                    alert("Opción no válida.");
                }
        }
    } while(opcion !== "3" && opcion !== null);
}

function normalizarTexto(texto) {
    if (!texto) return "";
    return texto.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").trim();
}

function agregarVehiculos() {
    const cantidadvehiculos = prompt("¿Cuántas unidades desea agregar? (o escriba 'salir' para cancelar)");
    
    // salir
    if (cantidadvehiculos && normalizarTexto(cantidadvehiculos) === "salir") {
        console.log("Operación cancelada");
        return;
    }
    
    const cantidad = parseInt(cantidadvehiculos);
    
    if (isNaN(cantidad) || cantidad <= 0) {
        alert("Debe ingresar un número válido.");
        return;
    }
    
    for (let i = 0; i < cantidad; i++) {
        const cancelado = agregarUnVehiculo();
        
        if (cancelado) {
            console.log("Operación cancelada.");
            break;
        }
    }
    
    if (cantidad > 0) {
        alert(`Se agregaron ${cantidad} vehículos correctamente.`);
    }
}

function agregarUnVehiculo() {
    const numero = prompt("Ingrese el número de unidad (o escriba 'salir' para cancelar):");
    
    // Permitir salir
    if (numero && normalizarTexto(numero) === "salir") {
        return true; 
    }
    
    // Opciones para tipo de vehículo
    const tipo = prompt("Seleccione tipo de vehículo:\n1. Chata\n2. Autobomba\n3. Escalera Mecánica\n4. Ambulancia\n5. Lancha\n6. Autobomba de Abastecimiento\n7. Transporte de Personal\n\nIngrese el número correspondiente (o escriba 'salir' para cancelar):");
    
    // Permitir salir
    if (tipo && normalizarTexto(tipo) === "salir") {
        return true; 
    }
    
    let tipoVehiculo = "";
    switch(tipo) {
        case "1":
            tipoVehiculo = "Chata";
            break;
        case "2":
            tipoVehiculo = "Autobomba";
            break;
        case "3":
            tipoVehiculo = "Escalera Mecánica";
            break;
        case "4":
            tipoVehiculo = "Ambulancia";
            break;
        case "5":
            tipoVehiculo = "Lancha";
            break;
        case "6":
            tipoVehiculo = "Autobomba de Abastecimiento";
            break;
        case "7":
            tipoVehiculo = "Transporte de Personal";
            break;
        default:
            tipoVehiculo = "No especificado";
    }
    
    let agua = prompt("Nivel de agua del Motor (Óptimo/Bajo) (o escriba 'salir' para cancelar):");
    // Permitir salir
    if (agua && normalizarTexto(agua) === "salir") {
        return true;
    }
    
    let aceite = prompt("Nivel de aceite del Motor (Óptimo/Bajo) (o escriba 'salir' para cancelar):");
    // Permitir salir
    if (aceite && normalizarTexto(aceite) === "salir") {
        return true;
    }
    
    let luces = prompt("Estado de luces General (Funcionan/No funcionan) (o escriba 'salir' para cancelar):");
    // Permitir salir
    if (luces && normalizarTexto(luces) === "salir") {
        return true;
    }
    
    const novedades = prompt("Ingrese novedades (o escriba 'salir' para cancelar):");
    // Permitir salir
    if (novedades && normalizarTexto(novedades) === "salir") {
        return true;
    }
    
    // Acepta cualquier variación de escritura
    agua = normalizarTexto(agua).includes("bajo") ? "Bajo" : "Óptimo";
    aceite = normalizarTexto(aceite).includes("bajo") ? "Bajo" : "Óptimo";
    luces = normalizarTexto(luces).includes("no") ? "No funcionan" : "Funcionan";
    
    const vehiculo = {
        numero: numero,
        tipo: tipoVehiculo,
        agua: agua,
        aceite: aceite,
        luces: luces,
        novedades: novedades,
        condicionesOptimas: (agua === "Óptimo" && aceite === "Óptimo" && luces === "Funcionan")
    };
    
    vehiculos.push(vehiculo);
    
    
    console.log("=== VEHÍCULO AGREGADO ===");
    console.log(`Unidad: ${vehiculo.numero} - ${vehiculo.tipo}`);
    console.log(`Agua: ${vehiculo.agua}`);
    console.log(`Aceite: ${vehiculo.aceite}`);
    console.log(`Luces: ${vehiculo.luces}`);
    console.log(`Novedades: ${vehiculo.novedades}`);
    
    if (vehiculo.condicionesOptimas) {
        console.log("VEHÍCULO EN CONDICIONES ÓPTIMAS DE UTILIZAR");
    } else {
        console.log("VEHÍCULO REQUIERE MANTENIMIENTO");
    }
    console.log("----------------------");
    
    // mantenimiento urgente
    if (agua === "Bajo" || aceite === "Bajo" || luces === "No funcionan") {
        alert(`¡ATENCIÓN! Unidad ${numero} (${tipoVehiculo}) necesita mantenimiento URGENTE. Se recomienda NO UTILIZAR`);
    }
    
    return false;
}

function verResumenEstado() {
    console.log("=== RESUMEN DE ESTADO DE VEHICULOS ===");
    console.log("");
    
    if (vehiculos.length === 0) {
        console.log("No hay vehículos registrados.");
        return;
    }
    
    const optimos = vehiculos.filter(v => v.condicionesOptimas).length;
    const conProblemas = vehiculos.length - optimos;
    
    console.log(`Total de vehículos: ${vehiculos.length}`);
    console.log(`En condiciones óptimas: ${optimos}`);
    console.log(`Requieren mantenimiento: ${conProblemas}`);
    console.log("");
    
    // vehiculos sin funcionar
    if (conProblemas > 0) {
        console.log("=== VEHÍCULOS QUE REQUIEREN MANTENIMIENTO ===");
        vehiculos.forEach(vehiculo => {
            if (!vehiculo.condicionesOptimas) {
                console.log(`• Unidad ${vehiculo.numero} - ${vehiculo.tipo}`);
                
                if (vehiculo.agua === "Bajo") console.log("  - Agua baja");
                if (vehiculo.aceite === "Bajo") console.log("  - Aceite bajo");
                if (vehiculo.luces === "No funcionan") console.log("  - Luces no funcionan");
                
                console.log(`  - Novedades: ${vehiculo.novedades}`);
                console.log("");
            }
        });
    }
}

