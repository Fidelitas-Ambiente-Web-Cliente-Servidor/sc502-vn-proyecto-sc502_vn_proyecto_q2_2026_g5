const formulario = document.getElementById("formPerfil");

cargarPerfil();

formulario.addEventListener("submit", guardarPerfil);

function guardarPerfil(e){

    e.preventDefault();

    const perfil={

        nombre:document.getElementById("nombre").value,

        correo:document.getElementById("correo").value,

        telefono:document.getElementById("telefono").value,

        direccion:document.getElementById("direccion").value,

        sitio:document.getElementById("sitio").value,

        facebook:document.getElementById("facebook").value,

        instagram:document.getElementById("instagram").value,

        descripcion:document.getElementById("descripcion").value

    };

    localStorage.setItem("perfil",JSON.stringify(perfil));

    actualizarVista(perfil);

    alert("Información guardada correctamente.");

}

function cargarPerfil(){

    const perfil=JSON.parse(localStorage.getItem("perfil"));

    if(!perfil) return;

    document.getElementById("nombre").value=perfil.nombre;

    document.getElementById("correo").value=perfil.correo;

    document.getElementById("telefono").value=perfil.telefono;

    document.getElementById("direccion").value=perfil.direccion;

    document.getElementById("sitio").value=perfil.sitio;

    document.getElementById("facebook").value=perfil.facebook;

    document.getElementById("instagram").value=perfil.instagram;

    document.getElementById("descripcion").value=perfil.descripcion;

    actualizarVista(perfil);

}

function actualizarVista(perfil){

    document.getElementById("pNombre").textContent=perfil.nombre || "Huellas a Casa";

    document.getElementById("pCorreo").textContent=perfil.correo || "";

    document.getElementById("pTelefono").textContent=perfil.telefono || "";

    document.getElementById("pDireccion").textContent=perfil.direccion || "";

    document.getElementById("pDescripcion").textContent=perfil.descripcion || "";

}