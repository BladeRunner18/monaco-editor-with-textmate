import React, { useRef, useEffect, useState } from 'react';
import { create } from './monaco';
import { monaco } from '@/types';

interface Props {
  options: monaco.editor.IStandaloneEditorConstructionOptions;
  value?: string;
  width?: string;
  height?: string;
  onChange?: (value: string, event: monaco.editor.IModelContentChangedEvent) => void;
}

const Editor: React.FC<Props> = (props) => {
  const { options, width, height, onChange, value } = props;
  const [loading, setLoading] = useState(true);
  const container = useRef<HTMLDivElement>(null);
  const subscription = useRef<monaco.IDisposable | null>(null);
  const editor = useRef<monaco.editor.IStandaloneCodeEditor>();

  useEffect(() => {
    create(container.current!, {
      ...options,
      value,
    }).then((e) => {
      editor.current = e;
      subscription.current = e.onDidChangeModelContent((event) => {
        onChange?.(e.getValue(), event);
      });
      setLoading(false);
    });

    return () => {
      editor.current?.dispose();
      subscription.current?.dispose();
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
  }, [value]);

  return (
    <div
      style={{
        width: width || '100%',
        height: height || '100%',
      }}
      ref={container}
    />
  );
};

export default Editor;
