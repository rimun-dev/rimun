const toBase64 = (file: File): Promise<string | null> =>
  // from https://stackoverflow.com/questions/36280818/how-to-convert-file-to-base64-in-javascript
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      const res = reader.result;
      resolve(res ? res.toString() : null);
    };
    reader.onerror = (error) => reject(error);
  });

export default toBase64;
