import background from './assets/backgroundRedBlack.jpeg'
export const layoutStyle: React.CSSProperties = {
  minHeight:'100vh',
  display:'flex',
  flexDirection:'column'
};
export const headerStyle: React.CSSProperties = {
  textAlign: "center",
  color: "#fff",
  backgroundColor: "#e10600 ",
  height: "auto",
  padding:'0'
};
export const contentStyle: React.CSSProperties = {
  minHeight: 120,
  lineHeight: "120px",
  color: "#fff",
  padding:'40px',
  backgroundImage:`url(${background})`,
  backgroundRepeat:'round'
};
export const siderStyle: React.CSSProperties = {
  textAlign: "center",
  lineHeight: "120px",
  color: "#fff",
  backgroundColor: "#3ba0e9",
};
export const footerStyle: React.CSSProperties = {
  textAlign: "center",
  color: "white",
  backgroundColor:'black',
  marginTop: 'auto',
};
