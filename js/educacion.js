document.addEventListener("DOMContentLoaded", function () {
 
    // ---------- ACORDEÓN (Legislación) ----------
 
    let items = document.querySelectorAll("#acordeon .item");
 
    items.forEach(function (item) {
 
        let boton = item.querySelector(".pregunta");
        let respuesta = item.querySelector(".respuesta");
 
        boton.addEventListener("click", function () {
 
            let yaAbierto = item.classList.contains("abierto");
 
            
            items.forEach(function (otro) {
                otro.classList.remove("abierto");
                otro.querySelector(".respuesta").style.maxHeight = null;
            });
 
            if (!yaAbierto) {
                item.classList.add("abierto");
                respuesta.style.maxHeight = respuesta.scrollHeight + "px";
            }
 
        });
 
    });
 
});