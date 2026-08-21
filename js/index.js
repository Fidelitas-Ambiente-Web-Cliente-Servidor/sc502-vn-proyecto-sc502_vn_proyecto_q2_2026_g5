const API_ANIMALES =
    "api/animales.php";

const API_ORGANIZACIONES =
    "api/organizaciones.php";

const API_REPORTES =
    "api/reportes.php";


const totalAnimales =
    document.getElementById(
        "totalAnimales"
    );

const totalAdoptados =
    document.getElementById(
        "totalAdoptados"
    );

const totalReportes =
    document.getElementById(
        "totalReportes"
    );

const totalOrganizaciones =
    document.getElementById(
        "totalOrganizaciones"
    );




cargarInicio();


async function cargarInicio() {

    await Promise.all([
        cargarAnimales(),
        cargarOrganizaciones(),
        cargarReportes()
    ]);

}




async function cargarAnimales() {

    try {

        const respuesta =
            await fetch(
                API_ANIMALES
            );


        const resultado =
            await respuesta.json();


        if (!resultado.ok) {

            return;
        }


        const animales =
            resultado.datos || [];


        totalAnimales.textContent =
            animales.length;


        const adoptados =
            animales.filter(
                animal =>
                    animal.estado ===
                    "Adoptado"
            );


        totalAdoptados.textContent =
            adoptados.length;


    } catch (error) {

        console.error(
            "Error cargando animales:",
            error
        );

    }

}

async function cargarOrganizaciones() {

    try {

        const respuesta =
            await fetch(
                API_ORGANIZACIONES
            );


        const resultado =
            await respuesta.json();


        if (!resultado.ok) {

            return;
        }


        totalOrganizaciones.textContent =
            (resultado.datos || []).length;


    } catch (error) {

        console.error(
            "Error cargando organizaciones:",
            error
        );

    }

}


async function cargarReportes() {

    try {

        const respuesta =
            await fetch(
                API_REPORTES
            );


        const resultado =
            await respuesta.json();


        if (!resultado.ok) {

            return;
        }


        const reportes =
            resultado.datos || [];


        const activos =
            reportes.filter(
                reporte =>
                    reporte.estado ===
                    "Activo"
            );


        totalReportes.textContent =
            activos.length;


    } catch (error) {

        console.error(
            "Error cargando reportes:",
            error
        );


        totalReportes.textContent =
            "0";

    }

}