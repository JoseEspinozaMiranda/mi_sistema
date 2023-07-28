var tabla;

//funcion que se ejecuta al inicio
function init(){
   mostrarform(false);
   listar();

   $("#formulario").on("submit",function(e){
   	guardaryeditar(e);
   });

   //cargamos los items al select cliente
   $.post("../ajax/venta.php?op=selectCliente", function(r){
   	$("#idcliente").html(r);
   	$('#idcliente').selectpicker('refresh');
   });

}

//funcion limpiar
function limpiar(){

	$("#idcliente").val("");
	$("#cliente").val("");
	$("#serie_comprobante").val("");
	$("#num_comprobante").val("");
	$("#impuesto").val("");

	$("#total_venta").val("");
	$(".filas").remove();
	$("#total").html("0");

	//obtenemos la fecha actual
	var now = new Date();
	var day =("0"+now.getDate()).slice(-2);
	var month=("0"+(now.getMonth()+1)).slice(-2);
	var today=now.getFullYear()+"-"+(month)+"-"+(day);
	$("#fecha_hora").val(today);

	//marcamos el primer tipo_documento
	$("#tipo_comprobante").val("Boleta");
	$("#tipo_comprobante").selectpicker('refresh');

}

//funcion mostrar formulario
function mostrarform(flag){
	limpiar();
	if(flag){
		$("#listadoregistros").hide();
		$("#formularioregistros").show();
		//$("#btnGuardar").prop("disabled",false);
		$("#btnagregar").hide();
		listarArticulos();

		$("#btnGuardar").hide();
		$("#btnCancelar").show();
		detalles=0;
		$("#btnAgregarArt").show();


	}else{
		$("#listadoregistros").show();
		$("#formularioregistros").hide();
		$("#btnagregar").show();
	}
}

//cancelar form
function cancelarform(){
	limpiar();
	mostrarform(false);
}

//funcion listar
function listar(){
	tabla=$('#tbllistado').dataTable({
		"aProcessing": true,//activamos el procedimiento del datatable
		"aServerSide": true,//paginacion y filrado realizados por el server
		dom: 'Bfrtip',//definimos los elementos del control de la tabla
		buttons: [
                  'copyHtml5',
                  'excelHtml5',
                  'csvHtml5',
                  'pdf'
		],
		"ajax":
		{
			url:'../ajax/venta.php?op=listar',
			type: "get",
			dataType : "json",
			error:function(e){
				console.log(e.responseText);
			}
		},
		"bDestroy":true,
		"iDisplayLength":5,//paginacion
		"order":[[0,"desc"]]//ordenar (columna, orden)
	}).DataTable();
}

function listarArticulos(){
	tabla=$('#tblarticulos').dataTable({
		"aProcessing": true,//activamos el procedimiento del datatable
		"aServerSide": true,//paginacion y filrado realizados por el server
		dom: 'Bfrtip',//definimos los elementos del control de la tabla
		buttons: [

		],
		"ajax":
		{
			url:'../ajax/venta.php?op=listarArticulos',
			type: "get",
			dataType : "json",
			error:function(e){
				console.log(e.responseText);
			}
		},
		"bDestroy":true,
		"iDisplayLength":5,//paginacion
		"order":[[0,"desc"]]//ordenar (columna, orden)
	}).DataTable();
}
//funcion para guardaryeditar
function guardaryeditar(e){
     e.preventDefault();//no se activara la accion predeterminada 
     //$("#btnGuardar").prop("disabled",true);
     var formData=new FormData($("#formulario")[0]);

     $.ajax({
     	url: "../ajax/venta.php?op=guardaryeditar",
     	type: "POST",
     	data: formData,
     	contentType: false,
     	processData: false,

     	success: function(datos){
     		bootbox.alert(datos);
     		mostrarform(false);
     		listar();
     	}
     });

     limpiar();
}

function mostrar(idventa){
	$.post("../ajax/venta.php?op=mostrar",{idventa : idventa},
		function(data,status)
		{
			data=JSON.parse(data);
			mostrarform(true);

			$("#idcliente").val(data.idcliente);
			$("#idcliente").selectpicker('refresh');
			$("#tipo_comprobante").val(data.tipo_comprobante);
			$("#tipo_comprobante").selectpicker('refresh');
			$("#serie_comprobante").val(data.serie_comprobante);
			$("#num_comprobante").val(data.num_comprobante);
			$("#fecha_hora").val(data.fecha);
			$("#impuesto").val(data.impuesto);
			$("#idventa").val(data.idventa);
			
			//ocultar y mostrar los botones
			$("#btnGuardar").hide();
			$("#btnCancelar").show();
			$("#btnAgregarArt").hide();
		});
	$.post("../ajax/venta.php?op=listarDetalle&id="+idventa,function(r){
		$("#detalles").html(r);
	});

}


//funcion para desactivar
function anular(idventa){
	bootbox.confirm("¿Esta seguro de desactivar este dato?", function(result){
		if (result) {
			$.post("../ajax/venta.php?op=anular", {idventa : idventa}, function(e){
				bootbox.alert(e);
				tabla.ajax.reload();
			});
		}
	})
}

//declaramos variables necesarias para trabajar con las compras y sus detalles
// var impuesto=18;
// var cont=0;
// var detalles=0;

// $("#btnGuardar").hide();
// $("#tipo_comprobante").change(marcarImpuesto);

// function marcarImpuesto(){
// 	var tipo_comprobante=$("#tipo_comprobante option:selected").text();
// 	if (tipo_comprobante=='Factura') {
// 		$("#impuesto").val(impuesto);
// 	}else if (tipo_comprobante=='Boleta') {
// 		$("#impuesto").val(impuesto);
// 	}else{
// 		$("#impuesto").val("0");
// 	}
// }

//LLenado de input Serie y Numero
var impuesto=18;
var cont=0;
var detalles=0;
var resF = "", resB = "", resT ="";
$("#btnGuardar").hide();
$("#tipo_comprobante").change(marcarImpuesto);
$("#num_comprobante").change(numConCeros);
function numConCeros(){
var num_comprobante=$("#num_comprobante").text();
    resF = "1";
    resB = "1";
    resT = "1";
   if(num_comprobante>=1000)
      res = "" + num_comprobante;
   if(num_comprobante>=100)
      res = "0" + num_comprobante;
   if(num_comprobante>=10)
      res = "00" + num_comprobante;
   if(num_comprobante>=1)
      webkitRequestAnimationFrame = "000" + num_comprobante;
   return res;

}

function marcarImpuesto(){
	var tipo_comprobante=$("#tipo_comprobante option:selected").text();
    var num_comprobante=$("#num_comprobante").text();
    
	if (tipo_comprobante=='Factura') {
        // resF = "001" + num_comprobante++;
		$("#impuesto").val(impuesto);
        $("#serie_comprobante").val('F-01');
        $("#num_comprobante").val('000'+resF++);
         
	}else if (tipo_comprobante=='Boleta') {
        $("#serie_comprobante").val('B-01');
        $("#num_comprobante").val('000'+resB++);
    //     if(num_comprobante>=1) {
    //   $("#num_comprobante")=='000' + num_comprobante;
    //   return res;
    //   }
        // $("#num_comprobante").val('001')+res;
        // $Tipo_comprobante = "001"+ cont++ ;
	}else{
		$("#impuesto").val("0");
        $("#serie_comprobante").val('T-01');
        // $("#num_comprobante").val('001');
        $("#num_comprobante").val('000'+resT++);
	}
}

    
//     $query = $dbh->prepare(
//         "SELECT CONCAT('F-',LPAD(SUBSTR(codigo,3,3)+1,2,'0'), '/',
//             YEAR(NOW())) AS codigo
//             FROM factura WHERE year(fecha_emision) = YEAR(NOW())
//           UNION
//             SELECT CONCAT('F-01', '/', YEAR(NOW())) AS codigo
//           ORDER BY codigo DESC LIMIT 1;;
// ");
//     // Establece la forma de devolver los resultados, en este caso devolverá un array asociativo
//     $query->setFetchMode(PDO::FETCH_ASSOC);
//     $query->execute();
//     while ($row = $query->fetch()) {
//         echo '<form method="post" action="index.php?p=factura_grabar">';
//         echo '<input type="text" name="codigo" value="'.$row["codigo"].'">';
//         // echo '<input type="date" name="fecha_emision">';
//         // echo '<input type="submit" value="Grabar factura">';
//         echo '</form>';
//     }

function agregarDetalle(idarticulo,articulo,precio_venta){
	var cantidad=1;
	var descuento=0;

	if (idarticulo!="") {
		var subtotal=cantidad*precio_venta;
		var fila='<tr class="filas" id="fila'+cont+'">'+
        '<td><button type="button" class="btn btn-danger" onclick="eliminarDetalle('+cont+')">X</button></td>'+
        '<td><input type="hidden" name="idarticulo[]" value="'+idarticulo+'">'+articulo+'</td>'+
        '<td><input type="number" name="cantidad[]" id="cantidad[]" value="'+cantidad+'"></td>'+
        '<td><input type="number" name="precio_venta[]" id="precio_venta[]" value="'+precio_venta+'"></td>'+
        '<td><input type="number" name="descuento[]" value="'+descuento+'"></td>'+
        '<td><span id="subtotal'+cont+'" name="subtotal">'+subtotal+'</span></td>'+
        '<td><button type="button" onclick="modificarSubtotales()" class="btn btn-info"><i class="fa fa-refresh"></i></button></td>'+
		'</tr>';
		cont++;
		detalles++;
		$('#detalles').append(fila);
		modificarSubtotales();

	}else{
		alert("error al ingresar el detalle, revisar las datos del articulo ");
	}
}

function modificarSubtotales(){
	var cant=document.getElementsByName("cantidad[]");
	var prev=document.getElementsByName("precio_venta[]");
	var desc=document.getElementsByName("descuento[]");
	var sub=document.getElementsByName("subtotal");


	for (var i = 0; i < cant.length; i++) {
		var inpV=cant[i];
		var inpP=prev[i];
		var inpS=sub[i];
		var des=desc[i];


		inpS.value=(inpV.value*inpP.value)-des.value;
		document.getElementsByName("subtotal")[i].innerHTML=inpS.value;
	}

	calcularTotales();
}

function calcularTotales(){
	var sub = document.getElementsByName("subtotal");
	var total=0.0;

	for (var i = 0; i < sub.length; i++) {
		total += document.getElementsByName("subtotal")[i].value;
	}
	$("#total").html("S/." + total);
	$("#total_venta").val(total);
	evaluar();
}

function evaluar(){

	if (detalles>0) 
	{
		$("#btnGuardar").show();
	}
	else
	{
		$("#btnGuardar").hide();
		cont=0;
	}
}

function eliminarDetalle(indice){
$("#fila"+indice).remove();
calcularTotales();
detalles=detalles-1;

}

init();