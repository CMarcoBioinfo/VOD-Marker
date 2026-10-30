/* Client public et token de l'utilisateur : requêtes directes Helix, aucun proxy. */
window.VodTwitch=(()=>{
 async function getStream(channel,clientId,token){
  const headers={"Client-Id":clientId,"Authorization":`Bearer ${token}`};let response;try{response=await fetch(`https://api.twitch.tv/helix/streams?user_login=${encodeURIComponent(channel)}`,{headers});}catch(error){return {ok:false,kind:"network"};}
  if(response.status===401||response.status===403)return {ok:false,kind:"unauthorized"};
  if(response.status===429)return {ok:false,kind:"rate"};
  if(!response.ok)return {ok:false,kind:"generic"};
  try{const data=await response.json();if(data.data&&data.data.length)return {ok:true,stream:data.data[0]};}catch(error){return {ok:false,kind:"generic"};}
  let userResponse;try{userResponse=await fetch(`https://api.twitch.tv/helix/users?login=${encodeURIComponent(channel)}`,{headers:{"Client-Id":clientId,"Authorization":`Bearer ${token}`}});}catch(error){return {ok:false,kind:"network"};}
  if(userResponse.status===401||userResponse.status===403)return {ok:false,kind:"unauthorized"};
  if(userResponse.status===429)return {ok:false,kind:"rate"};
  if(!userResponse.ok)return {ok:false,kind:"generic"};
  try{const users=await userResponse.json();return users.data&&users.data.length?{ok:true,stream:null}:{ok:false,kind:"notFound"};}catch(error){return {ok:false,kind:"generic"};}
 }
 return {getStream};
})();
