const CustomFileInput = ({ handleFileUpload }) => {
  return <input type="file" accept=".xlsx, .xls" onChange={handleFileUpload} />;
};
export default CustomFileInput;
