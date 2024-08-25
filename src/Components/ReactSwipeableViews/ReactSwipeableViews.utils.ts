export const SIZE = 376;
export const HEIGHT = '91dvh';

export const getRandomColor = () =>
  "#041A17"
  //  + (((1 << 24) * Math.random()) | 0).toString(16).padStart(6, "0");

export const getSlideStyles = (color: string) => ({
  height: HEIGHT,
  width: "100%",
  background: "#041A17",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  fontSize: 28,
});

export const slideContainerStyle = { height: HEIGHT, width: '100vw' };
