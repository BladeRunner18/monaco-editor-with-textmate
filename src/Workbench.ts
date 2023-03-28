import type { M, monaco } from '@/types';

interface Cfg {
  monaco: M;
  editor: monaco.editor.IStandaloneCodeEditor;
}

class Workbench {
  private monaco: M;
  private editor: monaco.editor.IStandaloneCodeEditor;

  constructor(cfg: Cfg) {
    this.monaco = cfg.monaco;
    this.editor = cfg.editor;
  }

  public addActions() {
    this.addAction();
  }

  public addAction() {
    this.editor.addAction({
      id: 'editor.action.save',
      label: 'Save',
      keybindings: [
        this.monaco.KeyMod.CtrlCmd | this.monaco.KeyCode.KeyS,
        this.monaco.KeyMod.chord(this.monaco.KeyMod.CtrlCmd, this.monaco.KeyCode.KeyS),
      ],
      contextMenuOrder: 1.5,
      contextMenuGroupId: 'navigation',
      run(editor, ...args) {
        editor.getAction('editor.action.formatDocument')?.run();
      },
    });
  }
}

export default Workbench;
