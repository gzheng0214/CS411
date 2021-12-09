export const loadImage = (imageurl) => {
  return new Promise((resolve, reject) => {
    const loadImg = new Image();
    loadImg.src = imageurl;
    loadImg.onload = () => resolve(imageurl);
    loadImg.onerror = (err) => reject(err);
  });
};
