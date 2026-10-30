/* Génération de texte sans HTML et copie compatible avec file://. */
window.VodExport=(()=>{
 function format(session,options,t){
  const rows=[];if(options.header){const marker=session.markers.find(item=>item.streamerName||item.channel);const streamer=session.streamerName||marker?.streamerName||"";const login=session.channel||marker?.channel||"";const channel=streamer?`${streamer}${login&&login.toLowerCase()!==streamer.toLowerCase()?` (@${login})`:''}`:login||t("unsynced");rows.push(t("exportHeaderLine",{channel}));rows.push("");}
  if(!session.markers.length)rows.push(t("noMarkersExport"));
  for(const marker of session.markers){let line=marker.timecode;if(options.date)line+=` - ${new Date(marker.realAt).toLocaleString()}`;if(options.notes&&marker.note)line+=` — ${marker.note}`;rows.push(line);}
  return rows.join("\n");
 }
 async function copy(text){try{if(navigator.clipboard&&window.isSecureContext){await navigator.clipboard.writeText(text);return true;}}catch(_){}try{const area=document.createElement("textarea");area.value=text;area.setAttribute("readonly","");area.style.position="fixed";area.style.opacity="0";document.body.appendChild(area);area.select();const result=document.execCommand("copy");area.remove();return result;}catch(_){return false;}}
 function download(text,name="marqueurs-vod.txt"){const blob=new Blob([text],{type:"text/plain;charset=utf-8"});const link=document.createElement("a");link.href=URL.createObjectURL(blob);link.download=name;document.body.appendChild(link);link.click();link.remove();setTimeout(()=>URL.revokeObjectURL(link.href),1000);}
 return {format,copy,download};
})();
