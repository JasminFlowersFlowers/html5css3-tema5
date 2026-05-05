function redimensionaBarra()
{
	if(!medio.ended)
	{
		var total=parseInt(medio.currentTime*maximo / medio.duration);
		progreso.style.width=total+'px';
	}
	else
	{
		progreso.style.width='0px';
		play.value='\u25BA';
		window.clearInterval(bucle);
	}
}

function desplazarMedio(e)
{
	if(!medio.paused && !medio.ended)
	{
		var ratonX=e.pageX-barra.offsetLeft;
		var nuevoTiempo=ratonX*medio.duration/maximo;
		medio.currentTime=nuevoTiempo;
		progreso.style.width=ratonX+'px';
	}
}

function accionPlay()
{
	if(!medio.paused && !medio.ended) 
	{
		medio.pause();
		play.value='\u25BA';
		window.clearInterval(bucle);
	}
	else
	{
		medio.play();
		play.value='||';
		bucle=setInterval(redimensionaBarra, 1000);
	}
}

function iniciar() 
{
	maximo=700;
	
	medio=document.getElementById('medio');
	barra=document.getElementById('barra');
	progreso=document.getElementById('progreso');
	play=document.getElementById('play');
    /* obtener los objetos del resto de elementos necesarios */
	reiniciarBtn = document.getElementById('reiniciar');
    retrasarBtn = document.getElementById('retrasar');
    adelantarBtn = document.getElementById('adelantar');
    silenciarBtn = document.getElementById('silenciar');
    menosVolumenBtn = document.getElementById('menosVolumen');
    masVolumenBtn = document.getElementById('masVolumen');
	
	play.addEventListener('click', accionPlay, false);
	/* crear los manejadores de eventos para el resto de botones */
	reiniciarBtn.addEventListener('click', reiniciar, false);
    retrasarBtn.addEventListener('click', retrasar, false);
    adelantarBtn.addEventListener('click', adelantar, false);
    silenciarBtn.addEventListener('click', silenciar, false);
    menosVolumenBtn.addEventListener('click', menosVolumen, false);
    masVolumenBtn.addEventListener('click', masVolumen, false);

	barra.addEventListener('click', desplazarMedio, false);
}

window.addEventListener('load', iniciar, false);

function reiniciar() {
    medio.currentTime = 0;
    medio.play();
    play.value = '||';
}

function retrasar() {
    if (medio.currentTime > 5) {
        medio.currentTime -= 5;
    } else {
        medio.currentTime = 0;
    }
}

function adelantar() {
    if (medio.currentTime + 5 < medio.duration) {
        medio.currentTime += 5;
    } else {
        medio.currentTime = medio.duration;
    }
}

function silenciar() {
    if (medio.muted) {
        medio.muted = false;
        silenciarBtn.value = "silenciar";
    } else {
        medio.muted = true;
        silenciarBtn.value = "escuchar";
    }
}

function menosVolumen() {
    if (medio.volume > 0) {
        medio.volume = Math.max(0, medio.volume - 0.1);
    }
}

function masVolumen() {
    if (medio.volume < 1) {
        medio.volume = Math.min(1, medio.volume + 0.1);
    }
}