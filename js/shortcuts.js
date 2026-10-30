/* Raccourci configurable ; aucune interception lors d'une saisie ou répétition. */
window.VodShortcuts=(()=>{
 function attach(input,button,getKey){input.addEventListener("keydown",event=>{if(event.key==="Enter"){event.preventDefault();input.blur();}});document.addEventListener("keydown",event=>{const target=event.target;const typing=target instanceof HTMLElement&&(target.isContentEditable||["INPUT","TEXTAREA","SELECT"].includes(target.tagName));if(typing||event.repeat||event.ctrlKey||event.metaKey||event.altKey)return;const key=String(getKey()||"m").toLowerCase();if(event.key.toLowerCase()===key){event.preventDefault();button.click();}});}
 return {attach};
})();
