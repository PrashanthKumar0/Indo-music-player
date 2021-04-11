onload=init;
var baseUrl="./";
function $(el){
    return document.getElementById(el);
}

function _(el,all){
    if(all){
        return (document.querySelectorAll(el));
    }
    return (document.querySelector(el));
}

const PlayList=[
    {
        name:"Ignite",
        artist:"Alan Walker",
        src:baseUrl+"assets/music/K-391_Alan_Walker_-_Ignite_feat._Julie_Bergan_Seungri.mp3",
        cover:baseUrl+"assets/cover/alan-walker.jpg"
    },
    {
        name:"Melody",
        artist:"Cadium",
        src:baseUrl+"assets/music/Cadmium - Melody (feat. Jon Becker) .mp3",
        cover:baseUrl+"assets/cover/cadium-melody.jpeg"
    },
    {
        name:"Seasons",
        artist:"Cadium (feat. Harley Bird)",
        src:baseUrl+"assets/music/Seasons  [NCS Release].mp3",
        cover:baseUrl+"assets/cover/Seasons albumArt.jpg"
    },
    {
        name:"Different Way",
        artist:"Dj Snake",
        src:baseUrl+"assets/music/DJ Snake Lauv - A Different Way.mp3",
        cover:baseUrl+"assets/cover/different-way.jpg"
    },
    {
        name:"On The Floor",
        artist:"Jennifer Lopez",
        src:baseUrl+"assets/music/Jennifer Lopez - On the floor feat. Pitbul .mp3",
        cover:baseUrl+"assets/cover/on the floor.jpg"
    },
    {
        name:"Vale Vale",
        artist:"Alok Zafrir",
        src:baseUrl+"assets/music/Vale Vale Ho .mp3",
        cover:baseUrl+"assets/cover/vale vale.png"
    },
    {
        name:"Zombie",
        artist:"Bad Wolves",
        src:baseUrl+"assets/music/Bad Wolves - Zombie.mp3",
        cover:baseUrl+"assets/cover/wolf.jpg"
    },
    
];

const audio=new Audio();
audio.src=PlayList[0].src;
var currentElm;
var currentCover=new Image(); //will be used by visualizer
function addSongToPlayList(obj){
    PlayList.push(obj);
    ShowSongs(obj);
}

function ShowSongs() {
    $("playList").innerHTML='';
    for(var i=0;i<PlayList.length;i++){
        InsertSong(PlayList[i]);
    }
    $("player").scrollIntoView(0,$("player").offsetHeight)
}

audio.ontimeupdate=function(){
    var _min=Math.floor(audio.currentTime/60);
    var _sec=Math.floor(audio.currentTime)%60;

    

    _min=(_min<=9?"0"+_min:_min);
    _sec=(_sec<=9?"0"+_sec:_sec);
    $("elapsed").innerHTML=_min+":"+_sec;

    
    _min=Math.floor(audio.duration/60);
    _sec=Math.floor(audio.duration)%60;
    _min=(_min<=9?"0"+_min:_min);
    _sec=(_sec<=9?"0"+_sec:_sec);
    $("total").innerHTML=_min+":"+_sec;

    var _percent=(Math.round(100*(audio.currentTime/audio.duration)));
    $("seekTrack").style.width="calc("+_percent+"% - var(--seekbar-thumb-width))";
}

var previousSong;
var playId=0;

function playSong(e,el=0){
   
    var _el;
    var _child;
    if(el){
        _child=e;
        _el=e.parentElement;    
    }else{
        _child=e.target;
        _el=e.target.parentElement
    }
    var name=_el.getAttribute('data-song-name');
    var artist=_el.getAttribute('data-song-artist');
    var cover=_el.getAttribute('data-song-cover');
    var src=_el.getAttribute('data-song-src');

    _("#playerCover>img").src=cover;
    _("#mainCover>img").src=cover;
    $("infoName").innerHTML=name;
    $("infoAuthor").innerHTML=artist;
    $("titleVisual").innerHTML=name;
    currentCover.src=cover;
    var _lst=_(".list",1);
    var _btn=_(".play",1);
    for(var i=0;i<_lst.length;i++){
        _lst[i].classList.remove("active");
        if(_btn[i]!=e.target){
            _btn[i].innerHTML="|>";
        }
    }
    _el.classList.add("active");
    _child.classList.add("playing");
    if(src!=previousSong){
        previousSong=src;
        // _child.innerHTML='||';
        // $("playNowBtn").innerHTML='||';
        audio.src=src;
        currentElm=_child;
        audio.play();
    } else {
        if((_child.innerHTML=='||')){
            // _child.innerHTML='|>';
            // $("playNowBtn").innerHTML='|>';
            audio.pause();
        } else {
            // $("playNowBtn").innerHTML='||';
            // _child.innerHTML='||';
            audio.play();
        }   
    }
    
}
function InsertSong(obj){
    $("playList").innerHTML+='<div data-song-index="'+_('.list',1).length+'" data-song-cover="'+obj.cover+'" data-song-name="'+obj.name+'" data-song-src="'+obj.src+'" data-song-artist="'+obj.artist+'" class="list flex"><div class="info" class="flex-v"><div class="name">'+obj.name+'</div><div class="author">'+obj.artist+'</div></div><button class="play">|></button></div>';
    _(".list button",1).forEach(el=>{
        el.addEventListener("click",playSong);
    })
}

var initialBodyMargin="auto";
function showControls(){
    $("player").style.filter="grayscale(0.6)";
    $("player").style.opacity="0";
    setTimeout(function(){
        initialBodyMargin=document.body.style.margin;
        document.body.style.margin="0px";
        $("player").style.display="none";
    },350)
    $("controls").classList.add("show");    
}
function hideControls(){
    $("player").style.filter="grayscale(0)";
    $("player").style.opacity="1";
    setTimeout(function(){
        document.body.style.margin=initialBodyMargin;
        $("player").style.display="flex";
    },350)
    $("controls").classList.remove("show");    
}

function playPrevious(){
    var _currIndex=parseInt(currentElm.parentElement.getAttribute("data-song-index"));
    if(_currIndex >= 1){
        playSong(_("[data-song-index='"+(_currIndex-1)+"'] > button"),1)
    } else {
        playSong(_("[data-song-index='"+(PlayList.length-1)+"'] > button"),1)
    }
}
function playNext(){
    var _currIndex=parseInt(currentElm.parentElement.getAttribute("data-song-index"));
    if(_currIndex < (PlayList.length-1)){
        playSong(_("[data-song-index='"+(_currIndex+1)+"'] > button"),1)
    } else {
        playSong(_("[data-song-index='0'] > button"),1)
    }
}

function init(){
    $("Loader").style.display="none";
    $("player").style.display="flex";
    $("list").onclick=showControls;
    $("backToPlayer").onclick=hideControls;
    $("playNowBtn").onclick=togglePlay; 
    $("playPreviousBtn").onclick=playPrevious;
    $("playNextBtn").onclick=playNext;
    $("showVisual").onclick=showVisuals;
    $("backToPlayerV").onclick=backToPlayerV;
    $("file").onchange=hFileUpload;
    ShowSongs();
    addSeekEvents();
    
}

audio.onpause=function(){
    $("playNowBtn").innerHTML='|>';
    currentElm.innerHTML='|>';
}

audio.onplay=function(){
    $("playNowBtn").innerHTML='||';
    currentElm.innerHTML='||';
}

audio.onended=function(){
    setTimeout(playNext,1000);
}

function togglePlay(){
    if(audio.paused){
        audio.play();
    } else {
        audio.pause();
    }
}

function hFileUpload(e){
    e.preventDefault();
    for (var a=0;a<$("file").files.length;a++){
        var file=$("file").files[a];
        url = file.urn || file.name;
        ID3.loadTags(url, function() {
            fileUploaded(url,URL.createObjectURL(file));
          }, {
            tags: ["title","artist","picture"],
            dataReader: ID3.FileAPIReader(file)
          });    
    }
}

function fileUploaded(url,mp3Url){
    var tags = ID3.getAllTags(url);
    var image = tags.picture;
    if (image) {
      var base64String = "";
      for (var i = 0; i < image.data.length; i++) {
          base64String += String.fromCharCode(image.data[i]);
      }
      var base64 = "data:" + image.format + ";base64," +
              window.btoa(base64String);
      image=(base64);
    } else {
        image=baseUrl+"assets/cover/unknown.jpg";
    }

    addSongToPlayList({
        name:((tags.title || "(Unknown)").split('.')[0]).replace(/[0-9]/gm,"").replace(/[^a-z]/gmi," "),
        artist:tags.artist ||"(Unknown)",
        src:mp3Url,
        cover:image
    });
}


function addSeekEvents(){
    
    //seek start

    $("seekBar").ontouchmove=function(e){
        var x_correction=e.target.getBoundingClientRect().x - e.target.offsetLeft;
        audio.pause();
        audio.currentTime=(((e.touches[0].clientX -x_correction - $("seekTrackThumb").offsetWidth/2   )/$("seekBar").offsetWidth)*audio.duration);
    };

    //seek end
    $("seekBar").ontouchend=function(e){
        audio.play();
    };
    
    $("seekBar").onclick=function(e){
        var x_correction=e.target.getBoundingClientRect().x - e.target.offsetLeft;
        // audio.play();
        audio.currentTime= (((e.clientX - x_correction - $("seekTrackThumb").offsetWidth/2)/$("seekBar").offsetWidth)*audio.duration) ;
    };
}

//visualization part

var ctx,cnvs,aCtx,analyser,mediaStream,W,H,visualArray;
var isInitialized=0;
var shouldAnimate=0;
var then;

var coverBaseW=150;
var bounce=10;
var theta=0;

function backToPlayerV(){
    $("player").style.filter="grayscale(0)";
    $("player").style.opacity="1";
    setTimeout(function(){
        $("player").style.display="flex";
    },350)
    $("visuals").classList.remove("show");    

    shouldAnimate=0;
}

function showVisuals(){
    $("player").style.filter="grayscale(0.6)";
    $("player").style.opacity="0";
    setTimeout(function(){
        $("player").style.display="none";
    },350)
    $("visuals").classList.add("show"); 
    
    //initialize all variables
    if(!isInitialized){
        isInitialized=1;
        cnvs=$("cnvs");
        W=cnvs.width=innerWidth-cnvs.offsetLeft;
        H=cnvs.height=innerHeight-cnvs.offsetTop;
        ctx=cnvs.getContext("2d");
        aCtx=new AudioContext();
        analyser=aCtx.createAnalyser();
        mediaStream=aCtx.createMediaElementSource(audio);
        shouldAnimate=1;
        visualArray=new Uint8Array(360+400);
    } else {
        
        W=cnvs.width=innerWidth;
        H=cnvs.height=innerHeight;
        shouldAnimate=1;
    }
    mediaStream.connect(analyser);
    analyser.connect(aCtx.destination);
    then=performance.now();
    animateVisuals();
}

function animateVisuals(){
    if(!shouldAnimate) return;
    var _pixelX=(W/2)+10*Math.cos(theta);
    var _pixeY=(H/2)+10*Math.sin(theta);
    var pxl=ctx.getImageData(_pixelX,_pixeY,1,1).data;
    ctx.fillStyle="rgba(38, 40, 43,0.2)";
    ctx.fillRect(0,0,W,H);
    theta+=0.01;
    bounce=(visualArray[100]/10);
    analyser.getByteFrequencyData(visualArray);
    var ratio=(currentCover.height/currentCover.width);
    
    ctx.fillStyle="rgba("+(pxl[0]+100)+","+(pxl[1]+100)+","+(100+pxl[2])+",1)";
    ctx.save();
    ctx.translate(W/2,H/2);
    ctx.rotate(-theta);
    ctx.beginPath();
    var incVal=Math.floor(1+((performance.now()-then)/20));
    for(var a=0;a<360;a+=incVal){
        var _angle=(Math.PI/180)*a;
        var _r=(coverBaseW+bounce+5+visualArray[a]);
        // if(_r >= (W/2 - coverBaseW) ){
        //     _r=_r-(W/2 - coverBaseW); //constrain
        // }
        var _x=(_r*Math.cos(_angle))/2;
        var _y=(_r*Math.sin(_angle))/2;
        if(a==0){
            ctx.moveTo(_x,_y);
        } else {
            ctx.lineTo(_x,_y);
        }
    }
    ctx.fill();
    // ctx.stroke();
    ctx.restore();
    
    
    
    ctx.fillStyle="rgba("+(pxl[0])+","+(pxl[1])+","+(pxl[2])+",1)";
    //cover
    ctx.save();
    ctx.translate(W/2,H/2);
    ctx.rotate(theta);
        ctx.beginPath();
        ctx.arc(0,0,((coverBaseW+bounce)/2)+5,0,Math.PI*2);
        ctx.fill();
        ctx.beginPath();
        ctx.arc(0,0,((coverBaseW+bounce)/2),0,Math.PI*2);
        ctx.clip();
        ctx.drawImage(currentCover,-(coverBaseW+bounce)/2,(-(coverBaseW+bounce)/2),coverBaseW+bounce,ratio*(coverBaseW+bounce));    
    ctx.restore();

    
    then=performance.now();
    requestAnimationFrame(animateVisuals);
}


