import { getDefaultKeyBinding,
         KeyBindingUtil} from 'draft-js';

const {hasCommandModifier} = KeyBindingUtil;

function myKeyBindingFn (e){
  if(e.keyCode === 83 && hasCommandModifier(e)){
    return 'myeditor-save';
  }else if(e.keyCode === 13){
    return 'enter-login';
  }
  return getDefaultKeyBinding(e);
}

export default myKeyBindingFn;
