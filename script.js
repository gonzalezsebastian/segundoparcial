document.addEventListener('DOMContentLoaded', () => {

	var state = 1;
	var puzzle = document.getElementById('puzzle');

	crearTablero();
	
	puzzle.addEventListener('click', function(e){
		if(state == 1){
			puzzle.className = 'moviendo';
			moverPieza(e.target);
		}
	});
    
	document.getElementById('desordenar').addEventListener('click', desordenar);

	function crearTablero(){
		
		if(state == 0){
			return;
		}
		
		puzzle.innerHTML = '';
		
		var n = 1;
		for(var i = 0; i < 4; i++){
			for(var j = 0; j < 4; j++){
				var pieza = document.createElement('span');
				pieza.id = 'pieza-'+i+'-'+j;
				pieza.style.left = (j*80+1*j+1)+'px';
				pieza.style.top = (i*80+1*i+1)+'px';
				
				if(n <= 15){
					pieza.classList.add('numero');
					pieza.innerHTML = (n++).toString();
				} else {
					pieza.className = 'vacio';
				}
				
				puzzle.appendChild(pieza);
			}
		}
		
	}

	function moverPieza(pieza){

		if(pieza.clasName != 'vacio'){
			var piezaVacia = getPiezaVaciaAdyacente(pieza);
			
			if(piezaVacia){
				var tmp = {style: pieza.style.cssText, id: pieza.id};
				pieza.style.cssText = piezaVacia.style.cssText;
				pieza.id = piezaVacia.id;
				piezaVacia.style.cssText = tmp.style;
				piezaVacia.id = tmp.id;
				
				if(state == 1){
					setTimeout(verificarGanador, 150);
				}
			}
		}
		
	}

	function getPieza(fila, columna){
		return document.getElementById('pieza-'+fila+'-'+columna);
	}

	function getPiezaVacia(){
		return puzzle.querySelector('.vacio');	
	}

	function getPiezaVaciaAdyacente(pieza){
		
		var adyacente = getPiezasAdyacentes(pieza);
		
		for(var i = 0; i < adyacente.length; i++){
			if(adyacente[i].className == 'vacio'){
				return adyacente[i];
			}
		}
		
		return false;
	}

	function getPiezasAdyacentes(pieza){
		
		var id = pieza.id.split('-');

		var fila = parseInt(id[1]);
		var columna = parseInt(id[2]);
		
		var adyacente = [];
		if(fila < 3){adyacente.push(getPieza(fila+1, columna));}			
		if(fila > 0){adyacente.push(getPieza(fila-1, columna));}
		if(columna < 3){adyacente.push(getPieza(fila, columna+1));}
		if(columna > 0){adyacente.push(getPieza(fila, columna-1));}
		
		return adyacente;
	}
	
	function verificarGanador(){
		
		if(getPieza(3, 3).className != 'vacio'){
			return;
		}

		var n = 1;

		for(var i = 0; i < 4; i++){
			for(var j = 0; j < 4; j++){
				if(n <= 15 && getPieza(i, j).innerHTML != n.toString()){
					return;
				}
				n++;
			}
		}
		if(confirm('¡Ganaste! \n¿Jugar de Nuevo?')){
			desordenar();
		}
	}

    function rand(desde, hasta){
		return Math.floor(Math.random() * (hasta - desde + 1)) + desde;
	}

	function desordenar(){
	
		if(state == 0){
			return;
		}
		
		puzzle.removeAttribute('class');
		state = 0;
		
		var piezaPrevia;
		var i = 1;
		var interval = setInterval(function(){
			if(i <= 150){
				var adyacente = getPiezasAdyacentes(getPiezaVacia());
				if(piezaPrevia){
					for(var j = adyacente.length-1; j >= 0; j--){
						if(adyacente[j].id == piezaPrevia.id){
							adyacente.splice(j, 1);
						}
					}
				}
				piezaPrevia = adyacente[rand(0, adyacente.length-1)];
				moverPieza(piezaPrevia);
				i++;
			} else {
				clearInterval(interval);
				state = 1;
			}
		});
	}
});