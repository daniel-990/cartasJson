const init = () =>{

    const datos = () => {
        //---
        let db = new PouchDB('holaDb');
        let db_ = new PouchDB('holaDb2');
        let renderNombre = document.getElementById("nombre");
        let renderContador = document.getElementById("contador");
        let limitador = 60;

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

        const url = "";


        axios.post('/user', {
            id: 'Fred',
            fecha: 'Flintstone',
            autor: '',
            titulo: '',
            contenido: ''
        })
        .then(function (response) {
            console.log(response);
        })
        .catch(function (error) {
            console.log(error);
        });

    }
    generarCarta();
    datos();

}
//se activa el metodo
init();