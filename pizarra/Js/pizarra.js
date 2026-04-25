window.onload = function () {

    // Variables
    let color;
    let comienzaTrazo = false;

    const canvas = document.querySelector('.canvas2');
    const lienzo = canvas; 
    const ctx = canvas.getContext('2d');

    let grosorInicial = 3;

    const colores = ["#FF0000", "#00FF00", "#0000FF", "#FFFF00", "#FF00FF", "#00FFFF", "#FEA6CB", "#FFA500"];

    function restaurarDibujoNormal() {
        ctx.globalCompositeOperation = "source-over";
        ctx.lineWidth = grosorInicial;
        lienzo.style.cursor = "url('/imagenes/rotu.png') 0 100, pointer";
    }

    // Color picker
    const colorPicker = document.getElementById('colorPicker');
    colorPicker.addEventListener('input', function (event) {
        color = event.target.value;
        restaurarDibujoNormal();
        ctx.strokeStyle = color;
    });

    // Tamaños
    document.querySelector(".tamaño1").addEventListener("click", () => ctx.lineWidth = grosorInicial = 5);
    document.querySelector(".tamaño2").addEventListener("click", () => ctx.lineWidth = grosorInicial = 10);
    document.querySelector(".tamaño3").addEventListener("click", () => ctx.lineWidth = grosorInicial = 15);

    // Goma
    document.querySelector(".borrar").addEventListener("click", function () {
        ctx.globalCompositeOperation = "destination-out";
        ctx.lineWidth = 40;
        lienzo.style.cursor = "url('/imagenes/goma.png') 0 100, pointer";
    });

    // Borrar todo
    document.querySelector(".papelera").addEventListener("click", function () {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        restaurarDibujoNormal();
    });

    // Colores
    for (let c of colores) {
        let div = document.createElement("div");
        div.classList = 'color';
        div.id = c;
        div.style.backgroundColor = c;

        div.addEventListener('click', function (event) {
            color = event.target.id;
            restaurarDibujoNormal();
            ctx.strokeStyle = color;
        });

        document.querySelector('.colores-contenedor').append(div);
    }

    /*************** RATÓN  ***************/
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

    /*************** MÓVIL***************/
    lienzo.addEventListener('touchstart', function (e) {
        e.preventDefault();
        const rect = lienzo.getBoundingClientRect();
        const touch = e.touches[0];

        comienzaTrazo = true;
        ctx.beginPath();
        ctx.moveTo(
            (touch.clientX - rect.left) * (canvas.width / rect.width),
            (touch.clientY - rect.top) * (canvas.height / rect.height)
        );
    });

    lienzo.addEventListener('touchmove', function (e) {
        if (!comienzaTrazo) return;
        e.preventDefault();

        const rect = lienzo.getBoundingClientRect();
        const touch = e.touches[0];

        ctx.lineTo(
            (touch.clientX - rect.left) * (canvas.width / rect.width),
            (touch.clientY - rect.top) * (canvas.height / rect.height)
        );

        ctx.stroke();
    });

    document.addEventListener('touchend', function () {
        comienzaTrazo = false;
        ctx.closePath();
    });

    /*************** IMAGEN ***************/
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
                restaurarDibujoNormal();
                ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
            };
        };

        reader.readAsDataURL(file);
    });

    /*************** TEXTO ***************/
    document.querySelector('.addTexto').addEventListener('click', function () {
        const text = document.querySelector('.textoInput').value;
        if (!text) return;

        restaurarDibujoNormal();

        ctx.font = '40px Comic Sans MS';
        ctx.fillStyle = 'black';
        ctx.textAlign = 'center';

        ctx.fillText(text, canvas.width / 2, canvas.height / 2);
    });

};
