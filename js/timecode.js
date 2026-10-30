/* Calculs fondés sur des timestamps, jamais sur un compteur d'intervalle. */
window.VodTimecode = (() => {
 const pad=n=>String(Math.floor(n)).padStart(2,"0");
 function format(seconds){seconds=Math.max(0,Math.floor(Number(seconds)||0));const h=Math.floor(seconds/3600);return `${pad(h)}:${pad(Math.floor(seconds%3600/60))}:${pad(seconds%60)}`;}
 function parse(value){const match=String(value||"").trim().match(/^(\d{1,})(?::([0-5]?\d)):(?:([0-5]?\d))$/);if(!match)return null;const hours=Number(match[1]),minutes=Number(match[2]);const seconds=Number(match[3]);return Number.isSafeInteger(hours)&&hours<=100000?hours*3600+minutes*60+seconds:null;}
 function parseClock(value){const match=String(value||"").trim().match(/^(\d{1,2}):([0-5]?\d)$/);if(!match||Number(match[1])>23)return null;return {hours:Number(match[1]),minutes:Number(match[2])};}
 function current(session,now=Date.now()){
  if(!session||!session.mode)return {seconds:0,negative:false,ready:false};let seconds;
  if(session.mode==="api"&&session.startedAt)seconds=(now-Date.parse(session.startedAt))/1000;
  else if(session.mode==="manual"&&Number.isFinite(session.anchorSeconds)&&Number.isFinite(session.anchorAt))seconds=session.anchorSeconds+(now-session.anchorAt)/1000;
  else if(session.mode==="local"&&Number.isFinite(session.offsetSeconds)&&Number.isFinite(session.localStartedAt))seconds=session.offsetSeconds+(now-session.localStartedAt)/1000;
  else return {seconds:0,negative:false,ready:false};
  const negative=seconds<0;return {seconds:Math.max(0,Math.floor(seconds)),negative,ready:true};
 }
 function manualAnchor(value,type,now=Date.now()){
  if(type==="elapsed"){const seconds=parse(value);return seconds===null?null:{seconds,anchorAt:now};}
  const clock=parseClock(value);if(!clock)return null;
  const nowDate=new Date(now);let start=new Date(nowDate);start.setHours(clock.hours,clock.minutes,0,0);
  if(start.getTime()>now)start.setDate(start.getDate()-1);
  return {seconds:(now-start.getTime())/1000,anchorAt:now};
 }
 return {format,parse,parseClock,current,manualAnchor};
})();
