/* Stockage versionné : toute lecture/écriture est protégée contre les erreurs navigateur. */
window.VodStorage=(()=>{
 const KEY="vod-marker-data-v1";let failed=false;
 function fresh(){return {version:1,session:{id:makeId(),channel:"",mode:null,markers:[],segments:[],createdAt:new Date().toISOString()},history:[],settings:{language:"fr",theme:"dark",subtract:10,shortcut:"b",clientId:"",token:"",manualValue:"",manualType:"elapsed",localOffset:"00:00:00",exportDate:false,exportNotes:true,exportHeader:false,exportOptionsVersion:1}};}
 function makeId(){return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2,9)}`;}
 function valid(data){
  if(!data||data.version!==1||!data.session||!Array.isArray(data.session.markers)||!Array.isArray(data.history)||!data.settings)return false;
  const goodMarker=m=>m&&typeof m.id==="string"&&typeof m.timecode==="string"&&typeof m.realAt==="string"&&typeof m.mode==="string";
  if(!data.session.markers.every(goodMarker))return false;
  return data.history.every(item=>item&&Array.isArray(item.markers)&&item.markers.every(goodMarker));
 }
 function load(){try{const raw=localStorage.getItem(KEY);if(!raw)return {data:fresh(),corrupt:false};const parsed=JSON.parse(raw);if(!valid(parsed))throw Error("invalid");const base=fresh();parsed.settings={...base.settings,...parsed.settings};parsed.session={...base.session,...parsed.session,segments:Array.isArray(parsed.session.segments)?parsed.session.segments:[]};parsed.history=parsed.history.slice(0,30).map(item=>({...item,segments:Array.isArray(item.segments)?item.segments:[]}));return {data:parsed,corrupt:false};}catch(error){failed=true;try{localStorage.removeItem(KEY);}catch(_){}return {data:fresh(),corrupt:true};}}
 function save(data){try{localStorage.setItem(KEY,JSON.stringify(data));failed=false;return true;}catch(error){failed=true;return false;}}
 function getFailed(){return failed;}
 function archive(data){const session=data.session;if(!session||!session.markers.length)return;const archived=JSON.parse(JSON.stringify(session));archived.archivedAt=new Date().toISOString();data.history.unshift(archived);data.history=data.history.slice(0,30);}
 return {load,save,fresh,makeId,archive,getFailed};
})();
