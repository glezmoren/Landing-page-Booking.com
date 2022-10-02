'use strict'

setTimeout(function(){

    window.scrollTo( 0, 0 );
},500)



document.querySelectorAll('img').forEach( cadaimagen =>{
    cadaimagen.setAttribute('draggable', false);
} )

//Selecciono el wrapper porque es donde quiero pintar y donde quiero que aparezca el círculo sobre el cursor:
let nodoWrapper = document.querySelector('.imagenes__wrapper');


////// >>>>>>  Creación del circulo del cursor <<<<<<< ////// 
let nodoDiv = document.createElement("div");//Circulo
let radio = 0;  
nodoDiv.classList.add("imagenes__circulo");
nodoDiv.style.position = "fixed"; 
nodoDiv.style.zIndex = 3;
nodoDiv.style.width = radio * 2 + "px";
nodoDiv.style.height = radio * 2 + "px";

nodoDiv.style.overflow = "hidden";
nodoDiv.style.borderRadius = "50%";
nodoDiv.style.backgroundColor = "black";
nodoDiv.style.display = "flex";
nodoDiv.style.justifyContent = "center";
nodoDiv.style.alignItems = "center";

let nodoText = document.createElement("div");
nodoText.style.fontSize = 0.6 + "em";
nodoText.style.textAlign = "center";


nodoDiv.appendChild(nodoText);
nodoWrapper.appendChild(nodoDiv);
////// >>>>>>  Creación del circulo del cursor <<<<<<< //////


//////////quiero que EN FUNCIÓN DEL ANCHO DE LA PANTALLA el RADIO del círculo que pinta VARÍE://///////
let radio_mask = 50;

let ancho_pantalla = $(window).width();
console.log(ancho_pantalla)

if(ancho_pantalla < 840){
    radio_mask= 30;
}

if(ancho_pantalla > 1800){
    radio_mask= 200;
}


window.addEventListener('resize', function(){
    console.log('Se esta haciendo resize')
    if(ancho_pantalla < 840){
        radio_mask= 30;
    }
    if(ancho_pantalla > 1800){
        radio_mask= 200;
    }
    
});
///////////////////



//circulo distinto en cada clipPath para que no me pinte en todos a la vez, solo en el que estoy:
document.querySelectorAll('.imagenes__caja').forEach( (cadaimagen, index) =>{ 
    
    console.log( cadaimagen )
    console.log( index )
    let nombre_id = "clip_"+index;
    

    let nodoClipPath_ = cadaimagen.querySelector('.myClip');
    nodoClipPath_.setAttribute("id", nombre_id);// 
    

    let nodoImgUno = cadaimagen.querySelector('.imagenes__uno');
    nodoImgUno.style.clipPath = "url(#"+ nombre_id + ")";



} )


//////  >>>>>>>   Creación de los eventos     <<<<<<< //////

let isPainting = false;


nodoWrapper.addEventListener( 'mousemove', function( evento ){
    console.log(evento);
    
    paintMaskCircle( evento , radio_mask );
    refreshCirclePosition( evento );

});


nodoWrapper.addEventListener( 'mousedown', function( evento ){
    nodoDiv.style.transform ="scale(0)"
    isPainting = true;
});


nodoWrapper.addEventListener( 'mouseup', function( evento ){
    isPainting = false;
    nodoDiv.style.transform ="scale(1)";
});



nodoWrapper.addEventListener("mouseleave", function (evento) {
    nodoDiv.style.transform ="scale(0)";

});
//////  >>>>>>>    <<<<<<< //////



////// >>>>>>>> Creación de las acciones    <<<<<<<<    /////

//ACCION 1: que cuando este pintando (haciendo mousedown) se pinte la máscara de imagenes__uno:
function paintMaskCircle(evento ,radio ){
    if( isPainting ){ 
        //Ahora necesito localizar dónde estoy moviendo el raton 
        console.log( evento.target )
        let nodoClipPath = evento.target.closest( '.imagenes__caja' ).querySelector('.myClip')
        
        console.log( "X: ", evento.layerX );
        console.log( "Y: ", evento.layerY );
        
        let nodoImg = nodoWrapper.querySelector('img');
        

        let x = (evento.layerX/nodoImg.offsetWidth)*100 + "%" ;
        let y = (evento.layerY/nodoImg.offsetHeight)*100 + "%";;
        
        let nodoCircle = document.createElementNS("http://www.w3.org/2000/svg", 'circle');
        nodoCircle.classList.add('circulo');

        nodoCircle.setAttribute('cx', x );
        nodoCircle.setAttribute('cy', y );
        nodoCircle.setAttribute('r', radio );
        
        
        nodoClipPath.appendChild( nodoCircle );
    
    }
}

//ACCION 2: quiero que el circulo se vea en el cursor cuando no esta pintando
function refreshCirclePosition( evento ){
    if ( !isPainting ){
        
        radio = 50;
        nodoDiv.style.width = radio * 2 + "px";
        nodoDiv.style.transform ="scale(1)"
        nodoDiv.style.height = radio * 2 + "px";
        nodoText.innerHTML = "Click & Drag";
        console.log(evento);
        console.log("X: ", evento.clientX);
        let x = evento.clientX - radio;
        let y = evento.clientY - radio;
        
    
        nodoDiv.style.top = y + "px";
        nodoDiv.style.left = x + "px";
    }
}