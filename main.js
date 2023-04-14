//config
import dataD from './config.json' assert {
    type: 'json'
};

const init = () => {
    
    //---
    let db = new PouchDB('holaDb');
    let db_ = new PouchDB('holaDb2');
    let renderNombre = document.getElementById("nombre");
    let renderNombre_ = document.getElementById("nombre_")
    //formulario crear nota
    const autor = document.getElementById("autor");
    const titulo = document.getElementById("titulo");
    const contenido = document.getElementById("contenido");
    const btnenviar = document.getElementById("enviar");
    
    //formulario editar
    // const identificador = document.getElementById("identificador");
    // const autorE = document.getElementById("autorE");
    // const tituloE = document.getElementById("tituloE");
    // const contenidoE = document.getElementById("contenidoE");

    const renderEditor = document.getElementById("render-editor");

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
                        renderNombre.innerHTML += `<h5 class="text-center">Hola ${nombre} <span id="borrar_" title="borrar nombre"><i class="bi bi-eraser"></i></span></h5><hr>`;
                        //autor.value = nombre;
                        document.title = `Hola ${nombre}`;

                        const borrar = document.getElementById("borrar_");
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
            const fecha = object.get('createdAt').toLocaleDateString("en-US");

            renderTextos.innerHTML += `
                <div class="container">
                    <h3 class="text-left">${titulo}</h3>
                    <hr>
                    <p class="text-center fuente28">
                        ${contenido}
                    </p>
                    <p class="texto-d">Autor: ${autor}</p>
                    <p class="texto-d">Fecha: ${fecha}</p>
                </div>
            `;
          }
        } catch (error) {
          console.error('Error while fetching Project', error);
        }
    }

    const actualizarCartas = async () => {
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

            for(const object of resultados){
  
                const autor = object.get('autor');
                const titulo = object.get('titulo');
                const contenido = object.get('contenido');
                const id = object.id;
                const fecha = object.get('createdAt');

                renderEditor.innerHTML += `
                    <div class="mb-3">
                        <span>fecha: ${fecha.toLocaleDateString("en-US")}</span>
                        <input type="text" value="${autor}" id="autorE" placeholder="Autor" class="form-control input" disabled>
                        <input type="text" name="${id}" value="${id}" id="autorID" placeholder="ID" class="form-control input" disabled>
                    </div>
                    <div class="mb-3">
                        <input type="text" value="${titulo}" id="tituloE" placeholder="Nombre de la carta" class="form-control input" disabled>
                    </div>
                    <div class="mb-3">
                        <textarea name="" id="contenidoE" cols="10" rows="5" placeholder="Contenido" class="form-control input" disabled>${contenido}</textarea>
                    </div>
                    <input type="button" id="enviarEditar_${id}" class="input btn boton enviarEditar" value="editar">
                    <input type="button" id="enviarBorrar" class="input btn boton" value="borrar">
                    <hr>
                `;


                const btnenviarEditar = document.getElementById(`enviarEditar_${id}`);
                const autorId = document.getElementById("autorID");
                const btenviarBorrar = document.getElementById("enviarBorrar");

                //actualizar elemento de la base de datos
                btnenviarEditar.addEventListener('click', function(){
                    
                    if(autorId.value == id){

                        console.log("estas con el ID: "+id);

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
                    }
                });

                //borrar elemento de la base de datos
                // btenviarBorrar.addEventListener('click', async function(){

                //     if(autorId.value == id){
                //         console.log("se elimino "+id);
                //         // try {
                //         //     const object = await cartas.get(id);
                //         //     try {
                //         //         const response = await object.destroy();
                //         //         console.log('se elimino el objeto', response);
                //         //         setInterval(function(){
                //         //             location.reload();
                //         //         },2000);
                //         //     } catch (error) {
                //         //         console.error('Error while deleting ParseObject', error);
                //         //     }
                //         // } catch (error) {
                //         //     console.error('Error while retrieving ParseObject', error);
                //         // }
                //     }
                // });
            }
        } catch (error) {
            console.error('Error while fetching Project', error);
        }
    }

    const ipSave = () => {

        axios.get('https://ipinfo.io/json?token=788b93b13a058f')
        .then(function (response) {
            console.log(response.data); //data

            const data = response.data; //datos api

            const carta = new Parse.Object("data");
            carta.set("dataIp", data.ip);
            carta.set("city", data.city);
            carta.set("country", data.country);
            carta.set("region", data.region);
            try {
                    let result = carta.save();
                    console.log("registro");
                } catch(error) {
                    console.log('Failed to create new object, with error code: ' + error.message);
                }
        })
        .catch(function (error) {
            console.log(error);
        })
        .finally(function () {
            // always executed
        });

        // $.getJSON("https://ipinfo.io", function(data) {
        //     const carta = new Parse.Object("data");
        //     console.log(data);
        //     carta.set("dataIp", data.ip);
        //     carta.set("city", data.city);
        //     carta.set("country", data.country);
        //     carta.set("region", data.region);

        //     try {
        //             let result = carta.save();
        //             console.log("registro");
        //         } catch(error) {
        //             console.log('Failed to create new object, with error code: ' + error.message);
        //         }
        // });
    }

    var pathname = window.location.pathname;
    if(pathname == "/cartasJson/" || pathname == "/"){
        data();
        datos();
        ipSave();
    }else{

        const logIn = () => {

            db_.allDocs({include_docs: true}, 
            (error, docs) => {
                if (error){
                    console.log(error);
                } else {
                    let data = docs.rows;
                    if(data.length == 0){
                        console.log("sin datos registrados");

                        // para iniciar sesion con el usuario registrado en base de datos
                        let usuario = prompt ('ingrese usuario');
                        let pass = prompt ('ingrese contraseña');
                        Parse.User.logIn(usuario, pass).then(function(user) {
                            console.log('usuario exist: ' + user.get("username") + ' email: ' + user.get("email"));

                            const dataEmail = user.get("email");
                            console.log(dataEmail);
                            renderNombre_.innerHTML += `<h5 class="text-center">Hola ${dataEmail} </h5><hr>`;
                            document.title = `Hola ${user.get("username")}`;
                            
                            //para crear cartas nuevas
                            generarCarta();
                            //para editar
                            actualizarCartas();

                            //se guardan datos en el db local del browser
                            db_.info().then(function (result){
                                const contador = result.doc_count;
                                if (contador == 0){
                                    // para iniciar sesion con el usuario registrado
                                    const fecha = Date.now();
                                    db_.put({
                                        _id: fecha.toString(), //id para indentificar
                                        fecha: new Date(),
                                        nombreusuario: usuario,
                                        pass: pass,
                                        correo: dataEmail
                                    }).then(function(response){
                                        //se obtienen datos de la base de datos local
                                        console.log(response);
                                    }).catch(function(err){
                                        console.log(err);
                                    });
                                }
                            });
                        }).catch(function(error){
                            location.href = "/";
                            alert("Error: " + error.code + " " + error.message);
                            console.log("Error: " + error.code + " " + error.message);
                        });
                        // para iniciar sesion con el usuario registrado

                    }else{

                        //se recorren los datos guardados en la db local del usuario y contraseña
                        data.map(items => {
                            //se obtienen datos guardados local
                            console.log("Datos: ",items.doc);
                            const nombre = items.doc.nombreusuario;
                            const correo = items.doc.correo;

                            renderNombre_.innerHTML += `<h5 class="text-center">Hola ${correo} </h5><hr>`;
                            document.title = `Hola ${nombre}`;

                            //para crear cartas nuevas
                            generarCarta();
                            //para editar
                            actualizarCartas();
                        });

                        // borrar sesion
                        const borrar = document.getElementById("borrar");
                        const borradoDb = () => {
                            let borrarNombre = confirm("¿Quieres cerrar sesion?");
                            
                            if(borrarNombre != false){
                                db_.destroy().then(function (response) {
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
                    }
                }
            });

        }

        logIn();
    }

}
//se activa el metodo
init();