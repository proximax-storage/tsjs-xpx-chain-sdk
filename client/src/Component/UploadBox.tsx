import React, { useState } from 'react';
import { useEffect } from 'react';
import { useDropzone } from 'react-dropzone';
import { useNotification } from '../Context/NotificationContext';

import './UploadBox.scss';

const UploadBox = ({ onSetFile }) => {
  const { warnToast } = useNotification();
  const [files, setFiles] = useState([]);

  const {
    acceptedFiles,
    fileRejections,
    getRootProps,
    getInputProps,
    isDragAccept,
    isDragReject,
  } = useDropzone({
    maxFiles: 1,
    accept: '.pdf',
  });

  const remove = (file) => {
    const newFiles = [...files];
    newFiles.splice(file, 1);

    setFiles(newFiles);
    onSetFile(null);
  };

  useEffect(() => {
    const newFiles = acceptedFiles.map((file, index) => {
      onSetFile(file);

      return (
        <li key={(file as any).path}>
          {(file as any).path}{' '}
          <button onClick={() => remove(index)}>Delete</button>
        </li>
      );
    });

    setFiles(newFiles);
  }, [acceptedFiles]);

  useEffect(() => {
    fileRejections.map(({ file, errors }) => {
      if (errors) {
        warnToast('PDF File Format Only');
      }

      return true;
    });
  }, [fileRejections]);

  return (
    <div className='upload-box'>
      <section className='upload-box__container'>
        <div {...getRootProps({ className: 'upload-box__dropzone' })}>
          <input {...getInputProps()} />
          <p>Drag 'n' drop some files here, or click to select files</p>
          <em>(The maximum number of files you can drop here is 1)</em>
        </div>
        <aside>
          {files.length ? <h4>Files</h4> : null}
          <ul>{files}</ul>
        </aside>
      </section>
    </div>
  );
};

export default UploadBox;
