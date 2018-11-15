firebase.initializeApp({
    apiKey: "AIzaSyCZEuDaRoXRFGAj6lATj-r75suwZu6FsCM",
    authDomain: "proyectojavafire.firebaseapp.com",
    projectId: "proyectojavafire"
  });
  
  // Initialize Cloud Firestore through Firebase
  var db = firebase.firestore();

//Agregar documentos y la funcion que se necesita para el guardado 
function guardar(){
    var nombre = document.getElementById('nombre').value;
    var apellido = document.getElementById('apellido').value;
    var fecha = document.getElementById('fecha').value;
//Con el .add se agrega una Id automatica
    db.collection("users").add({
        first: nombre,
        last: apellido,
        born: fecha
    })

    .then(function(docRef) {
        console.log("Document written with ID: ", docRef.id);
        document.getElementById('nombre').value='';
        document.getElementById('apellido').value='';
        document.getElementById('fecha').value='';
    })
    .catch(function(error) {
        console.error("Error adding document: ", error);
    });
}

//Lee la documentacion y la muestra dentro de la tabla con la funcion forEach
// Se usa onSnapshot() para que me guarde y actualice en tiempo real
var tabla = document.getElementById('tabla');
db.collection("users").onSnapshot((querySnapshot) => {
    tabla.innerHTML='';
    querySnapshot.forEach((doc) => {
        console.log(`${doc.id} => ${doc.data().first}`);
        tabla.innerHTML += `
        <tr>
        <th scope="row">${doc.id}</th>
        <td>${doc.data().first}</td>
        <td>${doc.data().last}</td>
        <td>${doc.data().born}</td>
        <td><button class="btn btn-danger" onclick="eliminar('${doc.id}')">Eliminar</button></td>
        <td><button class="btn btn-warning" onclick="editar('${doc.id}','${doc.data().first}','${doc.data().last}','${doc.data().born}')">Editar</button></td>
        </tr>
         `
    });
});

//Borra los documentos. Se elije una id a eliminar, osea la id que le dimos arriba en el doc.id para que guarrde la id de la fila
function eliminar(id){
    db.collection("users").doc(id).delete().then(function() {
        console.log("Document successfully deleted!");
    }).catch(function(error) {
        console.error("Error removing document: ", error);
    });
}



function editar(id,nombre,apellido,fecha){

    document.getElementById('nombre').value = nombre;
    document.getElementById('apellido').value = apellido;
    document.getElementById('fecha').value = fecha;
    var boton = document.getElementById('boton');
    boton.innerHTML = 'Editar';

    boton.onclick = function(){
    //Editar o actualizar un documento y/o usuario
    var washingtonRef = db.collection("users").doc(id);
    var nombre = document.getElementById('nombre').value;
    var apellido = document.getElementById('apellido').value;
    var fecha = document.getElementById('fecha').value;

    // Selecciona los campos que lleva la tabla y su correspondiente  'id'
    //Hacer que los datos viajen a los campos para editarlos o actualizarlos
    return washingtonRef.update({
        first: nombre,
        last: apellido,
        born: fecha
    })
    //Ejecuta la accion de que fue exitosa y limpia los campos
    .then(function() {
        console.log("Document successfully updated!");
        boton.innerHTML = 'Guardar';
        document.getElementById('nombre').value = '';
        document.getElementById('apellido').value = '';
        document.getElementById('fecha').value = '';
    })
    // El documento puede que no exista o fallo en algo.
    .catch(function(error) {
        console.error("Error updating document: ", error);
    }) 
    }


}
