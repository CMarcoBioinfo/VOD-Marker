/* Génération de texte sans HTML et copie compatible avec file://. */
window.VodExport=(()=>{
 function format(session,options,t){
  const rows=[];if(options.header){const started=session.startedAt||session.segments?.[session.segments.length-1]?.startedAt;const date=started?new Date(started).toLocaleString():t("dateNone");rows.push(t("exportHeaderLine",{channel:session.channel||t("unsynced"),date}));rows.push("");}
  if(!session.markers.length)rows.push(t("noMarkersExport"));
  for(const marker of session.markers){let line=marker.timecode;const streamer=marker.streamerName?`${marker.streamerName}${marker.channel&&marker.channel.toLowerCase()!==marker.streamerName.toLowerCase()?` (@${marker.channel})`:''}`:marker.channel;if(streamer)line+=` — ${streamer}`;if(options.date)line+=` - ${new Date(marker.realAt).toLocaleString()}`;if(options.notes&&marker.note)line+=` — ${marker.note}`;line+=` [${marker.reliabilityLabel||marker.reliability}]`;rows.push(line);}
  return rows.join("\n");
 }
 async function copy(text){try{if(navigator.clipboard&&window.isSecureContext){await navigator.clipboard.writeText(text);return true;}}catch(_){}try{const area=document.createElement("textarea");area.value=text;area.setAttribute("readonly","");area.style.position="fixed";area.style.opacity="0";document.body.appendChild(area);area.select();const result=document.execCommand("copy");area.remove();return result;}catch(_){return false;}}
 function download(text,name="marqueurs-vod.txt"){const blob=new Blob([text],{type:"text/plain;charset=utf-8"});const link=document.createElement("a");link.href=URL.createObjectURL(blob);link.download=name;document.body.appendChild(link);link.click();link.remove();setTimeout(()=>URL.revokeObjectURL(link.href),1000);}
 return {format,copy,download};
})();
