//config
import dataD from './config.json' assert {
    type: 'json'
};

const init = () => {
    
    //---
    let db = new PouchDB('holaDb');
    let db_ = new PouchDB('holaDb2');
    let renderNombre = document.getElementById("nombre");

    //formulario crear nota
    const autor = document.getElementById("autor");
    const titulo = document.getElementById("titulo");
    const contenido = document.getElementById("contenido");
    const btnenviar = document.getElementById("enviar");
    
    //formulario editar
    const identificador = document.getElementById("identificador");
    const autorE = document.getElementById("autorE");
    const tituloE = document.getElementById("tituloE");
    const contenidoE = document.getElementById("contenidoE");
    const btnenviarEditar = document.getElementById("enviarEditar");
    const btenviarBorrar = document.getElementById("enviarBorrar");
    const autorId = document.getElementById("autorId");

    //render
    const renderTextos = document.getElementById("render-textos");

    //parse
    Parse.initialize(dataD.data.id, dataD.data.key); //Back4App
    Parse.serverURL = dataD.data.parseUrl;

    const datos = () => {

        db.allDocs({include_docs: true}, 
            (error, docs) => {
                if (error){
                    console.log(error);
                } else {
                    let data = docs.rows;

                    db.info().then(function (result) {
                        const contador = result.doc_count;
                        
                        if (contador == 0) {
                            const fecha = Date.now();
                            let holaMundo = prompt("Cual es tu nombre?");
                            if(holaMundo == "" || holaMundo == null){
                                alert("por favor ingrese su nombre");
                            }else{
                                db.put({
                                    _id: fecha.toString(), //id para indentificar
                                    fecha: new Date(),
                                    nombre: holaMundo
                                }).then(function(response){
                                    //se obtienen datos de la base de datos local
                                    console.log(response);
                                    location.reload();
                                }).catch(function(err){
                                    console.log(err);
                                });
                            }
                        }
                    });

                    //se recorren los datos guardados
                    data.map(items => {
                        //se obtienen datos guardados local
                        console.log("Datos: ",items.doc);
                        const nombre = items.doc.nombre;
                        renderNombre.innerHTML += `<h1 class="text-center">Hola ${nombre} <span id="borrar" title="borrar nombre"><i class="bi bi-eraser"></i></span></h1><hr>`;
                        //autor.value = nombre;
                        document.title = `Hola ${nombre}`;

                        const borrar = document.getElementById("borrar");
                        const borradoDb = () => {
                            let borrarNombre = confirm("¿Quierer borrar el nombre?");
                            
                            if(borrarNombre != false){
                                db.destroy().then(function (response) {
                                    console.log(response);
                                    if(response.ok){
                                        alert("Nombre borrado");
                                        location.reload();
                                    }
                                }).catch(function (err) {
                                    console.log(err);
                                });
                            }
                        }
                        borrar.addEventListener('click',borradoDb);
                    })
                }
            });
    }

    const generarCarta = () =>{

        const insertarDatos = () => {

            const carta = new Parse.Object("cartas");
            carta.set("autor", autor.value);
            carta.set("titulo", titulo.value);
            carta.set("contenido", contenido.value);
            try {
                    let result = carta.save();
                    console.log(result);
                    try {
                        const autor = carta.get("autor");
                        const titulo = carta.get("titulo");
                        const contenido = carta.get("contenido");
                        console.log(`autor: ${autor}, titulo: ${titulo}, contenido: ${contenido}`);
                        setInterval(function(){
                            location.reload();
                        },2000);

                    } catch (error) {
                        console.log(`Failed to retrieve the object, with error code: ${error.message}`);
                    }

                } catch(error) {
                    console.log('Failed to create new object, with error code: ' + error.message);
                }
        }
        btnenviar.addEventListener("click",insertarDatos);

    }

    const data = async () => {
        const cartas = new Parse.Query("cartas");
        try {
          const resultados = await cartas.find();
          for (const object of resultados) {

            const autor = object.get('autor');
            const titulo = object.get('titulo');
            const contenido = object.get('contenido');

            // console.log(autor);
            // console.log(titulo);
            // console.log(contenido);

            renderTextos.innerHTML += `
                <div class="container">
                    <h3 class="text-left">${titulo}</h3>
                    <hr>
                    <p class="text-center fuente28">
                        ${contenido}
                    </p>
                    <p class="texto-d">Autor: ${autor}</p>
                </div>
            `;
          }
        } catch (error) {
          console.error('Error while fetching Project', error);
        }
    }

    const actualizarCartas = async () => {
        document.getElementById("aceptar").style.display="none";
        const cartas = new Parse.Query('cartas');

        try {
            const resultados = await cartas.find();
            for (const object of resultados) {
                const titulo = object.get('titulo');
                const id = object.id;
                identificador.innerHTML += `
                    <option value="${id}">${titulo}</option>
                `
            }
        } catch (error) {
            console.error('Error while fetching Project', error);
        }

        //select para cambiar el elmento que se quiere editar
        identificador.addEventListener('change', async (event) => {
            autorId.value = event.target.value;

            // try {
            //     const resultados = await cartas.find();
            //     for (const object of resultados) {

            //         tituloE.value = object.get('titulo');
            //         autorE.value = object.get('autor');
            //         contenidoE.value = object.get('contenido');
            //         const id = object.id;

            //         identificador.innerHTML += `
            //             <option value="${id}">${titulo}</option>
            //         `
            //     }
            // } catch (error) {
            //     console.error('Error while fetching Project', error);
            // }
        });

        try {
            const resultados = await cartas.find();

            for (const object of resultados) {
  
                const autor = object.get('autor');
                const titulo = object.get('titulo');
                const contenido = object.get('contenido');
                const id = object.id;

                //actualizar elemento de la base de datos
                btnenviarEditar.addEventListener('click', async function(){
                    if(autorId.value == id){

                        tituloE.value = titulo;
                        autorE.value = autor;
                        contenidoE.value = contenido;
                        document.getElementById("aceptar").style.display="initial";

                        document.getElementById("aceptar").addEventListener('click', async function(){
                            // try {
                            //         const object = await cartas.get(id);
                            //         object.set('autor', autorE.value);
                            //         object.set('titulo', tituloE.value);
                            //         object.set('contenido', contenidoE.value);
                            //     try {
                            //         const response = await object.save();
                            //         console.log(response.get('autor'));
                            //         console.log(response.get('titulo'));
                            //         console.log(response.get('contenido'));
                            //         console.log('updated', response);
                            //         setInterval(function(){
                            //             location.reload();
                            //         },2000);
                            //     } catch (error) {
                            //         console.error('Error ', error);
                            //     }
                            // } catch (error) {
                            //     console.error('Error while retrieving object ', error);
                            // }
                        });
                    }
                });

                //borrar elemento de la base de datos
                btenviarBorrar.addEventListener('click', async function(){

                    if(autorId.value == id){
                        console.log("se elimino "+id);
                        // try {
                        //     const object = await cartas.get(id);
                        //     try {
                        //         const response = await object.destroy();
                        //         console.log('se elimino el objeto', response);
                        //         setInterval(function(){
                        //             location.reload();
                        //         },2000);
                        //     } catch (error) {
                        //         console.error('Error while deleting ParseObject', error);
                        //     }
                        // } catch (error) {
                        //     console.error('Error while retrieving ParseObject', error);
                        // }
                    }
                });
            }
        } catch (error) {
            console.error('Error while fetching Project', error);
        }
    }

    var pathname = window.location.pathname;
    if(pathname == "/cartasJson/" || pathname == "/"){
        data();
        datos();
    }else{
        generarCarta();
        actualizarCartas();
    }

}
//se activa el metodo
init();