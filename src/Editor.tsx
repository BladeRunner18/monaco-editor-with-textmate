import React, { useRef, useEffect, useState } from 'react';
import { create } from './monaco';
import { observerElement } from './util/observer';
import { monaco } from '@/types';

interface Props {
  options: monaco.editor.IStandaloneEditorConstructionOptions;
  value?: string;
  width?: string;
  height?: string;
  onChange?: (value: string, event: monaco.editor.IModelContentChangedEvent) => void;
  editor?: React.MutableRefObject<monaco.editor.IStandaloneCodeEditor | undefined>;
  resize?: boolean;
}

interface Other {
  useEditor?: () => [React.MutableRefObject<monaco.editor.IStandaloneCodeEditor | undefined>];
}

const Editor: React.FC<Props> & Other = (props) => {
  const { options, width, height, onChange, value, editor: outerEditor, resize } = props;
  const [loading, setLoading] = useState(true);
  const container = useRef<HTMLDivElement>(null);
  const subscription = useRef<monaco.IDisposable | null>(null);
  const editor = useRef<monaco.editor.IStandaloneCodeEditor>();
  const valueRef = useRef<string | undefined>('');
  const observerRef = useRef<ReturnType<typeof observerElement>>();

  useEffect(() => {
    create(container.current!, {
      ...options,
      value,
    }).then((e) => {
      editor.current = e;
      subscription.current = e.onDidChangeModelContent((event) => {
        onChange?.(e.getValue(), event);
      });
      if (valueRef.current !== value) {
        const model = e.getModel();
        model?.setValue(valueRef.current || '');
      }
      if (outerEditor) {
        outerEditor.current = editor.current;
      }
      setLoading(false);
    });

    if (resize) {
      observerRef.current = observerElement(container.current as Element, () => {
        editor.current?.layout();
      });
    }

    return () => {
      editor.current?.dispose();
      subscription.current?.dispose();
      observerRef.current?.dispose();
    };
  }, []);

  useEffect(() => {
    if (!loading) {
      editor.current?.updateOptions(options);
    }
  }, [options]);

  useEffect(() => {
    if (editor.current) {
      const model = editor.current.getModel();
      model?.setValue(value || '');
    }
    valueRef.current = value;
  }, [value]);

  return (
    <div
      style={{
        width: width || '100%',
        height: height || '100%',
      }}
      ref={container}
    >
    </div>
  );
};

const useEditor = (): [React.MutableRefObject<monaco.editor.IStandaloneCodeEditor | undefined>] => {
  const editor = useRef<monaco.editor.IStandaloneCodeEditor>();
  return [editor];
};

Editor.useEditor = useEditor;

export default Editor;
