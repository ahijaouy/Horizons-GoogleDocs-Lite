import { getDefaultKeyBinding,
         KeyBindingUtil} from 'draft-js';

const {hasCommandModifier} = KeyBindingUtil;

function myKeyBindingFn (e){
  if(e.keyCode === 83 && hasCommandModifier(e)){
    return 'myeditor-save';
  }
  return getDefaultKeyBinding(e);
}

export default myKeyBindingFn;
