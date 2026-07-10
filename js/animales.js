let animales = JSON.parse(localStorage.getItem("animales")) || [];

const tabla = document.getElementById("tablaAnimales");

const formulario = document.getElementById("formAnimal");

const buscar = document.getElementById("buscar");

mostrarAnimales();

formulario.addEventListener("submit", guardarAnimal);

buscar.addEventListener("keyup", filtrar);

function guardarAnimal(e){

    e.preventDefault();

    const id = document.getElementById("idAnimal").value;

    const animal = {

        id: id=="" ? Date.now() : Number(id),

        nombre: document.getElementById("nombre").value,

        especie: document.getElementById("especie").value,

        edad: document.getElementById("edad").value,

        estado: document.getElementById("estado").value

    };

    if(id==""){

        animales.push(animal);

    }else{

        const indice = animales.findIndex(a=>a.id==id);

        animales[indice]=animal;

    }

    actualizarStorage();

    formulario.reset();

    document.getElementById("idAnimal").value="";

    mostrarAnimales();

}

function mostrarAnimales(lista=animales){

    tabla.innerHTML="";

    lista.forEach(animal=>{

        tabla.innerHTML+=`

        <tr>

            <td>${animal.nombre}</td>

            <td>${animal.especie}</td>

            <td>${animal.edad} años</td>

            <td>${animal.estado}</td>

            <td>

                <button
                    class="btnEditar"
                    onclick="editar(${animal.id})">

                    Editar

                </button>

                <button
                    class="btnEliminar"
                    onclick="eliminarAnimal(${animal.id})">

                    Eliminar

                </button>

            </td>

        </tr>

        `;

    });

}

function editar(id){

    const animal = animales.find(a=>a.id==id);

    document.getElementById("idAnimal").value=animal.id;

    document.getElementById("nombre").value=animal.nombre;

    document.getElementById("especie").value=animal.especie;

    document.getElementById("edad").value=animal.edad;

    document.getElementById("estado").value=animal.estado;

}

function eliminarAnimal(id){

    if(confirm("¿Eliminar este animal?")){

        animales = animales.filter(a=>a.id!=id);

        actualizarStorage();

        mostrarAnimales();

    }

}

function filtrar(){

    const texto = buscar.value.toLowerCase();

    const resultado = animales.filter(a=>

        a.nombre.toLowerCase().includes(texto)

        ||

        a.especie.toLowerCase().includes(texto)

    );

    mostrarAnimales(resultado);

}

function actualizarStorage(){

    localStorage.setItem("animales",JSON.stringify(animales));

}