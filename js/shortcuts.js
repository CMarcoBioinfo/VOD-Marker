/* Raccourcis configurables avec modificateurs ; aucune interception lors d'une saisie. */
window.VodShortcuts=(()=>{
 const MODIFIERS=['Control','Alt','Shift','Meta'];
 function keyName(key){if(key===' ')return 'Space';return key.length===1?key.toUpperCase():key;}
 function fromEvent(event){const modifiers=[];if(event.ctrlKey)modifiers.push('Ctrl');if(event.altKey)modifiers.push('Alt');if(event.shiftKey)modifiers.push('Shift');if(event.metaKey)modifiers.push('Meta');const key=event.key;if(MODIFIERS.some(modifier=>modifier.toLowerCase()===key.toLowerCase()))return null;return [...modifiers,keyName(key)].join('+');}
 function attach(button,getShortcut,isCapturing=()=>false){document.addEventListener('keydown',event=>{if(isCapturing())return;const target=event.target;const typing=target instanceof HTMLElement&&(target.isContentEditable||['INPUT','TEXTAREA','SELECT'].includes(target.tagName));if(typing||event.repeat||event.isComposing)return;const pressed=fromEvent(event),configured=String(getShortcut()||'B');if(pressed&&pressed.toLowerCase()===configured.toLowerCase()){event.preventDefault();button.click();}});}
 return {attach,fromEvent,keyName};
})();
