window.onload = function () {

    // Variables
    let color;
    let comienzaTrazo = false;

    // Usar SIEMPRE el canvas principal (.canvas2) para todo
    const canvas = document.querySelector('.canvas2');
    const lienzo = canvas; 
    const ctx = canvas.getContext('2d');

    let grosorInicial = 3;

    const colores = ["#FF0000", "#00FF00", "#0000FF", "#FFFF00", "#FF00FF", "#00FFFF", "#FEA6CB", "#FFA500"];

    // restaurar modo normal 
    function restaurarDibujoNormal() {
        ctx.globalCompositeOperation = "source-over";
        ctx.lineWidth = grosorInicial;
        lienzo.style.cursor = "url('/imagenes/rotu.png') 0 100, pointer";
    }

    // Seleccionador de color
    const colorPicker = document.getElementById('colorPicker');
    colorPicker.addEventListener('input', function (event) {
        color = event.target.value;
        restaurarDibujoNormal();      // salir del modo goma si estaba activo
        ctx.strokeStyle = color;
    });

    // Eventos para tamaños del grosor
    const tamaño1 = document.querySelector(".tamaño1");
    const tamaño2 = document.querySelector(".tamaño2");
    const tamaño3 = document.querySelector(".tamaño3");

    tamaño1.addEventListener("click", cambiarTamaño1);
    tamaño2.addEventListener("click", cambiarTamaño2);
    tamaño3.addEventListener("click", cambiarTamaño3);

    // Evento para la goma
    const borrar = document.querySelector(".borrar");
    borrar.addEventListener("click", activarBorrador);

    // Evento para borrar todo
    const borrarTodo = document.querySelector(".papelera");
    borrarTodo.addEventListener("click", borrarCanvas);

    // Pintar colores
    for (let c of colores) {
        let divsColores = document.createElement("div");
        divsColores.classList = 'color';
        divsColores.id = c;
        divsColores.style.backgroundColor = c;

        divsColores.addEventListener('click', function (event) {
            cambiarColor(event);
        });

        document.querySelector('.colores-contenedor').append(divsColores);
    }

    function cambiarColor(event) {
        color = event.target.id;
        restaurarDibujoNormal();    // salir del modo goma
        ctx.strokeStyle = color;
    }

    /*************** Eventos ratón ***************/
    lienzo.addEventListener('mousedown', pulsaRaton);
    lienzo.addEventListener('mousemove', mueveRaton);
    document.addEventListener('mouseup', levantaRaton);

    function pulsaRaton(event) {
        comienzaTrazo = true;
        ctx.beginPath();
        ctx.moveTo(event.offsetX, event.offsetY);
    }

    function mueveRaton(event) {
        if (!comienzaTrazo) return;
        ctx.lineTo(event.offsetX, event.offsetY);
        ctx.stroke();
    }

    function levantaRaton() {
        ctx.closePath();
        comienzaTrazo = false;
    }

    /********** Cambiar grosor **********/
    function cambiarTamaño1() {
        grosorInicial = 5;
        ctx.lineWidth = grosorInicial;
    }

    function cambiarTamaño2() {
        grosorInicial = 10;
        ctx.lineWidth = grosorInicial;
    }

    function cambiarTamaño3() {
        grosorInicial = 15;
        ctx.lineWidth = grosorInicial;
    }

    /********** Goma **********/
    function activarBorrador() {
        // NO machacamos grosorInicial, solo cambiamos el estado de borrado
        ctx.globalCompositeOperation = "destination-out";
        ctx.lineWidth = 40;
        lienzo.style.cursor = "url('/imagenes/goma.png') 0 100, pointer";
    }

    /******************** Seleccionar imagen ********************/
    const imagenSeleccionada = document.getElementById('file-input');
    const fileNameEl = document.getElementById("file-name");

    imagenSeleccionada.addEventListener("change", () => {
        fileNameEl.textContent = imagenSeleccionada.files?.[0]?.name || "Sin archivo";
    });

    imagenSeleccionada.addEventListener('change', function (event) {
        const file = event.target.files[0];
        if (!file) return;

        const reader = new FileReader();

        reader.onload = function (e) {
            const img = new Image();
            img.src = e.target.result;

            img.onload = function () {
                restaurarDibujoNormal(); // volver a modo normal antes de dibujar imagen
                ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
            };
        };

        reader.readAsDataURL(file);
    });

    /********************** Insertar texto **********************/
    document.querySelector('.addTexto').addEventListener('click', agregarTexto);

    function agregarTexto() {
        const text = document.querySelector('.textoInput').value;
        if (!text) return;

        restaurarDibujoNormal(); // volver a modo normal antes del texto

        const x = canvas.width / 2;
        const y = canvas.height / 2;

        ctx.font = '40px Comic Sans MS';
        ctx.fillStyle = 'black';
        ctx.textAlign = 'center';

        ctx.fillText(text, x, y);
    }

    /***** Borrar todo *****/
    function borrarCanvas() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Al borrar todo, deja el canvas listo para seguir trabajando
        restaurarDibujoNormal();
    }
};
