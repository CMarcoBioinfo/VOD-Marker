/* Client public et token de l'utilisateur : requêtes directes Helix, aucun proxy. */
window.VodTwitch=(()=>{
 async function validateToken(token){
  let response;try{response=await fetch("https://id.twitch.tv/oauth2/validate",{headers:{Authorization:`OAuth ${token}`}});}catch(error){return {ok:false,kind:"network"};}
  if(response.status===401)return {ok:false,kind:"unauthorized"};
  if(!response.ok)return {ok:false,kind:"network"};
  try{const data=await response.json();return typeof data.client_id==="string"?{ok:true,clientId:data.client_id,login:data.login||""}:{ok:false,kind:"unauthorized"};}catch(error){return {ok:false,kind:"network"};}
 }
 async function getStream(channel,clientId,token){
  const headers={"Client-Id":clientId,"Authorization":`Bearer ${token}`};let response;try{response=await fetch(`https://api.twitch.tv/helix/streams?user_login=${encodeURIComponent(channel)}`,{headers});}catch(error){return {ok:false,kind:"network"};}
  if(response.status===401||response.status===403)return {ok:false,kind:"unauthorized"};
  if(response.status===429)return {ok:false,kind:"rate"};
  if(!response.ok)return {ok:false,kind:"generic"};
  try{const data=await response.json();if(data.data&&data.data.length){const stream=data.data[0];return {ok:true,stream,user:{id:stream.user_id,login:stream.user_login,displayName:stream.user_name}};}}catch(error){return {ok:false,kind:"generic"};}
  let userResponse;try{userResponse=await fetch(`https://api.twitch.tv/helix/users?login=${encodeURIComponent(channel)}`,{headers:{"Client-Id":clientId,"Authorization":`Bearer ${token}`}});}catch(error){return {ok:false,kind:"network"};}
  if(userResponse.status===401||userResponse.status===403)return {ok:false,kind:"unauthorized"};
  if(userResponse.status===429)return {ok:false,kind:"rate"};
  if(!userResponse.ok)return {ok:false,kind:"generic"};
  try{const users=await userResponse.json();if(!users.data||!users.data.length)return {ok:false,kind:"notFound"};const user=users.data[0];return {ok:true,stream:null,user:{id:user.id,login:user.login,displayName:user.display_name}};}catch(error){return {ok:false,kind:"generic"};}
 }
 return {getStream,validateToken};
})();
