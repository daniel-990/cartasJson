const init = () => {

    //---
    let db = new PouchDB('holaDb');
    let db_ = new PouchDB('holaDb2');
    let renderNombre = document.getElementById("nombre");
    let renderContador = document.getElementById("contador");
    let limitador = 60;

    const autor = document.getElementById("autor");
    const titulo = document.getElementById("titulo");
    const contenido = document.getElementById("contenido");
    const btnenviar = document.getElementById("enviar");

    //parse
    Parse.initialize("nrZS1bOIMhQ08LVfPJj0D3zB6hPcFfd0w4bCL9Mg", "bzno5dqB68suiIu3Jxq5cfidBisZIS5ovOJXmMPQ"); //PASTE HERE YOUR Back4App APPLICATION ID AND YOUR JavaScript KEY
    Parse.serverURL = "https://parseapi.back4app.com/";

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
                        autor.value = nombre;
                        let contador = 0;
                        setInterval(function(){
                            //renderContador.innerHTML = contador += 1;
                            // if(contador == limitador){
                            //     db.destroy().then(function (response){
                            //         console.log(response);
                            //         if(response.ok){
                            //             alert("Nombre borrado");
                            //             location.reload();
                            //         }
                            //     }).catch(function (err) {
                            //         console.log(err);
                            //     });
                            // }
                        },1000);

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
                    let result = carta.save()
                    console.log(result);
                    try {
                        const autor = carta.get("autor");
                        const titulo = carta.get("titulo");
                        const contenido = carta.get("contenido");
                        console.log(`autor: ${autor}, titulo: ${titulo}, contenido: ${contenido}`);
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
        const cartas = Parse.Object.extend('cartas');
        const query = new Parse.Query(cartas);

        try {
          const resultados = await query.find();
          console.log(resultados);
          for (const object of resultados) {

            const autor = object.get('autor')
            const titulo = object.get('titulo')
            const contenido = object.get('contenido')
            console.log(autor);
            console.log(titulo);
            console.log(contenido);

          }
        } catch (error) {
          console.error('Error while fetching Project', error);
        }
    }
    data();
    generarCarta();
    datos();

}
//se activa el metodo
init();