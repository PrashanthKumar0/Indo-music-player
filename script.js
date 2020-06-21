onload=init;

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
        src:"./assets/music/K-391_Alan_Walker_-_Ignite_feat._Julie_Bergan_Seungri.mp3",
        cover:"./assets/cover/alan-walker.jpg"
    },
    {
        name:"Melody",
        artist:"Cadium",
        src:"./assets/music/Cadmium - Melody (feat. Jon Becker) .mp3",
        cover:"./assets/cover/cadium-melody.jpeg"
    },
    {
        name:"Different Way",
        artist:"Dj Snake",
        src:"./assets/music/DJ Snake Lauv - A Different Way.mp3",
        cover:"./assets/cover/different-way.jpg"
    },
    {
        name:"On The Floor",
        artist:"Jennifer Lopez",
        src:"./assets/music/Jennifer Lopez - On the floor feat. Pitbul .mp3",
        cover:"./assets/cover/on the floor.jpg"
    },
    {
        name:"Vale Vale",
        artist:"Alok Zafrir",
        src:"./assets/music/Vale Vale Ho .mp3",
        cover:"./assets/cover/vale vale.png"
    },
    
];

const audio=new Audio();
audio.src=PlayList[0].src;
var currentElm;
function addSongToPlayList(obj){
    PlayList.push(obj);
    ShowSongs(obj);
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

function showControls(){
    $("player").style.filter="grayscale(0.6)";
    $("player").style.opacity="0";
    setTimeout(function(){
        $("player").style.display="none";
    },350)
    $("controls").classList.add("show");    
}
function hideControls(){
    $("player").style.filter="grayscale(0)";
    $("player").style.opacity="1";
    setTimeout(function(){
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
    addSeekEvents();
    
    for(var i=0;i<PlayList.length;i++){
        InsertSong(PlayList[i]);
    }
}

audio.onpause=function(){
    $("playNowBtn").innerHTML='|>';
    currentElm.innerHTML='|>';
}
audio.onplay=function(){
    $("playNowBtn").innerHTML='||';
    currentElm.innerHTML='||';
}
function togglePlay(){
    if(audio.paused){
        audio.play();
    } else {
        audio.pause();
    }
}

function addSeekEvents(){
    
    //seek start

    $("seekBar").ontouchmove=function(e){
        audio.pause();
        audio.currentTime=(((e.touches[0].clientX - $("seekTrackThumb").offsetWidth/2   )/$("seekBar").offsetWidth)*audio.duration);
    };

    //seek end
    $("seekBar").ontouchend=function(e){
        audio.play();
    };

    $("seekBar").onclick=function(e){
        // audio.play();
        audio.currentTime=(((e.clientX - $("seekTrackThumb").offsetWidth/2   )/$("seekBar").offsetWidth)*audio.duration);
    };
}
