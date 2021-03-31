import React from 'react';

export const JSONFileUpload = React.forwardRef(
  ({ onChange, onError }: { onChange?; onError? }, ref: any) => {
    const handleInputChange = e => {
      let reader = new FileReader();
      let file = e.target.files[0];

      if (file) {
        reader.onloadend = () => {
          try {
            let data = JSON.parse(reader.result as string);
            onChange(data);
          } catch (e) {
            onError(e);
          }
        };
        reader.readAsText(file);
      } else {
        const error = new Error('no file');
        onError(error);
      }
    };

    return (
      <input
        type="file"
        name="File"
        style={{ display: 'none' }}
        accept=".json"
        ref={ref}
        onChange={handleInputChange}
      />
    );
  },
);
