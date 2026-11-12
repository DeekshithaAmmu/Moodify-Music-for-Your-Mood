const moodData = {
  Happy: { emoji:"😊", desc:"Sunlit grooves, upbeat rhythms & radiant energy", songs:[
    ["Can't Stop the Feeling!","Justin Timberlake","Feel-good pop energy"],
    ["Happy","Pharrell Williams","Bright and cheerful"],
    ["Good as Hell","Lizzo","Confidence-boosting pop"],
    ["Walking on Sunshine","Katrina and the Waves","Classic upbeat sunshine"],
    ["Levitating","Dua Lipa","Dance-pop sparkle"]
  ]},
  Sad: { emoji:"🥺", desc:"Tender melodies, heartfelt vocals & cathartic comfort", songs:[
    ["Fix You","Coldplay","Gentle comfort and hope"],
    ["Someone Like You","Adele","Emotional piano ballad"],
    ["The Night We Met","Lord Huron","Reflective and atmospheric"],
    ["When I Was Your Man","Bruno Mars","Heartfelt piano pop"],
    ["Let Her Go","Passenger","Soft acoustic reflection"]
  ]},
  Relaxed: { emoji:"😌", desc:"Lo-fi warmth, gentle acoustics & effortless tranquility", songs:[
    ["Sunset Lover","Petit Biscuit","Dreamy electronic calm"],
    ["Weightless","Marconi Union","Ambient relaxation"],
    ["Bloom","The Paper Kites","Soft indie acoustic"],
    ["River Flows in You","Yiruma","Peaceful piano"],
    ["Ocean Eyes","Billie Eilish","Airy and mellow"]
  ]},
  Angry: { emoji:"😠", desc:"Raw guitars, roaring percussion & cathartic release", songs:[
    ["Numb","Linkin Park","Powerful alternative rock"],
    ["Believer","Imagine Dragons","Driving percussion"],
    ["Stronger","Kanye West","High-energy confidence"],
    ["Break Stuff","Limp Bizkit","Intense rock energy"],
    ["Natural","Imagine Dragons","Dramatic rock anthem"]
  ]}
};
const moodGrid=document.getElementById("moodGrid"), results=document.getElementById("results");
const songList=document.getElementById("songList"), resultTitle=document.getElementById("resultTitle");
const favoritesKey="moodify-favorites-v1";
let favorites=JSON.parse(localStorage.getItem(favoritesKey)||"[]");
let activeMood=null;
function updateCount(){document.getElementById("favoriteCount").textContent=favorites.length}
function renderMoods(){
  moodGrid.innerHTML=Object.entries(moodData).map(([m,d])=>`<article class="mood-card" data-mood="${m}" tabindex="0" role="button" aria-label="Get ${m} music recommendations"><span class="arrow">›</span><div class="mood-emoji">${d.emoji}</div><h3>${m}</h3><p>${d.desc}</p></article>`).join("");
  moodGrid.querySelectorAll(".mood-card").forEach(card=>{
    card.addEventListener("click",()=>showMood(card.dataset.mood));
    card.addEventListener("keydown",e=>{if(e.key==="Enter"||e.key===" "){e.preventDefault();showMood(card.dataset.mood)}});
  });
}
function renderSongs(items,container){
  if(!items.length){container.innerHTML='<p class="empty">No saved songs yet. Choose a mood and tap the heart to save a favorite.</p>';return}
  container.innerHTML=items.map(([title,artist,detail,mood])=>{
    const saved=favorites.some(x=>x[0]===title&&x[1]===artist);
    const search=encodeURIComponent(`${title} ${artist} official audio`);
    return `<article class="song"><div class="song-art">♫</div><div class="song-info"><h3>${title}</h3><p>${artist} · ${detail}</p></div><div class="song-actions"><a class="listen" href="https://www.youtube.com/results?search_query=${search}" target="_blank" rel="noopener">Find song ↗</a><button class="heart" data-title="${encodeURIComponent(title)}" data-artist="${encodeURIComponent(artist)}" data-detail="${encodeURIComponent(detail)}" data-mood="${encodeURIComponent(mood||activeMood||"")}" aria-label="Save favorite">${saved?"♥":"♡"}</button></div></article>`;
  }).join("");
  container.querySelectorAll(".heart").forEach(btn=>btn.addEventListener("click",()=>{
    const item=[decodeURIComponent(btn.dataset.title),decodeURIComponent(btn.dataset.artist),decodeURIComponent(btn.dataset.detail),decodeURIComponent(btn.dataset.mood)];
    const index=favorites.findIndex(x=>x[0]===item[0]&&x[1]===item[1]);
    if(index>=0)favorites.splice(index,1);else favorites.push(item);
    localStorage.setItem(favoritesKey,JSON.stringify(favorites));updateCount();
    if(container===songList)showMood(activeMood);else renderSongs(favorites,container);
  }));
}
function showMood(mood){
  activeMood=mood;const data=moodData[mood];resultTitle.textContent=`${data.emoji} ${mood} Mood – Recommended Songs`;
  renderSongs(data.songs.map(s=>[...s,mood]),songList);results.classList.remove("hidden");
  document.getElementById("favoritesPanel").classList.add("hidden");
  document.getElementById("guidePanel").classList.add("hidden");
  document.getElementById("algorithmPanel").classList.add("hidden");
  results.scrollIntoView({behavior:"smooth",block:"start"});
}
function panel(id){["favoritesPanel","guidePanel","algorithmPanel"].forEach(x=>document.getElementById(x).classList.add("hidden"));document.getElementById(id).classList.remove("hidden");document.getElementById(id).scrollIntoView({behavior:"smooth",block:"start"});}
function surprise(){const moods=Object.keys(moodData);showMood(moods[Math.floor(Math.random()*moods.length)])}
document.getElementById("surpriseTop").addEventListener("click",surprise);
document.getElementById("surpriseMain").addEventListener("click",surprise);
document.getElementById("favoritesNav").addEventListener("click",()=>{renderSongs(favorites,"favoritesList");panel("favoritesPanel")});
document.getElementById("guideNav").addEventListener("click",()=>panel("guidePanel"));
document.getElementById("algorithmButton").addEventListener("click",()=>panel("algorithmPanel"));
document.getElementById("closeFavorites").addEventListener("click",()=>document.getElementById("favoritesPanel").classList.add("hidden"));
document.getElementById("closeGuide").addEventListener("click",()=>document.getElementById("guidePanel").classList.add("hidden"));
document.getElementById("closeAlgorithm").addEventListener("click",()=>document.getElementById("algorithmPanel").classList.add("hidden"));
document.getElementById("clearResults").addEventListener("click",()=>results.classList.add("hidden"));
renderMoods();updateCount();
